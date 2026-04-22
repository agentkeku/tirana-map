const CATEGORY_COLORS = {
  Coffee:     '#C8583A',
  Restaurant: '#3B6D11',
  Bar:        '#185FA5',
  Nightlife:  '#993556',
  Shopping:   '#8B7355',
  'Day Trip': '#2D5A3D',
};

export default function SpotPanel({ spot, onClose, onBuy }) {
  if (!spot) return null;

  const color = CATEGORY_COLORS[spot.category] ?? '#888';

  if (spot.locked) {
    return (
      <div className="h-full flex flex-col p-6 justify-center items-center text-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
          style={{ backgroundColor: color }}
        >
          🔒
        </div>
        <h3 className="text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
          This spot is locked
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Get all 37 insider locations — restaurants, bars, hidden gems and day trips — for a one-time payment.
        </p>
        <button
          onClick={onBuy}
          className="mt-2 px-6 py-3 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1A1410' }}
        >
          Unlock all 37 spots — €4
        </button>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 underline">
          Back to map
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Category tag */}
      <div className="px-6 pt-6 pb-3">
        <span
          className="inline-block text-xs font-medium px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {spot.category}
        </span>
      </div>

      {/* Name */}
      <div className="px-6 pb-4">
        <h2 className="text-2xl leading-snug" style={{ fontFamily: 'Playfair Display, serif' }}>
          {spot.name}
        </h2>
      </div>

      {/* Description */}
      <div className="px-6 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed">{spot.description}</p>
      </div>

      {/* Local tip */}
      {spot.localTip && (
        <div className="mx-6 my-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-700 mb-1 uppercase tracking-wide">Local tip</p>
          <p className="text-sm text-amber-900 leading-relaxed">{spot.localTip}</p>
        </div>
      )}

      <div className="flex-1" />

      {/* Close */}
      <div className="px-6 pb-6">
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 border border-gray-200 rounded-full transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
