export default function StatCard({ label, value, sublabel, colorClass = 'text-indigo-600' }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`text-3xl font-bold ${colorClass}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-sm font-medium text-gray-900 mt-1">{label}</div>
      {sublabel && (
        <div className="text-xs text-gray-500 mt-1">{sublabel}</div>
      )}
    </div>
  )
}
