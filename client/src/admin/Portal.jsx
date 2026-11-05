import { useEffect } from "react";
import { createPortal } from "react-dom";

// Renders drawers/modals at the end of <body>, so they always sit above
// the sticky top bar and bottom tab bar. Also stops the page scrolling behind them.
export default function Portal({ children, lock = true }) {
  useEffect(() => {
    if (!lock) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lock]);

  return createPortal(<div className="adm-portal">{children}</div>, document.body);
}
