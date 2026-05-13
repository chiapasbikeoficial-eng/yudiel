import React from 'react';
import { Cpu, Terminal, Wifi, Activity, ChevronRight, Radio, Network } from 'lucide-react';

const interfaces = [
  { id: '1', name: 'wlan0', type: 'Managed', active: false },
  { id: '2', name: 'wlan0mon', type: 'Monitor', active: true },
  { id: '3', name: 'eth0', type: 'Ethernet', active: false },
  { id: '4', name: 'lo', type: 'Loopback', active: false },
];

const processes = [
  { name: 'aircrack-ng', pid: 1402, status: 'IDLE' },
  { name: 'airodump-ng', pid: 1405, status: 'RUNNING' },
  { name: 'aireplay-ng', pid: 1410, status: 'LOCKED' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-kali-panel border-r border-kali-border flex flex-col h-full">
      <div className="p-4 border-b border-kali-border">
        <div className="flex items-center gap-2 mb-4 text-[11px] font-mono opacity-50">
          <Terminal size={12} />
          <span>NET_INTERFACES</span>
        </div>
        
        <div className="space-y-4">
          <div className="group cursor-pointer">
            <div className="flex items-center justify-between text-[11px] font-mono text-kali-accent mb-1 px-2">
              <span className="flex items-center gap-2 uppercase tracking-tighter"><Wifi size={14}/> RF_MONITOR</span>
              <ChevronRight size={14} />
            </div>
            <div className="h-0.5 bg-kali-accent/30 w-full rounded-full overflow-hidden">
              <div className="h-full bg-kali-accent w-full animate-[loading_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {interfaces.map((iface) => (
            <button
              key={iface.id}
              className={`w-full flex items-center justify-between px-3 py-2 rounded font-mono text-[11px] transition-all group ${
                iface.active 
                  ? 'bg-kali-accent/20 text-kali-accent border border-kali-accent/30 shadow-[0_0_10px_rgba(0,209,255,0.1)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio size={14} className={iface.active ? 'text-kali-accent' : 'text-gray-600'} />
                <span className="uppercase tracking-tight font-bold">{iface.name}</span>
              </div>
              <span className="text-[9px] opacity-40 group-hover:opacity-100">{iface.type}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 px-2">
           <div className="text-[9px] font-mono opacity-40 uppercase mb-2 px-1">Active_Procs</div>
           <div className="space-y-2">
             {processes.map((proc, i) => (
               <div key={i} className="flex items-center justify-between font-mono text-[10px] px-2 py-1 bg-black/20 rounded border border-white/5">
                 <span className="text-gray-400">{proc.name}</span>
                 <span className={proc.status === 'RUNNING' ? 'text-kali-green' : 'text-gray-600'}>{proc.status}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="p-4 border-t border-kali-border bg-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-kali-accent text-[11px] font-mono">
            <Activity size={14} />
            <span>PKTS/SEC: 4,120</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="h-12 w-full bg-black/40 border border-kali-border overflow-hidden flex items-end gap-[1px] p-1">
             {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-full bg-kali-accent/30" 
                  style={{ height: `${20 + Math.random() * 80}%` }} 
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
