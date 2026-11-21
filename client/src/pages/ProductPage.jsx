import { useRef } from "react";

function ProductPage({
  form,
  preview,
  orders,
  formatCurrency,
  updateField,
  applyPreset,
  handlePublishProduct,
  handleCreateOrder,
  handleSeedOrders,
  saving,
  orderSaving,
  seeding,
}) {
  const fileRef = useRef(null);

  function handleFilePick(event) {
    const file = event.target.files?.[0];
    updateField("productAssetName", file ? file.name : "");
  }

  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Product setup</h2>
          <p>Shared product listing</p>
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

          <label className="full-span">
            Product description
            <textarea
              value={form.productDescription}
              onChange={(event) => updateField("productDescription", event.target.value)}
              placeholder="Describe the shared course, workshop, or digital product."
              rows="5"
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
            Product asset
            <div className="upload-row">
              <button type="button" className="secondary" onClick={() => fileRef.current?.click()}>
                Upload product file
              </button>
              <input ref={fileRef} type="file" className="hidden-input" onChange={handleFilePick} />
              <span>{form.productAssetName || "No file selected"}</span>
            </div>
          </label>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="secondary"
            onClick={() =>
              applyPreset({
                productName: "Creator Playbook",
                productDescription: "A compact creator growth playbook built by both collaborators.",
                price: 499,
                platformFeePercent: 10,
                productAssetName: "creator-playbook.pdf",
              })
            }
          >
            Load manager demo
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() =>
              applyPreset({
                productName: "Joint Launch Sprint",
                productDescription: "A collaborative launch framework with templates, live sessions, and audience conversion guidance from both creators.",
                price: 25000,
                platformFeePercent: 12,
                productAssetName: "launch-sprint-kit.pdf",
              })
            }
          >
            Load premium product
          </button>
          <button type="button" onClick={handlePublishProduct} disabled={saving || !form.code}>
            {saving ? "Publishing..." : "Publish product"}
          </button>
        </div>
      </section>

      <section className="card">
        <div className="card-heading">
          <h2>Per order preview</h2>
          <p>Commercial split on the current offer configuration.</p>
        </div>

        <div className="split-summary split-summary-single">
          <div className="metric-card">
            <span className="metric-label">Gross revenue</span>
            <strong className="amount">{preview ? formatCurrency(preview.gross) : "-"}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Net revenue</span>
            <strong className="amount">{preview ? formatCurrency(preview.net) : "-"}</strong>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-heading">
          <h2>Live demo</h2>
          <p>Use the sample buyers to populate the working model instantly.</p>
        </div>

        <div className="button-row">
          <button type="button" onClick={handleCreateOrder} disabled={orderSaving || !form.code}>
            {orderSaving ? "Recording..." : "Add one buyer"}
          </button>
          <button type="button" className="secondary" onClick={handleSeedOrders} disabled={seeding || !form.code}>
            {seeding ? "Loading..." : "Load 4 buyers at ₹499"}
          </button>
        </div>

        <div className="stats-grid stats-grid-compact">
          <article className="stat-card">
            <span className="metric-label">Price</span>
            <strong className="amount">{formatCurrency(form.price)}</strong>
          </article>
          <article className="stat-card">
            <span className="metric-label">Buyers</span>
            <strong>{orders.length}</strong>
          </article>
          <article className="stat-card">
            <span className="metric-label">Asset</span>
            <strong>{form.productAssetName || "-"}</strong>
          </article>
        </div>
      </section>
    </main>
  );
}

export default ProductPage;
