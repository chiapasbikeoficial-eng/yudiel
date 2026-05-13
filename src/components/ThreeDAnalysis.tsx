'use client'

import React from 'react';
import { SplineScene } from "@/src/components/ui/splite";
import { Card } from "@/src/components/ui/card"
import { Spotlight } from "@/src/components/ui/spotlight"
import { Wifi, Zap, ShieldCheck } from 'lucide-react';
 
export function ThreeDAnalysis() {
  return (
    <Card className="w-full h-full bg-kali-bg relative overflow-hidden border-none flex flex-col p-6">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#00d1ff"
      />
      
      <div className="flex h-full flex-col lg:flex-row gap-6 relative z-10">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-kali-accent to-kali-accent/30 font-mono tracking-tighter uppercase">
              Signal Analysis 3D
            </h1>
            <p className="text-gray-400 max-w-lg font-mono text-sm leading-relaxed">
              Visualizing electromagnetic wave patterns and node distribution in terminal space. 
              Real-time vector rendering of intercepted signal packets.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-kali-border p-4 rounded-lg flex items-center gap-3">
              <Wifi size={24} className="text-kali-accent" />
              <div>
                <p className="text-[10px] uppercase font-mono opacity-50">Signal_Refraction</p>
                <p className="font-mono text-xs font-bold">88.4% OPTIMAL</p>
              </div>
            </div>
            <div className="bg-white/5 border border-kali-border p-4 rounded-lg flex items-center gap-3">
              <Zap size={24} className="text-kali-green" />
              <div>
                <p className="text-[10px] uppercase font-mono opacity-50">Pulse_Integrity</p>
                <p className="font-mono text-xs font-bold">STABLE.v4</p>
              </div>
            </div>
          </div>

          <button className="w-fit px-8 py-3 bg-kali-accent text-kali-bg font-bold font-mono text-sm rounded shadow-[0_0_20px_rgba(0,209,255,0.4)] hover:scale-105 transition-all flex items-center gap-2">
            <ShieldCheck size={18} /> INITIALIZE_SCAN_3D
          </button>
        </div>

        {/* Right content - Spline Scene */}
        <div className="flex-[1.5] relative bg-black/40 rounded-2xl border border-kali-border shadow-inner py-10">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-kali-accent to-transparent opacity-50" />
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
          <div className="absolute bottom-4 right-4 text-[9px] font-mono opacity-30 uppercase tracking-[0.2em]">
            neural_visualizer_v7
          </div>
        </div>
      </div>
    </Card>
  )
}
