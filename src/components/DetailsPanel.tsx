import React, { useState } from 'react';
import { Zap, Play, ShieldAlert, Cpu, Activity, Terminal, Crosshair, Wifi, Users, Code, Loader2 } from 'lucide-react';

export default function DetailsPanel({ selectedNetwork }: { selectedNetwork: any }) {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackStatus, setAttackStatus] = useState<string | null>(null);

  const executeDeauth = async () => {
    if (!selectedNetwork) return;
    
    setIsAttacking(true);
    setAttackStatus('Initializing...');
    
    try {
      const response = await fetch('/api/attack/deauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interface: 'wlan0mon',
          essid: selectedNetwork.essid,
          channel: selectedNetwork.channel
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAttackStatus('ATTACK_RUNNING');
      } else {
        setAttackStatus('FAILED: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setAttackStatus('CONNECTION_ERROR');
    } finally {
      // In a real app we might keep isAttacking true until user stops it
      // For this UI feedback, we'll let it stay in status for a bit
      setTimeout(() => {
        if (attackStatus !== 'ATTACK_RUNNING') setIsAttacking(false);
      }, 3000);
    }
  };

  return (
    <div className="w-96 bg-kali-panel border-l border-kali-border flex flex-col h-full overflow-y-auto">
      {/* Target Config */}
      <div className="p-4 border-b border-kali-border">
        <h3 className="font-mono text-xs font-bold text-kali-accent mb-4 flex items-center gap-2">
          <Crosshair size={14} />
          TARGET_SELECTION
        </h3>
        
        <div className="space-y-4">
          {selectedNetwork ? (
            <div className="bg-black/30 p-3 border border-kali-border rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-kali-accent font-bold">{selectedNetwork.essid}</span>
                <span className="text-[9px] font-mono opacity-40">CH: {selectedNetwork.channel}</span>
              </div>
              <div className="text-[9px] font-mono opacity-60 mb-2 truncate">BSSID: {selectedNetwork.bssid}</div>
              <div className="flex items-center gap-2">
                 <div className="flex-1 h-1 bg-kali-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${selectedNetwork.signal > -50 ? 'bg-kali-green' : 'bg-kali-accent'}`} 
                      style={{ width: `${Math.max(0, 100 + selectedNetwork.signal)}%` }} 
                    />
                 </div>
                 <span className={`text-[9px] font-mono ${selectedNetwork.signal > -50 ? 'text-kali-green' : 'text-kali-accent'}`}>
                   {selectedNetwork.signal}dBm
                 </span>
              </div>
            </div>
          ) : (
            <div className="bg-black/20 p-8 border border-dashed border-kali-border rounded flex flex-col items-center justify-center gap-3 opacity-50">
              <Crosshair size={24} className="text-gray-600" />
              <p className="text-[10px] font-mono text-center">NO_TARGET_SELECTED<br/>AWAITING_SCAN_DATA</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-mono opacity-50 block mb-1">INTERFACE:</label>
              <div className="text-[10px] font-mono text-gray-400 bg-black/30 p-1.5 border border-kali-border rounded">wlan0mon</div>
            </div>
            <div>
              <label className="text-[9px] font-mono opacity-50 block mb-1">PACKETS:</label>
              <div className="text-[10px] font-mono text-kali-accent bg-black/30 p-1.5 border border-kali-border rounded">
                {isAttacking ? '🚀 MAX_THR_8k' : 'STANDBY'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attack Console */}
      <div className="p-4 flex-1">
        <h3 className="font-mono text-xs font-bold text-kali-red mb-4 flex items-center gap-2 uppercase">
          <Zap size={14} />
          Attack_Payloads
        </h3>

        <div className="space-y-4">
          <div className={`p-4 border rounded-lg terminal-glowbox relative overflow-hidden group transition-all ${
            isAttacking ? 'bg-kali-red/20 border-kali-red' : 'bg-kali-red/5 border-kali-red/30'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wifi size={16} className={`text-kali-red ${isAttacking ? 'animate-ping' : 'animate-pulse'}`} />
                <span className="text-[11px] font-mono font-bold text-kali-red">DEAUTH_FLOOD</span>
              </div>
              {attackStatus && (
                <span className="text-[9px] font-mono text-kali-red animate-pulse font-bold">{attackStatus}</span>
              )}
            </div>
            
            <p className="text-[10px] font-mono opacity-60 mb-4 leading-relaxed tracking-tight">
              Injecting deauthentication frames to disconnect all clients from the target AP.
            </p>

            <button 
              onClick={executeDeauth}
              disabled={!selectedNetwork || isAttacking}
              className={`w-full py-2 rounded flex items-center justify-center gap-2 font-mono text-[11px] font-bold transition-all shadow-[0_0_15px_rgba(255,62,62,0.3)] 
                ${!selectedNetwork || isAttacking 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                  : 'bg-kali-red text-white hover:scale-[1.02] active:scale-95'
                }`}
            >
              {isAttacking ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Zap size={14} fill="currentColor" />
              )} 
              {isAttacking ? 'ATTACKING...' : 'EXECUTE_DEAUTH'}
            </button>
            
            {isAttacking && (
              <button 
                onClick={() => { setIsAttacking(false); setAttackStatus(null); }}
                className="w-full mt-2 border border-kali-red/30 text-kali-red py-1 text-[9px] font-mono hover:bg-kali-red/10"
              >
                TERMINATE_PROCESS
              </button>
            )}
          </div>

          <div className="bg-kali-accent/5 p-4 border border-kali-accent/30 rounded-lg group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-kali-accent" />
                <span className="text-[11px] font-mono font-bold text-kali-accent uppercase">Confusion_Scan</span>
              </div>
            </div>
            <p className="text-[10px] font-mono opacity-60 mb-4">
              Broadcasting 50+ fake access points to flood the client discovery list.
            </p>
            <button className="w-full border border-kali-accent text-kali-accent py-2 rounded flex items-center justify-center gap-2 font-mono text-[11px] hover:bg-kali-accent/10">
              <Play size={14} /> START_CONFUSION
            </button>
          </div>
        </div>

        <div className="mt-8 border-t border-kali-border pt-4">
          <div className="flex items-center gap-2 mb-3 text-kali-accent font-mono text-[10px]">
            <Code size={14} />
            <span>LOCAL_SCRIPT: SCRIPTS/DEAUTH.SH</span>
          </div>
          <div className="bg-black/40 p-3 rounded border border-kali-border font-mono text-[9px] text-gray-500 overflow-x-auto whitespace-pre leading-relaxed">
            {`# Run locally:\nsudo ./scripts/deauth.sh wlan0mon Netgear_Home 6`}
          </div>
        </div>
      </div>
      
      {/* System Resources Small */}
      <div className="p-4 bg-black/20 border-t border-kali-border mt-auto">
        <div className="font-mono text-[9px] grid grid-cols-2 gap-2 opacity-40">
          <div className="flex justify-between"><span>RAM:</span> <span>4.2GB / 16GB</span></div>
          <div className="flex justify-between"><span>SIGNAL:</span> <span className="text-kali-green">100%</span></div>
          <div className="flex justify-between"><span>CHANNELS:</span> <span>1-14, 36-165</span></div>
          <div className="flex justify-between"><span>DRV:</span> <span>ATH9K_HTC</span></div>
        </div>
      </div>
    </div>
  );
}
