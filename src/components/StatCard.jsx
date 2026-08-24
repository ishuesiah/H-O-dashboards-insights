export default function StatCard({ label, value, sublabel, colorClass = 'text-ho-forest' }) {
  return (
    <div className="bg-white shadow-sm p-6 border-l-4 border-ho-forest">
      <div className={`text-3xl font-light ${colorClass}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm font-medium text-ho-charcoal mt-1">{label}</div>
      {sublabel && (
        <div className="text-xs text-ho-bronze mt-1">{sublabel}</div>
      )}
    </div>
  )
}
