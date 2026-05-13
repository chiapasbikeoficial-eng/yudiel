import React from 'react';
import { 
  Wifi, 
  Signal, 
  Shield, 
  Activity, 
  Terminal, 
  Settings, 
  Zap, 
  Radio, 
  Scan, 
  Ghost, 
  Search,
  EyeOff
} from 'lucide-react';

const icons = [
  { id: 'scanner', Icon: Scan, label: 'Scanner' },
  { id: 'analyze', Icon: Activity, label: 'Monitor' },
  { id: 'deauth', Icon: Zap, label: 'Deauth' },
  { id: 'confusion', Icon: EyeOff, label: 'Confusion' },
  { id: 'ap', Icon: Radio, label: 'AP Mode' },
  { id: 'defend', Icon: Shield, label: 'Defend' },
  { id: 'stealth', Icon: Ghost, label: 'Stealth' },
  { id: 'settings', Icon: Settings, label: 'Config' },
];

export default function TopBar({ 
  activeView, 
  onViewChange 
}: { 
  activeView: string, 
  onViewChange: (view: any) => void 
}) {
  return (
    <div className="h-20 bg-kali-panel border-b border-kali-border flex items-center px-6 justify-between gap-4">
      <div className="flex items-center gap-2 mr-6">
        <div className="w-10 h-10 bg-kali-accent rounded flex items-center justify-center text-kali-bg">
          <Wifi size={24} />
        </div>
        <div className="hidden lg:block">
          <h1 className="font-mono text-xs font-bold tracking-tighter text-kali-accent uppercase text-balance">Kali WiFi Auditor</h1>
          <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">v2.4.9-Stable-X</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-1 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {icons.map(({ Icon, label, id }, idx) => {
          const isActive = activeView === id;
          return (
            <button
              key={idx}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center gap-1 p-2 rounded transition-all min-w-[64px] group ${
                isActive ? 'text-kali-accent bg-kali-accent/10 border border-kali-border' : 'text-gray-500 hover:text-kali-accent'
              }`}
            >
              <Icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-[9px] uppercase font-mono tracking-widest">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 ml-6 font-mono text-[11px]">
        <div className="hidden xl:flex items-center gap-4 text-kali-green">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-kali-green animate-pulse" />
            <span>INTERFACE: WLAN0MON</span>
          </div>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-1">
            <span className="opacity-50 text-[9px]">MODE:</span>
            <span>MONITOR</span>
          </div>
        </div>
        
        <div className="bg-kali-bg border border-kali-border px-3 py-1 flex items-center gap-2 rounded">
          <Search size={14} className="text-kali-accent" />
          <input 
            type="text" 
            placeholder="FILTER APs..." 
            className="bg-transparent border-none outline-none text-[10px] w-24 placeholder:opacity-30" 
          />
        </div>
      </div>
    </div>
  );
}
