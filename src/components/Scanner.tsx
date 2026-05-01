/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Upload, X, ShieldCheck, Zap, Info, ThumbsUp, ThumbsDown, Heart, Search, ExternalLink, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { identifySparePart } from "../services/geminiService";
import { ScanResult, PartIdentification } from "../types";

interface ScannerProps {
  onAddResult: (result: ScanResult) => void;
  favorites: ScanResult[];
  onToggleFavorite: (item: ScanResult) => void;
}

export default function Scanner({ onAddResult, favorites, onToggleFavorite }: ScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [resultData, setResultData] = useState<PartIdentification | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showTechSpecs, setShowTechSpecs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentScanResult: ScanResult | null = resultData ? {
    ...resultData,
    id: 'current', // temporary ID for the current view
    imageUrl: image || '',
    timestamp: Date.now()
  } : null;

  const isFavorite = resultData && favorites.some(f => f.partName === resultData.partName);

  const handleCapture = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      const mimeType = file.type;
      
      reader.onloadend = () => {
        const base64Content = reader.result as string;
        const base64Data = base64Content.split(',')[1];
        
        // For preview, we use the original result (with data URI header)
        // Note: PDF won't preview in a standard <img> tag, but we can handle that
        setImage(mimeType === 'application/pdf' ? '/pdf-placeholder.png' : base64Content);
        performScan(base64Data, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  const performScan = async (base64Data: string, mimeType: string) => {
    setIsScanning(true);
    setResultData(null);
    setFeedbackGiven(false);
    
    try {
      const data = await identifySparePart(base64Data, mimeType);
      setResultData(data);
      
      const newScan: ScanResult = {
        ...data,
        id: crypto.randomUUID(),
        imageUrl: mimeType === 'application/pdf' ? '/pdf-placeholder.png' : `data:${mimeType};base64,${base64Data}`,
        timestamp: Date.now()
      };
      onAddResult(newScan);
    } catch (error) {
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResultData(null);
    setIsScanning(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-32">
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 bg-industrial-900/50 border-2 border-dashed border-industrial-700 rounded-3xl group hover:border-neon-blue/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-full bg-industrial-800 flex items-center justify-center mb-6 group-hover:bg-neon-blue/20 transition-colors">
              <Camera size={32} className="text-industrial-400 group-hover:text-neon-blue transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Identify Component</h3>
            <p className="text-industrial-500 text-sm mb-8 text-center px-6">Upload photos, scans, or PDF specifications.<br/>AI processes even low-quality files.</p>
            
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-industrial-800 border border-industrial-700 rounded-xl hover:bg-industrial-700 transition-colors text-white text-sm font-bold tracking-wider">
                <Upload size={16} /> SELECT FILES
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf"
              onChange={handleCapture}
            />
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Header / Preview */}
            <div className="relative group">
              {image === '/pdf-placeholder.png' ? (
                <div className="w-full h-[400px] bg-industrial-900 rounded-3xl border border-industrial-700 flex flex-col items-center justify-center">
                  <FileText size={64} className="text-neon-blue mb-4" />
                  <span className="text-white font-bold uppercase tracking-widest">PDF Document Loaded</span>
                </div>
              ) : (
                <img 
                  src={image} 
                  alt="Uploaded part" 
                  className="w-full h-[400px] object-cover rounded-3xl border border-industrial-700" 
                />
              )}              <button 
                onClick={reset}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center">
                  <div className="w-16 h-1 bg-industrial-800 rounded-full overflow-hidden mb-6">
                    <motion.div 
                      className="h-full bg-neon-blue"
                      animate={{ x: [-64, 64] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <p className="text-neon-blue font-mono text-sm uppercase tracking-widest animate-pulse">
                    Processing digital signatures...
                  </p>
                  <p className="text-industrial-500 text-xs mt-2">Time varies based on component complexity</p>
                </div>
              )}
            </div>

            {/* Results Card */}
            {resultData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card chrome-glow p-8 space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        resultData.matchType === 'Exact Match' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        resultData.matchType === 'Likely Match' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {resultData.matchType}
                      </span>
                      <span className="text-industrial-500 font-mono text-[10px] uppercase">ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-3">{resultData.partName}</h2>
                    <p className="text-industrial-400 leading-relaxed max-w-2xl">{resultData.description}</p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle 
                          cx="48" cy="48" r="40" 
                          className="fill-none stroke-industrial-800 stroke-[4]"
                        />
                        <motion.circle 
                          cx="48" cy="48" r="40" 
                          className="fill-none stroke-neon-blue stroke-[4]"
                          initial={{ strokeDasharray: "0 251" }}
                          animate={{ strokeDasharray: `${(resultData.confidence / 100) * 251} 251` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-white">{resultData.confidence}%</span>
                        <span className="text-[8px] text-industrial-500 uppercase">Confidence</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => currentScanResult && onToggleFavorite(currentScanResult)}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite ? 'bg-red-500/20 text-red-500' : 'hover:bg-industrial-800 text-industrial-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Possible Uses */}
                  <div>
                    <h4 className="text-xs font-bold text-industrial-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                      <Zap size={14} className="text-neon-blue" />
                      Possible Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resultData.possibleUses.map((use, i) => (
                        <span key={i} className="px-3 py-2 bg-industrial-800/50 border border-industrial-700/50 rounded-lg text-sm text-industrial-100 italic">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div>
                    <h4 className="text-xs font-bold text-industrial-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                      <ShieldCheck size={14} className="text-neon-blue" />
                      Maintenance Protocol
                    </h4>
                    <ul className="space-y-2">
                      {resultData.maintenanceTips.map((tip, i) => (
                        <li key={i} className="text-sm text-industrial-300 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-industrial-600 mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Specs Expandable */}
                <div className="border-t border-industrial-800 pt-6">
                  <button 
                    onClick={() => setShowTechSpecs(!showTechSpecs)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-xs font-bold text-industrial-500 uppercase tracking-widest flex items-center gap-2">
                      <Info size={14} className="text-neon-blue" />
                      Detailed Specifications
                    </span>
                    {showTechSpecs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  <AnimatePresence>
                    {showTechSpecs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="grid md:grid-cols-3 gap-4 pt-6">
                          {Object.entries(resultData.technicalSpecifications).map(([key, val]) => (
                            <div key={key} className="bg-industrial-950/50 p-4 rounded-xl border border-industrial-800/50">
                              <span className="block text-[10px] text-industrial-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="text-sm font-mono text-industrial-200">{val}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 p-4 bg-neon-blue/5 rounded-xl border border-neon-blue/10">
                          <span className="block text-xs font-bold text-neon-blue/70 uppercase mb-2">AI Reasoning Invariant</span>
                          <p className="text-xs text-industrial-400 italic leading-relaxed">{resultData.reasoning}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* External Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(resultData.partName + ' industrial part how it works')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-800 rounded-lg hover:bg-industrial-700 transition-colors text-sm font-bold text-white uppercase tracking-wider"
                  >
                    <ExternalLink size={14} className="text-neon-blue" /> 
                    Video Guide
                  </a>
                  <button className="flex items-center gap-2 px-4 py-2 bg-industrial-800 rounded-lg hover:bg-industrial-700 transition-colors text-sm font-bold text-white uppercase tracking-wider">
                    <Search size={14} className="text-neon-blue" /> 
                    Find Supplier
                  </button>
                </div>

                {/* Feedback */}
                <div className="border-t border-industrial-800 pt-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-industrial-400">Was this identification helpful?</span>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setFeedbackGiven(true)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                        feedbackGiven ? 'bg-neon-blue text-black border-neon-blue' : 'border-industrial-700 text-industrial-300 hover:border-neon-blue'
                      }`}
                    >
                      <ThumbsUp size={16} /> YES
                    </button>
                    <button 
                      onClick={() => setFeedbackGiven(true)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-industrial-700 text-industrial-300 hover:border-red-500 transition-all"
                    >
                      <ThumbsDown size={16} /> NO
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
