function PercentagesPage({
  form,
  session,
  updateField,
  locks,
  onToggleLock,
  handleContinue,
}) {
  const creatorBSplit = 100 - form.creatorASplit;
  const bothLocked = locks.creatorALocked && locks.creatorBLocked;

  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Revenue percentages</h2>
          <p>Define the split and require both creators to lock the percentages before continuing.</p>
        </div>

        <div className="progress-strip">
          <div className="progress-step progress-step-active">Invite accepted</div>
          <div className="progress-step progress-step-active">Set split</div>
          <div className="progress-step">Upload product</div>
          <div className="progress-step">Collect orders</div>
        </div>

        <div className="split-summary">
          <div className="metric-card">
            <span className="metric-label">Creator A</span>
            <strong>{session?.creatorAName || form.creatorAName || "Creator A"}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Creator B</span>
            <strong>{session?.creatorBName || form.creatorBName || "Creator B"}</strong>
          </div>
        </div>

        <div className="form-grid form-grid-two">
          <label className="range-field">
            Primary creator split
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
            <span className="metric-label">Second creator split</span>
            <strong>{creatorBSplit}%</strong>
          </div>
        </div>

        <div className="split-summary">
          <div className="metric-card metric-card-strong">
            <span className="metric-label">Primary creator share</span>
            <strong>{session?.creatorAName || form.creatorAName}</strong>
            <span>{form.creatorASplit}% of net revenue</span>
          </div>
          <div className="metric-card metric-card-strong">
            <span className="metric-label">Second creator share</span>
            <strong>{session?.creatorBName || form.creatorBName}</strong>
            <span>{creatorBSplit}% of net revenue</span>
          </div>
        </div>

        <div className="split-summary">
          <div className="metric-card">
            <span className="metric-label">Creator A lock</span>
            <strong>{locks.creatorALocked ? "Locked" : "Pending"}</strong>
            <button type="button" className="secondary" onClick={() => onToggleLock("creatorALocked")}>
              {locks.creatorALocked ? "Unlock" : "Lock split"}
            </button>
          </div>
          <div className="metric-card">
            <span className="metric-label">Creator B lock</span>
            <strong>{locks.creatorBLocked ? "Locked" : "Pending"}</strong>
            <button type="button" className="secondary" onClick={() => onToggleLock("creatorBLocked")}>
              {locks.creatorBLocked ? "Unlock" : "Lock split"}
            </button>
          </div>
        </div>

        <div className="button-row">
          <button type="button" onClick={handleContinue} disabled={!form.code || !bothLocked}>
            Continue to product setup
          </button>
        </div>
      </section>
    </main>
  );
}

export default PercentagesPage;
