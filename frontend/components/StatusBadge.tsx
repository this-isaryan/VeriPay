interface Props {
  status: string;
}

const COLORS: Record<string, string> = {
  uploaded: "bg-gray-200 text-gray-800",
  verified: "bg-blue-200 text-blue-800",
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        COLORS[status] || "bg-gray-100"
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}
