import { WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
export default function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">
        <WalletCards size={20} />
      </span>
      <span>FinSight AI</span>
    </Link>
  );
}
