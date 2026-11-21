function OverviewPage() {
  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Overview</h2>
          <p>This prototype demonstrates a professional collaborative selling flow for two creators on one product.</p>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span className="step-index">01</span>
            <strong>Introduction</strong>
            <p>Start with the collaboration setup flow for a shared course, workshop, or digital product.</p>
          </article>
          <article className="step-card">
            <span className="step-index">02</span>
            <strong>Collab</strong>
            <p>Creator A creates the collab and sends the invite code to Creator B on the same page.</p>
          </article>
          <article className="step-card">
            <span className="step-index">03</span>
            <strong>Set percentages</strong>
            <p>Both creators review and lock the revenue split before the product setup can continue.</p>
          </article>
          <article className="step-card">
            <span className="step-index">04</span>
            <strong>Upload product</strong>
            <p>Add the product name, description, price, and asset details for the shared listing.</p>
          </article>
          <article className="step-card">
            <span className="step-index">05</span>
            <strong>Ledger</strong>
            <p>The ledger records total product revenue and each creator’s individual revenue from every order.</p>
          </article>
          <article className="step-card">
            <span className="step-index">06</span>
            <strong>Wallets</strong>
            <p>Both creators see total revenue, earned revenue, and pending settlement in professional wallet views.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default OverviewPage;
