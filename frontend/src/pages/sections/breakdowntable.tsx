// components/BreakdownTable.tsx

interface BreakdownTableProps {
  data: { category: string; amount: number,name?:string }[];
}

export default function BreakdownTable({ data }: BreakdownTableProps) {
  return (
    <table className="w-full text-gray-100 border-separate border-spacing-2">
      <thead>
        <tr>
          <th className="text-left px-4 py-2">Category</th>
          <th className="text-right px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="px-4 py-2">{item.category}</td>
            <td className="px-4 py-2 text-right">{`$${item.amount}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
