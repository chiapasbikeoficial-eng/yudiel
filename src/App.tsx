/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import WifiScanner from './components/WifiScanner';
import { ThreeDAnalysis } from './components/ThreeDAnalysis';
import DetailsPanel from './components/DetailsPanel';

export default function App() {
  const [view, setView] = useState<'scanner' | 'analyze'>('scanner');
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden selection:bg-kali-accent selection:text-kali-bg">
      <div className="scanline" />
      
      {/* Top Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TopBar activeView={view} onViewChange={setView} />
      </motion.div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:block"
        >
          <Sidebar />
        </motion.div>

        {/* Main Content Area */}
        <motion.main 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 flex flex-col min-w-0 bg-kali-bg border-r border-kali-border"
        >
          <div className="flex-1 flex flex-col min-h-0 relative">
             <AnimatePresence mode="wait">
               {view === 'scanner' ? (
                 <motion.div
                   key="scanner"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="flex-1 flex flex-col min-h-0"
                 >
                   <WifiScanner 
                     onSelect={setSelectedNetwork} 
                     selectedId={selectedNetwork?.id} 
                   />
                 </motion.div>
               ) : (
                 <motion.div
                   key="analyze"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="flex-1 flex flex-col min-h-0"
                 >
                   <ThreeDAnalysis />
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </motion.main>

        {/* Right Info Panel */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden xl:block"
        >
          <DetailsPanel selectedNetwork={selectedNetwork} />
        </motion.div>
      </div>

      {/* Terminal Footer Status Bar */}
      <footer className="h-6 bg-kali-accent flex items-center px-4 font-mono text-[9px] text-kali-bg justify-between font-bold">
        <div className="flex items-center gap-4">
          <span>OPERATOR: ROOT@KALI</span>
          <span>SESSION: W_8812</span>
          <span>UPTIME: 12:44:11</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="animate-pulse">● SIGNAL SECURE</span>
          <span className="opacity-50 tracking-tighter">AES-256-GCM / 4096-BIT RSA</span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
}

