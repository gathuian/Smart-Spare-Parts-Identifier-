/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import Scanner from "./components/Scanner";
import History from "./components/History";
import Comparison from "./components/Comparison";
import { ScanResult } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [favorites, setFavorites] = useState<ScanResult[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("spare-parts-history");
    const savedFavorites = localStorage.getItem("spare-parts-favorites");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  // Save to localStorage when history/favorites change
  useEffect(() => {
    localStorage.setItem("spare-parts-history", JSON.stringify(history));
    localStorage.setItem("spare-parts-favorites", JSON.stringify(favorites));
  }, [history, favorites]);

  const addScanResult = (result: ScanResult) => {
    setHistory((prev) => [result, ...prev]);
  };

  const deleteScan = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleFavorite = (item: ScanResult) => {
    setFavorites((prev) => {
      const isFav = prev.some((f) => f.id === item.id);
      if (isFav) {
        return prev.filter((f) => f.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "landing":
        return <LandingPage onStart={() => setActiveTab("scan")} />;
      case "scan":
        return (
          <Scanner 
            onAddResult={addScanResult} 
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        );
      case "history":
        return (
          <History 
            items={history} 
            onDeleteItem={deleteScan} 
            onSelectItem={(item) => {
              // Optionally show a modal or go back to scanner with this result
              console.log("Selected:", item);
            }} 
          />
        );
      case "favorites":
        return (
          <History 
            title="Favorite Parts"
            emptyMessage="No parts bookmarked yet."
            items={favorites} 
            onDeleteItem={deleteScan} 
            onSelectItem={(item) => console.log("Selected:", item)} 
          />
        );
      case "compare":
        return <Comparison items={history} />;
      default:
        return <LandingPage onStart={() => setActiveTab("scan")} />;
    }
  };

  return (
    <div className="min-h-screen relative industrial-grid pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {activeTab !== "landing" && (
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      {/* Visual background elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-industrial-800/10" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-industrial-800/10" />
      </div>
    </div>
  );
}

