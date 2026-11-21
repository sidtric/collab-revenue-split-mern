function RefundsPage({ form, session, preview, updateField }) {
  return (
    <main className="grid">
      <section className="card">
        <div className="card-heading">
          <h2>Refund mode</h2>
          <p>Refund handling changes once weekly settlement has already run.</p>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.settled}
            onChange={(event) => updateField("settled", event.target.checked)}
          />
          <span>Simulate post-settlement refund case</span>
        </label>
      </section>

      <section className="card card-wide">
        <div className="card-heading">
          <h2>Refund impact</h2>
          <p>
            Current rule for {session?.creatorAName || "creator A"} and{" "}
            {session?.creatorBName || "creator B"} on the active collab.
          </p>
        </div>

        <div className="bullet-list">
          {(preview?.refundPreview || []).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>
    </main>
  );
}

export default RefundsPage;
