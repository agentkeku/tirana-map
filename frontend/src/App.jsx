import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MapView from './components/MapView';
import SpotPanel from './components/SpotPanel';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

const CATEGORIES = ['Coffee', 'Restaurant', 'Bar', 'Nightlife', 'Shopping', 'Day Trip'];

const CATEGORY_COLORS = {
  Coffee:     '#C8583A',
  Restaurant: '#3B6D11',
  Bar:        '#185FA5',
  Nightlife:  '#993556',
  Shopping:   '#8B7355',
  'Day Trip': '#2D5A3D',
};

export default function App() {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/map`)
      .then((res) => { setMapData(res.data); setLoading(false); })
      .catch(() => { setError('Could not load map data.'); setLoading(false); });
  }, []);

  const spots = mapData?.spots ?? [];
  const sampleCount = spots.filter((s) => !s.locked).length;
  const lockedCount = spots.filter((s) => s.locked).length;

  function handleBuy() {
    // TODO: wire to Stripe checkout
    alert('Stripe checkout coming soon!');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF7F2]">
        <p className="text-gray-400 text-sm">Loading map…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF7F2]">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF7F2] overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-[#FAF7F2] z-10 shrink-0">
        <div>
          <h1 className="text-lg leading-none" style={{ fontFamily: 'Playfair Display, serif' }}>
            Tirana Insider
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {sampleCount} free preview · {lockedCount} locked
          </p>
        </div>
        <button
          onClick={handleBuy}
          className="px-4 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ backgroundColor: '#1A1410' }}
        >
          Unlock all — €4
        </button>
      </header>

      {/* Category filter */}
      <div className="flex gap-2 px-5 py-2.5 overflow-x-auto shrink-0 border-b border-gray-100">
        <button
          onClick={() => setActiveFilter(null)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            activeFilter === null
              ? 'bg-[#1A1410] text-white border-[#1A1410]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors"
            style={
              activeFilter === cat
                ? { backgroundColor: CATEGORY_COLORS[cat], color: '#fff', borderColor: CATEGORY_COLORS[cat] }
                : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map + panel */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Map */}
        <div className="flex-1 relative min-h-0">
          <div className="absolute inset-0">
          <MapView
            spots={spots}
            activeFilter={activeFilter}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
          />
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm z-[1000] text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
              Locked (unlock for €4)
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: '#C8583A' }} />
              Free preview
            </div>
          </div>
        </div>

        {/* Side panel */}
        {selectedSpot && (
          <div className="w-72 shrink-0 border-l border-gray-100 bg-white overflow-hidden">
            <SpotPanel
              spot={selectedSpot}
              onClose={() => setSelectedSpot(null)}
              onBuy={handleBuy}
            />
          </div>
        )}
      </div>
    </div>
  );
}
