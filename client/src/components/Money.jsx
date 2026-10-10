import { useAuth } from "../hooks/useAuth";

export default function Money({ value = 0 }) {
  const { user } = useAuth();
  const numericValue = typeof value === "number" ? value : Number(value) || 0;

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: user?.currency || "INR",
    maximumFractionDigits: 2,
  }).format(numericValue);

  return <span className="num">{formatted}</span>;
}
