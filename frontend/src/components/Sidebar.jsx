export default function Sidebar({ sections, selected, onSelect, onLogout }) {
  return (
    <div className="sidebar">
      <div className="brand">
        <h1>AidSyncReport</h1>
        <p>FYP Documentation</p>
      </div>

      <div className="nav-links">
        {sections.map((s) => (
          <button
            key={s._id}
            className={`side-btn ${selected?._id === s._id ? "active" : ""}`}
            onClick={() => onSelect(s)}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Logout Button yahan add kiya hai */}
      <div className="logout-container">
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}