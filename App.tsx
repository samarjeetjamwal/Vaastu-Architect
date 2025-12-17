import React, { useState, useEffect } from 'react';
import { calculateAayadi } from './utils/vastuCalculations';
import { Unit, Direction, VastuResult } from './types';
import Compass from './components/Compass';
import FloorPlanner from './components/FloorPlanner';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Input State
  const [unit, setUnit] = useState<Unit>(Unit.FEET);
  const [length, setLength] = useState<number>(40);
  const [breadth, setBreadth] = useState<number>(30);
  const [height, setHeight] = useState<number>(11);
  const [entrance, setEntrance] = useState<string>(Direction.NE);
  const [nakshatra, setNakshatra] = useState<string>('');
  
  // Results State
  const [result, setResult] = useState<VastuResult | null>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Real-time Calculation
  useEffect(() => {
    if (length > 0 && breadth > 0 && height > 0) {
      const res = calculateAayadi(length, breadth, height, unit, entrance);
      setResult(res);
    }
  }, [length, breadth, height, unit, entrance, nakshatra]);

  const generatePDF = () => {
    if (!window.jspdf || !result) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(0, 96, 100); // Emerald color
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('VastuArchitect 2025 Report', 105, 20, { align: 'center' });

    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    let y = 50;
    doc.text(`Dimensions: ${length} x ${breadth} ${unit}`, 20, y);
    doc.text(`Height: ${height} ${unit}`, 120, y);
    y += 10;
    doc.text(`Entrance: ${entrance}`, 20, y);
    
    // Table
    y += 20;
    doc.setFontSize(14);
    doc.setTextColor(0, 96, 100);
    doc.text('Aayadi Calculation Results', 20, y);
    y += 10;
    
    const data = [
        ['Aaya (Income)', result.aaya.toFixed(2)],
        ['Vyaya (Expenditure)', result.vyaya.toFixed(2)],
        ['Yoni (Source)', result.yoni.toString()],
        ['Score', `${result.score}/100`]
    ];
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    data.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 30, y+=10);
    });

    // Recommendations
    y += 20;
    doc.setFontSize(14);
    doc.setTextColor(0, 96, 100);
    doc.text('Recommendations:', 20, y);
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    result.recommendations.forEach(rec => {
        const splitText = doc.splitTextToSize(`• ${rec}`, 170);
        doc.text(splitText, 20, y);
        y += (10 * splitText.length);
    });

    doc.save('Vastu_Report_2025.pdf');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <span className="text-2xl">🕉️</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    VastuArchitect 2025
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => (document.getElementById('guide-modal') as HTMLDialogElement)?.showModal()}
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                >
                    How to Use
                </button>
                <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Guidelines Modal */}
        <dialog id="guide-modal" className="p-0 rounded-xl shadow-2xl dark:bg-slate-800 dark:text-white backdrop:bg-black/50 max-w-lg w-full">
            <div className="p-6">
                <h3 className="text-xl font-bold mb-4">How to use</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li>Enter building dimensions to see real-time <strong>Aayadi</strong> calculations.</li>
                    <li>Ensure <strong>Aaya</strong> (Income) is greater than <strong>Vyaya</strong> (Loss).</li>
                    <li>Use the <strong>Compass</strong> to explore the 16 Vastu Zones.</li>
                    <li>Upload your floor plan image in the <strong>Planner</strong> section and drag rooms onto it to check alignment.</li>
                </ul>
                <div className="mt-6 flex justify-end">
                    <form method="dialog">
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Got it</button>
                    </form>
                </div>
            </div>
        </dialog>

        {/* Section 1: Inputs & Calc */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-emerald-600">
                    <span>1.</span> Building Dimensions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <select 
                            value={unit} 
                            onChange={(e) => setUnit(e.target.value as Unit)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 bg-slate-50"
                        >
                            <option value={Unit.FEET}>Feet</option>
                            <option value={Unit.METERS}>Meters</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Length</label>
                        <input 
                            type="number" value={length} onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Breadth</label>
                        <input 
                            type="number" value={breadth} onChange={(e) => setBreadth(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Height</label>
                        <input 
                            type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 bg-slate-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Entrance Direction</label>
                        <select 
                            value={entrance} 
                            onChange={(e) => setEntrance(e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 bg-slate-50"
                        >
                            {Object.values(Direction).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-emerald-600">
                        <span>2.</span> Aayadi Analysis
                    </h2>
                    {result ? (
                        <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4 text-center">
                                <div className={`p-4 rounded-xl ${result.aaya > result.vyaya ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                                    <div className="text-xs uppercase font-bold tracking-wider opacity-70">Aaya (Gain)</div>
                                    <div className="text-2xl font-bold">{result.aaya.toFixed(1)}</div>
                                </div>
                                <div className={`p-4 rounded-xl ${result.aaya > result.vyaya ? 'bg-emerald-50 text-emerald-600 dark:bg-slate-700 dark:text-slate-300' : 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-200'}`}>
                                    <div className="text-xs uppercase font-bold tracking-wider opacity-70">Vyaya (Loss)</div>
                                    <div className="text-2xl font-bold">{result.vyaya.toFixed(1)}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                <span className="font-medium">Compatibility Score</span>
                                <span className={`font-bold ${result.score > 70 ? 'text-green-500' : 'text-orange-500'}`}>{result.score}/100</span>
                            </div>

                            <div className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-100 p-4 rounded-lg">
                                <h4 className="font-bold mb-1">Key Insight:</h4>
                                <ul className="list-disc pl-4 space-y-1">
                                    {result.recommendations.slice(0, 2).map((rec, i) => <li key={i}>{rec}</li>)}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center">Enter dimensions to calculate</p>
                    )}
                </div>
                <button 
                    onClick={generatePDF}
                    className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                    Download Full Report 📄
                </button>
            </section>
        </div>

        {/* Section 3: Compass */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-8 text-emerald-600">3. Interactive Vastu Mandala Compass</h2>
            <Compass entrance={entrance} />
        </section>

        {/* Section 4: Planner */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-6 text-emerald-600">4. Interactive Floor Planner</h2>
            <p className="text-sm text-slate-500 mb-4">Upload your house plan image, then drag and drop room labels to check if they align with the compass directions above.</p>
            <FloorPlanner />
        </section>

      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="mb-2">© 2025 All rights reserved.</p>
            <p className="text-sm font-semibold text-emerald-500">Created by Samar Jeet Jamwal</p>
        </div>
      </footer>
    </div>
  );
};

export default App;