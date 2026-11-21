function WalletsPage({ session, wallets, orders, formatCurrency, handleRunSettlement, settling }) {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
  const totalEarned = wallets.reduce((sum, wallet) => sum + (wallet.totalEarned || 0), 0);
  const pendingTotal = wallets.reduce((sum, wallet) => sum + (wallet.pendingBalance || 0), 0);
  const settledTotal = wallets.reduce((sum, wallet) => sum + (wallet.settledBalance || 0), 0);

  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Creator wallets</h2>
          <p>Both creators see total revenue, earned revenue, and pending settlement from the same product.</p>
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <span className="metric-label">Total product revenue</span>
            <strong className="amount">{formatCurrency(totalRevenue)}</strong>
            <span>shared across both creators</span>
          </article>
          <article className="stat-card">
            <span className="metric-label">Total earned revenue</span>
            <strong className="amount">{formatCurrency(totalEarned)}</strong>
            <span>credited to all wallets</span>
          </article>
          <article className="stat-card">
            <span className="metric-label">Pending settlement</span>
            <strong className="amount">{formatCurrency(pendingTotal)}</strong>
            <span>refund-safe holding period</span>
          </article>
          <article className="stat-card">
            <span className="metric-label">Settled revenue</span>
            <strong className="amount">{formatCurrency(settledTotal)}</strong>
            <span>already released to creators</span>
          </article>
          <article className="stat-card">
            <span className="metric-label">Settlement cycle</span>
            <strong>{session?.settlementCycleDays || 7} days</strong>
            <span>weekly payout model</span>
          </article>
        </div>

        <div className="button-row">
          <button type="button" onClick={handleRunSettlement} disabled={settling || !session?.code}>
            {settling ? "Settling..." : "Run settlement"}
          </button>
        </div>

        <div className="orders-list">
          {wallets.length === 0 ? (
            <p>No creator earnings yet.</p>
          ) : (
            wallets.map((wallet) => (
              <article className="wallet-card" key={wallet.creatorName}>
                <div>
                  <strong>{wallet.creatorName}</strong>
                  <span>{wallet.salesCount} credited orders</span>
                </div>
                <div className="wallet-metrics wallet-metrics-three">
                  <div className="metric-card">
                    <span className="metric-label">Pending</span>
                    <strong className="amount">{formatCurrency(wallet.pendingBalance)}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Settled</span>
                    <strong className="amount">{formatCurrency(wallet.settledBalance)}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Earned</span>
                    <strong className="amount">{formatCurrency(wallet.totalEarned)}</strong>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Share</span>
                    <strong>
                      {wallet.creatorName === session?.creatorAName
                        ? `${session?.creatorASplit ?? 0}%`
                        : `${session?.creatorBSplit ?? 0}%`}
                    </strong>
                  </div>
                </div>

                <div className="transaction-list">
                  {wallet.transactions?.slice(0, 4).map((transaction) => (
                    <article className="transaction-item" key={`${wallet.creatorName}-${transaction.orderId}-${transaction.createdAt}`}>
                      <div>
                        <strong>{transaction.productName}</strong>
                        <p>{transaction.status === "settled" ? "Settled" : "Pending"} until {new Date(transaction.settlementDate).toLocaleDateString("en-IN")}</p>
                      </div>
                      <span className="amount">{formatCurrency(transaction.amount)}</span>
                    </article>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default WalletsPage;
