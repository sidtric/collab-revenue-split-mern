import { NAV_ITEMS } from "../lib/routes";

function DemoLayout({ route, navigate, status, activeCode, children }) {
  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Production-style prototype</p>
          <h1>Collaborative revenue split</h1>
          <p className="hero-copy">
            Invite by code, set percentages, upload one shared product, and track wallet settlement with refund-safe weekly payouts.
          </p>
        </div>
        <div className="status-card">
          <span className="status-label">API state</span>
          <strong>{status}</strong>
          <span>{activeCode ? `Active code: ${activeCode}` : "No active collab yet"}</span>
        </div>
      </header>

      <nav className="demo-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-pill${route === item.id ? " nav-pill-active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {children}
    </div>
  );
}

export default DemoLayout;
