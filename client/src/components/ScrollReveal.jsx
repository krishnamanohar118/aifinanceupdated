import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  as: Component = "div",
  children,
  className = "",
  delay = 0,
  direction, // 'left' | 'right' | 'bottom'
  style,
  ...props
}) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Determine direction class according to requirements:
  // - Headings and paragraphs slide from left
  // - Images and cards slide from right
  // - Other elements slide from bottom
  let dirClass = "reveal-bottom";
  if (direction) {
    dirClass = `reveal-${direction}`;
  } else if (typeof Component === "string" && /^(h[1-6]|p)$/i.test(Component)) {
    dirClass = "reveal-left";
  } else if (/card|stat-card|feature|preview|media|image/i.test(className)) {
    dirClass = "reveal-right";
  } else if (/copy|header|title|heading|intro/i.test(className)) {
    dirClass = "reveal-left";
  }

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal ${dirClass} ${visible ? "is-visible is-revealed" : ""} ${className}`.trim()}
      style={{
        ...style,
        "--reveal-delay": typeof delay === "number" ? `${delay}ms` : delay,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
