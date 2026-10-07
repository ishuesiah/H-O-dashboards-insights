const RANGES = [7, 14, 30]

export default function RangeToggle({ days, onDaysChange }) {
  return (
    <div className="flex border border-ho-tan" role="group" aria-label="Date range">
      {RANGES.map(range => (
        <button
          key={range}
          onClick={() => onDaysChange(range)}
          className={`px-3 py-1 text-xs font-medium transition-colors ${
            days === range
              ? 'bg-ho-forest text-white'
              : 'bg-white text-ho-charcoal/60 hover:text-ho-forest'
          }`}
        >
          {range}d
        </button>
      ))}
    </div>
  )
}
