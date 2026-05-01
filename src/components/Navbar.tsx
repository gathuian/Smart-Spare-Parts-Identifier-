/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Camera, History, Heart, LayoutGrid, Settings } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = [
    { id: 'scan', label: 'Scanner', icon: Camera },
    { id: 'history', label: 'History', icon: History },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'compare', label: 'Compare', icon: LayoutGrid },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card chrome-glow px-4 py-3 z-50 flex items-center gap-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-neon-blue' : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-glow"
                className="absolute -inset-x-4 -inset-y-2 bg-neon-blue/10 rounded-xl -z-10 blur-md"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
