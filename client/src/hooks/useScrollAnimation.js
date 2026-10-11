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
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      },
    );

    const isExcluded = (el) => {
      return (
        el.closest(
          ".sidebar, .topbar, .finance-chatbot, .modal, .modal-backdrop, .toast, .brand, .recharts-wrapper, .window-dots",
        ) !== null
      );
    };

    const attachAnimations = () => {
      // 1. Headings & Paragraphs (Slide in from LEFT)
      const textElements = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, p, .page-header-text, .hero-copy h1, .hero-copy p, .section-head-centered h2, .section-sub, .workflow-intro h2, .workflow-intro p, .assistant-spotlight-left h2, .assistant-spotlight-left p, .cta-banner-card h2, .cta-banner-card p, .panel-title-group h2, .panel-subtitle, .auth-header-block h1, .auth-header-block p, .auth-hero-aside h2, .aside-subtext, .chart-title-with-icon h3, .chart-subtitle, .settings-section-head h3, .settings-sub",
      );

      textElements.forEach((el) => {
        if (isExcluded(el) || el.classList.contains("is-revealed")) return;
        if (!el.classList.contains("reveal-left")) {
          el.classList.add("reveal-left");
        }
        observer.observe(el);
      });

      // 2. Images & Cards (Slide in from RIGHT)
      const cardSelectors = [
        "img:not(.brand *):not(.sidebar *):not(.topbar *)",
        ".card",
        ".stat-card",
        ".chart-card",
        ".chart-card-elevated",
        ".pillar-card",
        ".feature",
        ".budget-card-item",
        ".budget",
        ".goal-card-elevated",
        ".goal",
        ".notification-card-item",
        ".notification",
        ".report-overview-container",
        ".report-kpi-card",
        ".report",
        ".live-command-center",
        ".hero-preview-wrapper",
        ".command-kpi-item",
        ".workflow-step-card",
        ".assistant-spotlight-card",
        ".table-container",
        ".auth-hero-aside",
        ".recent-activity-row",
        ".budget-month-banner",
        ".goals-summary-banner",
        ".year-selector-bar",
        ".telemetry-graphic-box",
      ];

      document.querySelectorAll(cardSelectors.join(",")).forEach((el) => {
        if (isExcluded(el) || el.classList.contains("is-revealed")) return;
        if (
          !el.classList.contains("reveal-right") &&
          !el.classList.contains("reveal-left")
        ) {
          el.classList.add("reveal-right");
        }

        // Stagger cards if inside a grid, list, or row
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (c) =>
              c.matches &&
              (c.matches(".stat-card") ||
                c.matches(".pillar-card") ||
                c.matches(".feature") ||
                c.matches(".budget-card-item") ||
                c.matches(".goal-card-elevated") ||
                c.matches(".notification-card-item") ||
                c.matches(".chart-card-elevated") ||
                c.matches(".command-kpi-item") ||
                c.matches(".workflow-step-card") ||
                c.matches(".recent-activity-row") ||
                c.matches(".report-category-row") ||
                c.matches(".ledger-kpi-card") ||
                c.matches(".analytics-kpi-card") ||
                c.matches(".report-kpi-card")),
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
        ".trust-strip",
        ".trust-item",
        ".command-signals-list",
        ".command-signal-row",
        ".assistant-dialog-preview",
        ".cta-action-btn",
        ".ledger-filters-bar",
        ".filters",
        ".page-header-actions",
        ".insight-card",
        ".savings-pace-container",
        ".quick-actions-bar",
        ".aside-highlight-item",
        ".aside-highlights-list",
        ".period-segmented-control",
        ".quick-years-cluster",
        ".sample-query-pill",
        ".sample-response-card",
        ".auth-form-card",
        ".auth-switch",
        ".back-home",
        ".settings-alert-banner",
        ".settings-fields-group",
        ".theme-options-grid",
        ".security-notice-box",
        ".settings-footer-actions",
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

        // Stagger list items or small items
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (c) =>
              c.matches &&
              (c.matches(".trust-item") ||
                c.matches(".aside-highlight-item") ||
                c.matches(".command-signal-row") ||
                c.matches("li")),
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
        .querySelectorAll(
          ".scroll-reveal:not(.is-revealed), [data-reveal]:not(.is-revealed), .reveal-left:not(.is-revealed), .reveal-right:not(.is-revealed), .reveal-bottom:not(.is-revealed)",
        )
        .forEach((el) => {
          if (!isExcluded(el)) {
            observer.observe(el);
          }
        });
    };

    // Initial attach
    attachAnimations();

    // Re-check after async data load (e.g. dashboard statistics, transactions list)
    const timer1 = setTimeout(attachAnimations, 100);
    const timer2 = setTimeout(attachAnimations, 350);
    const timer3 = setTimeout(attachAnimations, 800);

    // MutationObserver to capture any dynamic elements loaded asynchronously
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
