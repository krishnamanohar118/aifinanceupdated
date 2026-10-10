import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollAnimation() {
  const location = useLocation();

  useEffect(() => {
    // Check for prefers-reduced-motion
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      document
        .querySelectorAll(".reveal-left, .reveal-right, .reveal-bottom, .scroll-reveal")
        .forEach((el) => {
          el.classList.add("is-revealed", "is-visible");
        });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed", "is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -30px 0px",
        threshold: 0.08,
      },
    );

    const isExcluded = (el) => {
      return (
        el.closest(
          ".sidebar, .topbar, .finance-chatbot, .modal, .modal-backdrop, .toast, .brand, .recharts-wrapper",
        ) !== null
      );
    };

    const attachAnimations = () => {
      // 1. Headings & Paragraphs (Slide in from LEFT)
      const textSelectors = [
        ".page-header h1",
        ".page-header p",
        ".hero-copy h1",
        ".hero-copy p",
        ".section-intro h2",
        ".section-intro p",
        ".how h2",
        ".how p",
        ".assistant-preview h2",
        ".assistant-preview p",
        ".cta h2",
        ".cta p",
        ".auth-panel h1",
        ".auth-panel p",
        ".auth-page aside h2",
        ".panel > div > h2",
        ".chart-card > h2",
        ".settings-form h2",
        ".report h2",
        ".report h3",
      ];

      document.querySelectorAll(textSelectors.join(",")).forEach((el) => {
        if (isExcluded(el) || el.classList.contains("is-revealed")) return;
        if (!el.classList.contains("reveal-left")) {
          el.classList.add("reveal-left");
        }
        observer.observe(el);
      });

      // 2. Images & Cards (Slide in from RIGHT)
      const cardSelectors = [
        ".hero-media",
        ".card",
        ".stat-card",
        ".chart-card",
        ".feature",
        ".budget",
        ".goal",
        ".report",
        ".notification",
        ".metric-grid > div",
        ".chart-placeholder",
        ".insight-pill",
        ".transaction-list",
        ".auth-page aside",
      ];

      document.querySelectorAll(cardSelectors.join(",")).forEach((el) => {
        if (isExcluded(el) || el.classList.contains("is-revealed")) return;
        if (
          !el.classList.contains("reveal-right") &&
          !el.classList.contains("reveal-left")
        ) {
          el.classList.add("reveal-right");
        }

        // Stagger cards if inside a grid or stack
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (c) =>
              c.matches &&
              (c.matches(".stat-card") ||
                c.matches(".feature") ||
                c.matches(".budget") ||
                c.matches(".goal") ||
                c.matches(".notification") ||
                c.matches(".metric-grid > div") ||
                c.matches(".chart-card")),
          );
          if (siblings.length > 1) {
            const index = siblings.indexOf(el);
            if (index > 0) {
              const delay = Math.min(index * 75, 450);
              el.style.setProperty("--reveal-delay", `${delay}ms`);
            }
          }
        }

        observer.observe(el);
      });

      // 3. Other elements (Slide in from BOTTOM)
      const otherSelectors = [
        ".eyebrow",
        ".hero-actions",
        ".trust",
        ".how ol > li",
        ".assistant-emblem",
        ".assistant-lines > span",
        ".filters",
        ".page-header-actions",
        ".insight",
        ".settings-form > div",
        ".preview-top",
        ".auth-panel form",
      ];

      document.querySelectorAll(otherSelectors.join(",")).forEach((el) => {
        if (isExcluded(el) || el.classList.contains("is-revealed")) return;
        if (
          !el.classList.contains("reveal-bottom") &&
          !el.classList.contains("reveal-left") &&
          !el.classList.contains("reveal-right")
        ) {
          el.classList.add("reveal-bottom");
        }

        // Stagger list items or pill spans
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (c) =>
              c.matches &&
              (c.matches("li") ||
                c.matches(".assistant-lines > span")),
          );
          if (siblings.length > 1) {
            const index = siblings.indexOf(el);
            if (index > 0) {
              const delay = Math.min(index * 80, 400);
              el.style.setProperty("--reveal-delay", `${delay}ms`);
            }
          }
        }

        observer.observe(el);
      });

      // 4. Any explicit ScrollReveal or reveal classes
      document
        .querySelectorAll(".scroll-reveal:not(.is-revealed), [data-reveal]:not(.is-revealed)")
        .forEach((el) => {
          if (!isExcluded(el)) {
            observer.observe(el);
          }
        });
    };

    // Initial attach
    attachAnimations();

    // Re-check after async data load (e.g. dashboard statistics, transactions list)
    const timer1 = setTimeout(attachAnimations, 120);
    const timer2 = setTimeout(attachAnimations, 400);
    const timer3 = setTimeout(attachAnimations, 900);

    // MutationObserver to capture any further dynamic elements
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldAttach = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldAttach = true;
          break;
        }
      }
      if (shouldAttach) {
        attachAnimations();
      }
    });

    const targetNode =
      document.querySelector(".app-shell main .content") ||
      document.querySelector(".landing") ||
      document.querySelector("#root");

    if (targetNode) {
      mutationObserver.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [location.pathname]);
}
