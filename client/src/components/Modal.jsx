import { X } from "lucide-react";
export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop">
      <section className="modal card" role="dialog" aria-modal="true">
        <header>
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
