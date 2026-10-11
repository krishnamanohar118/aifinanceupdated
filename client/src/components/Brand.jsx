import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-logo" role="img" aria-label="FinSight" />
    </Link>
  );
}
