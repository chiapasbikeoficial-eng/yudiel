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
import { Activity } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('scanner');
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);

  const renderContent = () => {
    switch(view) {
      case 'scanner':
        return <WifiScanner onSelect={setSelectedNetwork} selectedId={selectedNetwork?.id} />;
      case 'analyze':
        return <ThreeDAnalysis />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-kali-bg p-20 text-center">
            <div className="w-16 h-16 bg-kali-accent/10 rounded-full flex items-center justify-center mb-6">
              <Activity className="text-kali-accent animate-pulse" size={32} />
            </div>
            <h2 className="text-2xl font-mono text-kali-accent mb-4 underline decoration-kali-accent/30 underline-offset-8">MODULE: {view.toUpperCase()}</h2>
            <p className="text-gray-500 font-mono text-sm max-w-md leading-relaxed">
              This system module is currently being initialized in the terminal environment. 
              The backend scripts associated with <span className="text-kali-accent">{view.toLowerCase()}.sh</span> are being linked.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="h-1 w-24 bg-kali-accent/20 rounded-full overflow-hidden">
                <div className="h-full bg-kali-accent w-1/3 animate-[loading_2s_infinite]" />
              </div>
            </div>
          </div>
        );
    }
  };

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
               <motion.div
                 key={view}
                 initial={{ opacity: 0, x: view === 'scanner' ? -20 : 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: view === 'scanner' ? 20 : -20 }}
                 transition={{ duration: 0.3 }}
                 className="flex-1 flex flex-col min-h-0"
               >
                 {renderContent()}
               </motion.div>
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

