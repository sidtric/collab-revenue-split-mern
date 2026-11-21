function OrdersPage({ session, orders, formatCurrency, handleCreateOrder, saving }) {
  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Orders</h2>
          <p>Generate purchases against the active collaborative product.</p>
        </div>

        <div className="button-row">
          <button type="button" onClick={handleCreateOrder} disabled={saving || !session?.code}>
            {saving ? "Creating..." : "Create demo purchase"}
          </button>
        </div>

        <div className="orders-list">
          {orders.length === 0 ? (
            <p>No orders yet for this collab.</p>
          ) : (
            orders.map((order) => (
              <article className="order-card" key={order.id}>
                <strong>{order.productName}</strong>
                <span>{order.creatorAName} + {order.creatorBName}</span>
                <div className="split-summary">
                  <div>
                    <span className="metric-label">Gross</span>
                    <strong className="amount">{formatCurrency(order.price)}</strong>
                  </div>
                  <div>
                    <span className="metric-label">Net</span>
                    <strong className="amount">{formatCurrency(order.netAmount)}</strong>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default OrdersPage;
