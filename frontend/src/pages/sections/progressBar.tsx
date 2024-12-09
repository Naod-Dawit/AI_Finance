// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  total: number;
  used: number;
}

export default function ProgressBar({ total, used }: ProgressBarProps) {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <div className="w-full bg-gray-300 rounded-full h-4">
      <div
        className="bg-green-400 h-4 rounded-full text-center text-xs font-bold"
        style={{ width: `${percentage}%` }}
      >
        {`${Math.round(percentage)}%`}
      </div>
    </div>
  );
}
