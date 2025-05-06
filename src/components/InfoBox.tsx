import React from "react";

interface Props {
  title: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
}

export default function InfoBox({ title, value, subtext, icon }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-center">
      <div className="flex items-center justify-center mb-2 space-x-2">
        {icon && <div className="text-xl">{icon}</div>}
        <div className="text-sm text-gray-500">{title}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtext && <div className="text-sm font-medium text-gray-700 mt-1">{subtext}</div>}
    </div>
  );
}
