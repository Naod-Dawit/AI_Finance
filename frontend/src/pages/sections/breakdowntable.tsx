// components/BreakdownTable.tsx

interface BreakdownTableProps {
  data: { category: string; amount: number; name?: string; date?: string }[];
}

export default function BreakdownTable({ data }: BreakdownTableProps) {
  return (
    <div className="overflow-x-auto max-h-[90vh] max-w-[5000px]"> {/* Added max height for vertical scroll */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="px-4 py-2">{row.category}</td>
                <td className="px-4 py-2">${row.amount.toFixed(2)}</td>
                <td className="px-4 py-2">{row.date || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-400">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
