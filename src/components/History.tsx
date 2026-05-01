/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Trash2, Calendar, FileText, ChevronRight } from "lucide-react";
import { ScanResult } from "../types";

interface HistoryProps {
  items: ScanResult[];
  onDeleteItem: (id: string) => void;
  onSelectItem: (item: ScanResult) => void;
  title?: string;
  emptyMessage?: string;
}

export default function History({ items, onDeleteItem, onSelectItem, title = "Scan History", emptyMessage = "No scans performed yet." }: HistoryProps) {
  const [query, setQuery] = useState("");
  const [minConfidence, setMinConfidence] = useState(0);

  const filteredItems = items.filter(item => {
    const matchesQuery = item.partName.toLowerCase().includes(query.toLowerCase());
    const matchesConfidence = item.confidence >= minConfidence;
    return matchesQuery && matchesConfidence;
  }).sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">{title}</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-500 group-focus-within:text-neon-blue transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter by part name..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-industrial-900 border border-industrial-700 rounded-xl focus:outline-none focus:border-neon-blue transition-colors text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-3 glass-card px-4 py-2">
            <Filter size={14} className="text-neon-blue" />
            <input 
              type="range" 
              min="0" max="90" step="10"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseInt(e.target.value))}
              className="accent-neon-blue"
            />
            <span className="text-[10px] font-mono text-white min-w-[30px]">{minConfidence}%+</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredItems.length > 0 ? (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative overflow-hidden"
              >
                <div 
                  onClick={() => onSelectItem(item)}
                  className="flex items-center gap-4 glass-card p-4 chrome-glow cursor-pointer hover:border-neon-blue/30 transition-all"
                >
                  <img src={item.imageUrl} alt={item.partName} className="w-16 h-16 object-cover rounded-xl border border-industrial-700" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-neon-blue">{item.confidence}% MATCH</span>
                      <span className="text-[10px] text-industrial-500 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-white font-bold truncate tracking-wide">{item.partName}</h4>
                    <p className="text-xs text-industrial-500 truncate">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-2 text-industrial-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <ChevronRight size={20} className="text-industrial-700 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-industrial-900 border border-industrial-800 flex items-center justify-center mb-4 text-industrial-700">
              <FileText size={32} />
            </div>
            <p className="text-industrial-500 font-medium tracking-wide uppercase text-sm">{emptyMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
