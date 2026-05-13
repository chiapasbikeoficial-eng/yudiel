import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { exec } from "child_process";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Scanning
  app.get("/api/scan", (req, res) => {
    const { interface: iface = "wlan0", band = "2.4", duration = "5s" } = req.query;
    
    // In a real Kali setup, this command would run:
    // sudo ./scripts/scan_wifis.sh wlan0 2.4 5s
    // Since we are in a container, we will execute it but handle failure gracefully
    const scriptPath = path.join(process.cwd(), "scripts", "scan_wifis.sh");
    
    // Ensure script is executable (though it might fail if not root)
    try {
      fs.chmodSync(scriptPath, 0o755);
    } catch (e) {
      console.error("Could not chmod script", e);
    }

    const command = `sudo ${scriptPath} ${iface} ${band} ${duration}`;
    
    console.log(`Executing scan: ${command}`);

    exec(command, (error, stdout, stderr) => {
      // Even if it errors (e.g. no sudo, no wlan0), we want to show the logic is there
      // If we get stdout, we parse it. If not, we might return mock data for the PREVIEW only
      
      let results = [];
      if (stdout) {
        // Simple parser for wash output
        const lines = stdout.split("\n");
        // Skip header lines (usually first 2-3)
        const dataLines = lines.filter(l => l.match(/([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}/));
        
        results = dataLines.map((line, idx) => {
          const parts = line.trim().split(/\s+/);
          // Wash columns: BSSID, Ch, dBm, WPS, Lck, Vendor, ESSID
          return {
            id: idx + 1,
            bssid: parts[0] || "Unknown",
            channel: parseInt(parts[1]) || 0,
            signal: parseInt(parts[2]) || -100,
            encryption: parts[3] === "No" ? "OPEN" : "WPA2/AES", // Simplified
            essid: parts.slice(6).join(" ") || "Hidden",
            clients: Math.floor(Math.random() * 5) // Mock client count as wash doesn't show it directly
          };
        });
      }

      // If no results (because we're in AI Studio container), return some sample data 
      // but mark it as simulated if the command failed
      if (results.length === 0) {
        console.warn("Scan produced no results, returning simulated data for preview.");
        results = [
          { id: 1, essid: 'Netgear_Home (Simulated)', bssid: 'BC:4D:FB:12:34:56', signal: -42, channel: 6, encryption: 'WPA2/AES', clients: 4 },
          { id: 2, essid: 'TP-Link_2024 (Simulated)', bssid: '00:1D:92:83:A1:C2', signal: -55, channel: 11, encryption: 'WPA3/SAE', clients: 2 },
          { id: 3, essid: 'Coffee_Shop (Simulated)', bssid: 'A4:B1:E9:55:22:11', signal: -68, channel: 1, encryption: 'OPEN', clients: 12 },
        ];
      }

      res.json({ success: !error, networks: results, error: error ? error.message : null });
    });
  });

  // API Route for Deauth Attack
  app.post("/api/attack/deauth", (req, res) => {
    const { interface: iface, essid, channel } = req.body;
    const scriptPath = path.join(process.cwd(), "scripts", "deauth.sh");
    
    // In real execution: sudo ./scripts/deauth.sh wlan0mon Netgear_Home 6
    const command = `sudo ${scriptPath} ${iface} "${essid}" ${channel}`;
    
    console.log(`Executing deauth: ${command}`);

    // We don't wait for completion as deauth might run indefinitely or until Ctrl+C
    // In a real app we might use spawn and manage the process
    exec(command, (error, stdout, stderr) => {
       // Just return status
       res.json({ success: !error, message: "Attack command sent", error: error ? error.message : null });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
