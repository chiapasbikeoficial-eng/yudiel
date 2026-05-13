import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Shield, Lock, Unlock, Hash, Play, Zap, RefreshCw } from 'lucide-react';

interface Network {
  id: number;
  essid: string;
  bssid: string;
  signal: number;
  channel: number;
  encryption: string;
  clients: number;
}

export default function WifiScanner({ 
  onSelect, 
  selectedId 
}: { 
  onSelect: (net: Network) => void, 
  selectedId?: number 
}) {
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      const response = await fetch('/api/scan?interface=wlan0mon&band=2.4&duration=5s');
      const data = await response.json();
      if (data.networks) {
        setNetworks(data.networks);
      }
      if (data.error && !data.networks.length) {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection to backend failed');
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    startScan();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-kali-bg">
      <div className="p-4 border-b border-kali-border flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-kali-accent animate-pulse' : 'bg-kali-green'}`} />
            <h2 className="font-mono text-xs font-bold text-kali-accent uppercase">
              {isScanning ? 'WIFI_SCAN_ACTIVE' : 'WIFI_SCAN_IDLE'}
            </h2>
          </div>
          <span className="text-[10px] font-mono opacity-50">FOUND: {networks.length} APs</span>
        </div>
        <div className="flex gap-2">
          {error && <span className="text-[9px] font-mono text-kali-red animate-pulse mr-2">WARN: {error.substring(0, 30)}...</span>}
          <div className="bg-kali-panel border border-kali-border px-2 py-1 text-[9px] font-mono text-kali-green">
            HOPPING: 1, 3, 6, 11...
          </div>
          <button 
            onClick={startScan}
            disabled={isScanning}
            className="flex items-center gap-2 text-[10px] font-mono border border-kali-border px-3 py-1 hover:bg-kali-accent/10 transition-colors uppercase disabled:opacity-50"
          >
            <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
            Scan_Now
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse">
          <thead className="sticky top-0 bg-kali-bg z-10 shadow-sm shadow-black">
            <tr className="border-b border-kali-border text-gray-500 uppercase text-[9px]">
              <th className="p-3 font-medium">Signal</th>
              <th className="p-3 font-medium">ESSID (Name)</th>
              <th className="p-3 font-medium">BSSID (Mac)</th>
              <th className="p-3 font-medium">CH</th>
              <th className="p-3 font-medium">Encryption</th>
              <th className="p-3 font-medium">Nodes</th>
            </tr>
          </thead>
          <tbody>
            {networks.map((net) => (
              <tr 
                key={net.id} 
                onClick={() => onSelect(net)}
                className={`border-b border-kali-border/30 hover:bg-kali-accent/5 transition-colors group cursor-pointer ${
                  selectedId === net.id ? 'bg-kali-accent/10 border-l-2 border-l-kali-accent' : ''
                }`}
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Signal 
                      size={14} 
                      className={net.signal > -50 ? 'text-kali-green' : net.signal > -70 ? 'text-kali-accent' : 'text-kali-red'} 
                    />
                    <span className="text-[10px] opacity-60">{net.signal}dBm</span>
                  </div>
                </td>
                <td className="p-3 font-medium text-gray-300 tracking-tight">
                  <span className={net.essid.includes('Coffee') || net.essid.includes('Guest') ? 'text-kali-accent' : ''}>
                    {net.essid}
                  </span>
                </td>
                <td className="p-3 text-gray-500 font-mono text-[10px] uppercase">{net.bssid}</td>
                <td className="p-3 text-kali-accent font-bold">{net.channel}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {net.encryption === 'OPEN' ? (
                      <Unlock size={12} className="text-kali-red" />
                    ) : (
                      <Lock size={12} className="text-kali-green opacity-70" />
                    )}
                    <span className="text-[9px] opacity-60">{net.encryption}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-kali-accent">{net.clients}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-kali-accent/20 rounded">
                      <Zap size={12} className="text-kali-accent" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
