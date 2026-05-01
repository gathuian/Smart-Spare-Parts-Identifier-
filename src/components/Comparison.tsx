/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CopyPlus, X, ArrowLeftRight } from "lucide-react";
import { ScanResult } from "../types";

interface ComparisonProps {
  items: ScanResult[];
}

export default function Comparison({ items }: ComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedParts = items.filter(i => selectedIds.includes(i.id));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-10 pb-32">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h2 className="text-4xl font-bold text-white tracking-tighter uppercase mb-4">Part Comparison</h2>
        <p className="text-industrial-500 text-sm tracking-widest uppercase">Select two components for technical benchmarking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
        {selectedParts.length === 2 && (
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-industrial-950 border border-neon-blue items-center justify-center z-10 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
            <span className="text-neon-blue font-bold text-xs italic">VS</span>
          </div>
        )}

        {Array.from({ length: 2 }).map((_, idx) => {
          const part = selectedParts[idx];
          
          return (
            <div key={idx} className="relative">
              {part ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card chrome-glow overflow-hidden"
                >
                  <div className="relative h-48 group">
                    <img src={part.imageUrl} alt={part.partName} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => toggleSelect(part.id)}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-neon-blue text-black text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {part.confidence}% CONFIDENCE
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{part.partName}</h3>
                      <p className="text-xs text-industrial-500 uppercase tracking-widest mb-4">{part.matchType}</p>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(part.technicalSpecifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-industrial-800">
                          <span className="text-[10px] text-industrial-500 uppercase font-mono">{key}</span>
                          <span className="text-sm text-industrial-100 font-bold">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                       <span className="text-[10px] text-industrial-500 uppercase font-mono block mb-2">PRIMARY USES</span>
                       <div className="flex flex-wrap gap-2">
                         {part.possibleUses.map((use, i) => (
                           <span key={i} className="text-xs text-industrial-300 italic">#{use}</span>
                         ))}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div 
                  className="h-[500px] border-2 border-dashed border-industrial-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-industrial-600 hover:text-industrial-400 hover:border-industrial-700 transition-all cursor-pointer"
                  onClick={() => {/* Trigger selection overlay if we wanted one, for now we list all below */}}
                >
                  <CopyPlus size={48} className="opacity-20" />
                  <span className="text-sm font-bold uppercase tracking-widest">Select Component</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Part Selection Grid */}
      <div className="mt-20">
        <h4 className="text-xs font-bold text-industrial-500 uppercase tracking-widest mb-6 flex items-center gap-2">
          <ArrowLeftRight size={14} /> Available Components
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const isSelectable = isSelected || selectedIds.length < 2;

            return (
              <button
                key={item.id}
                disabled={!isSelectable}
                onClick={() => toggleSelect(item.id)}
                className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  isSelected ? 'border-neon-blue scale-105 shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'border-industrial-800 grayscale hover:grayscale-0'
                } ${!isSelectable ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                <img src={item.imageUrl} alt={item.partName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <p className="text-[10px] text-white font-bold truncate tracking-wide">{item.partName}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
