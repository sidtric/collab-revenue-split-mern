function ConfigurePage({
  form,
  session,
  updateField,
  applyPreset,
  handleConfigure,
  saving,
}) {
  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Configure offer</h2>
          <p>Set the shared product, split ratio, and commercial terms for the active collab.</p>
        </div>

        <div className="split-summary">
          <div className="metric-card">
            <span className="metric-label">Invite code</span>
            <strong className="code-pill">{form.code || "Create a collab first"}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Current status</span>
            <strong>{session?.status || "draft"}</strong>
          </div>
        </div>

        <div className="form-grid form-grid-two">
          <label>
            Product name
            <input
              type="text"
              value={form.productName}
              onChange={(event) => updateField("productName", event.target.value)}
            />
          </label>

          <label>
            Selling price
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => updateField("price", Number(event.target.value))}
            />
          </label>

          <label>
            Platform fee %
            <input
              type="number"
              min="0"
              max="100"
              value={form.platformFeePercent}
              onChange={(event) => updateField("platformFeePercent", Number(event.target.value))}
            />
          </label>

          <label>
            Settlement cycle
            <input type="text" value="7 days" disabled />
          </label>

          <label>
            Creator A
            <input
              type="text"
              value={form.creatorAName}
              onChange={(event) => updateField("creatorAName", event.target.value)}
            />
          </label>

          <label>
            Creator B
            <input
              type="text"
              value={form.creatorBName}
              onChange={(event) => updateField("creatorBName", event.target.value)}
            />
          </label>

          <label className="range-field">
            Creator A split
            <input
              type="range"
              min="0"
              max="100"
              value={form.creatorASplit}
              onChange={(event) => updateField("creatorASplit", Number(event.target.value))}
            />
            <span>{form.creatorASplit}%</span>
          </label>

          <div className="metric-card">
            <span className="metric-label">Creator B split</span>
            <strong>{100 - form.creatorASplit}%</strong>
          </div>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="secondary"
            onClick={() =>
              applyPreset({
                productName: "Creators Growth Masterclass",
                price: 10000,
                platformFeePercent: 10,
                creatorASplit: 60,
              })
            }
          >
            Load 10k example
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              applyPreset({
                productName: "Joint Launch Sprint",
                price: 25000,
                platformFeePercent: 12,
                creatorASplit: 50,
              })
            }
          >
            Load premium example
          </button>
          <button type="button" onClick={handleConfigure} disabled={saving || !form.code}>
            {saving ? "Saving..." : "Save collab config"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default ConfigurePage;
