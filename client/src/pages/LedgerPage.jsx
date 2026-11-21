function LedgerPage({ preview, session, orders, formatCurrency }) {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
  const creatorATotal = orders.reduce(
    (sum, order) => sum + (order.ledger?.find((entry) => entry.owner === session?.creatorAName)?.amount || 0),
    0,
  );
  const creatorBTotal = orders.reduce(
    (sum, order) => sum + (order.ledger?.find((entry) => entry.owner === session?.creatorBName)?.amount || 0),
    0,
  );

  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Revenue ledger</h2>
          <p>This page shows total product revenue and each creator’s individual revenue allocation.</p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <span className="metric-label">Total revenue</span>
            <strong className="amount">{formatCurrency(totalRevenue)}</strong>
            <span>gross across all orders</span>
          </article>
          <article className="stat-card">
            <span className="metric-label">{session?.creatorAName || "Creator A"} revenue</span>
            <strong className="amount">{formatCurrency(creatorATotal)}</strong>
            <span>{preview?.creatorASplit ?? session?.creatorASplit ?? 0}% share total</span>
          </article>
          <article className="stat-card">
            <span className="metric-label">{session?.creatorBName || "Creator B"} revenue</span>
            <strong className="amount">{formatCurrency(creatorBTotal)}</strong>
            <span>{preview?.creatorBSplit ?? session?.creatorBSplit ?? 0}% share total</span>
          </article>
        </div>

        <div className="split-summary">
          <div className="metric-card metric-card-strong">
            <span className="metric-label">Primary creator</span>
            <strong>{session?.creatorAName || "Creator A"}</strong>
            <span>{preview?.creatorASplit ?? session?.creatorASplit ?? 0}% of net revenue</span>
          </div>
          <div className="metric-card metric-card-strong">
            <span className="metric-label">Second creator</span>
            <strong>{session?.creatorBName || "Creator B"}</strong>
            <span>{preview?.creatorBSplit ?? session?.creatorBSplit ?? 0}% of net revenue</span>
          </div>
        </div>

        <div className="ledger-list">
          {(preview?.ledger || []).map((entry) => (
            <article className="ledger-item" key={`${entry.owner}-${entry.type}`}>
              <div>
                <strong>{entry.owner}</strong>
                <p>{entry.note}</p>
              </div>
              <span className="amount">{formatCurrency(entry.amount)}</span>
            </article>
          ))}
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <strong>{order.buyerName}</strong>
              <span>{order.productName}</span>
              <div className="split-summary">
                <div>
                  <span className="metric-label">Gross</span>
                  <strong className="amount">{formatCurrency(order.price)}</strong>
                </div>
                <div>
                  <span className="metric-label">Created</span>
                  <strong>{new Date(order.createdAt).toLocaleDateString("en-IN")}</strong>
                </div>
                <div>
                  <span className="metric-label">Status</span>
                  <strong>{order.settlementStatus}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-heading">
          <h2>Settlement logic</h2>
          <p>Revenue is credited immediately but settled later.</p>
        </div>

        <div className="bullet-list">
          <p>Platform fee is reserved first.</p>
          <p>Both creators receive pending wallet credits.</p>
          <p>Payout is released after {session?.settlementCycleDays || 7} days.</p>
        </div>
      </section>

      <section className="card">
        <div className="card-heading">
          <h2>Per-order summary</h2>
          <p>Current commercial preview for one sale.</p>
        </div>

        <div className="stats-grid stats-grid-compact">
          <article className="stat-card">
            <span className="metric-label">Gross</span>
            <strong className="amount">{formatCurrency(preview?.gross || 0)}</strong>
          </article>
          <article className="stat-card">
            <span className="metric-label">Fee</span>
            <strong className="amount">{formatCurrency(preview?.fee || 0)}</strong>
          </article>
          <article className="stat-card">
            <span className="metric-label">Net</span>
            <strong className="amount">{formatCurrency(preview?.net || 0)}</strong>
          </article>
        </div>
      </section>
    </main>
  );
}

export default LedgerPage;
