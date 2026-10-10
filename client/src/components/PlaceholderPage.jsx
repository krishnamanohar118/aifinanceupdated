import { Construction } from "lucide-react";
import PageHeader from "./PageHeader";
export default function PlaceholderPage({ title, description }) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <section className="placeholder card">
        <Construction size={34} />
        <h2>Coming in a future phase</h2>
        <p>
          This area is ready in the navigation and layout. Its finance
          functionality has intentionally not been built yet.
        </p>
      </section>
    </>
  );
}
