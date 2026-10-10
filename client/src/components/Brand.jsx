import { WalletCards } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark">
        <WalletCards size={18} />
      </span>
      <span className="brand-text">
        <span className="brand-name">FinSight</span>
        <span className="brand-badge">AI</span>
      </span>
    </Link>
  );
}
