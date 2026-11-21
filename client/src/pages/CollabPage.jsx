import { useEffect, useRef, useState } from "react";

const STEP_IDS = {
  invite: "invite",
  split: "split",
  product: "product",
  orders: "orders",
};

const STEP_ITEMS = [
  { id: STEP_IDS.invite, label: "Invite accepted" },
  { id: STEP_IDS.split, label: "Set split" },
  { id: STEP_IDS.product, label: "Upload product" },
  { id: STEP_IDS.orders, label: "Collect orders" },
];

function CollabPage({
  activeCode,
  session,
  form,
  locks,
  creating,
  joining,
  saving,
  orderSaving,
  seeding,
  onCreateInvite,
  onJoinCollab,
  onToggleLock,
  updateField,
  applyPreset,
  handlePublishProduct,
  handleCreateOrder,
  handleSeedOrders,
  formatCurrency,
}) {
  const [creatorAName, setCreatorAName] = useState(session?.creatorAName || "Aditi");
  const [code, setCode] = useState(activeCode || "");
  const [creatorBName, setCreatorBName] = useState(session?.creatorBName || "Rohan");
  const [step, setStep] = useState(STEP_IDS.invite);
  const fileRef = useRef(null);

  useEffect(() => {
    setCode(activeCode || "");
  }, [activeCode]);

  useEffect(() => {
    if (session?.creatorAName) {
      setCreatorAName(session.creatorAName);
    }
    if (session?.creatorBName) {
      setCreatorBName(session.creatorBName);
    }
  }, [session]);

  async function handleCreate(event) {
    event.preventDefault();
    await onCreateInvite(creatorAName);
  }

  async function handleJoin(event) {
    event.preventDefault();
    await onJoinCollab({ code, creatorBName });
    setStep(STEP_IDS.split);
  }

  function handleFilePick(event) {
    const file = event.target.files?.[0];
    updateField("productAssetName", file ? file.name : "");
  }

  const bothLocked = locks.creatorALocked && locks.creatorBLocked;

  function renderInviteStep() {
    return (
      <section className="card card-wide">
        <div className="split-summary">
          <form className="card section-card" onSubmit={handleCreate}>
            <div className="card-heading">
              <h3>Create collab</h3>
            </div>

            <label>
              Creator A
              <input
                type="text"
                value={creatorAName}
                onChange={(event) => setCreatorAName(event.target.value)}
              />
            </label>

            <div className="button-row">
              <button type="submit" disabled={creating}>
                {creating ? "Generating..." : "Generate code"}
              </button>
            </div>
          </form>

          <form className="card section-card" onSubmit={handleJoin}>
            <div className="card-heading">
              <h3>Join collab</h3>
            </div>

            <label>
              Collab code
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
              />
            </label>

            <label>
              Creator B
              <input
                type="text"
                value={creatorBName}
                onChange={(event) => setCreatorBName(event.target.value)}
              />
            </label>

            <div className="button-row">
              <button type="submit" disabled={joining || !code}>
                {joining ? "Joining..." : "Join with code"}
              </button>
            </div>
          </form>
        </div>

        <div className="split-summary">
          <div className="metric-card invite-card">
            <span className="metric-label">Collab code</span>
            <strong className="code-pill">{activeCode || "Not generated yet"}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Connected creators</span>
            <strong>{session?.creatorAName || "-"} + {session?.creatorBName || "-"}</strong>
          </div>
        </div>
      </section>
    );
  }

  function renderSplitStep() {
    return (
      <section className="card card-wide">
        <div className="card-heading">
          <h3>Split setup</h3>
        </div>

        <div className="form-grid form-grid-two">
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
          <button type="button" disabled={!bothLocked} onClick={() => setStep(STEP_IDS.product)}>
            Continue
          </button>
        </div>
      </section>
    );
  }

  function renderProductStep() {
    return (
      <section className="card card-wide">
        <div className="card-heading">
          <h3>Product setup</h3>
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
            Price
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => updateField("price", Number(event.target.value))}
            />
          </label>

          <label className="full-span">
            Description
            <textarea
              rows="4"
              value={form.productDescription}
              onChange={(event) => updateField("productDescription", event.target.value)}
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
            Asset
            <div className="upload-row">
              <button type="button" className="secondary" onClick={() => fileRef.current?.click()}>
                Upload file
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
          <button type="button" onClick={handlePublishProduct} disabled={saving || !form.code || !bothLocked}>
            {saving ? "Publishing..." : "Publish product"}
          </button>
        </div>
      </section>
    );
  }

  function renderOrdersStep() {
    return (
      <section className="card card-wide">
        <div className="card-heading">
          <h3>Orders</h3>
        </div>

        <div className="stats-grid stats-grid-compact">
          <article className="stat-card">
            <span className="metric-label">Price</span>
            <strong className="amount">{formatCurrency(form.price)}</strong>
          </article>
          <article className="stat-card">
            <span className="metric-label">Buyers</span>
            <strong>{session ? "4 demo buyers ready" : "No buyers yet"}</strong>
          </article>
          <article className="stat-card">
            <span className="metric-label">Asset</span>
            <strong>{form.productAssetName || "-"}</strong>
          </article>
        </div>

        <div className="button-row">
          <button type="button" onClick={handleCreateOrder} disabled={orderSaving || !form.code}>
            {orderSaving ? "Recording..." : "Add one buyer"}
          </button>
          <button type="button" className="secondary" onClick={handleSeedOrders} disabled={seeding || !form.code}>
            {seeding ? "Loading..." : "Load 4 buyers at ₹499"}
          </button>
        </div>
      </section>
    );
  }

  function renderCurrentStep() {
    switch (step) {
      case STEP_IDS.split:
        return renderSplitStep();
      case STEP_IDS.product:
        return renderProductStep();
      case STEP_IDS.orders:
        return renderOrdersStep();
      case STEP_IDS.invite:
      default:
        return renderInviteStep();
    }
  }

  return (
    <main className="grid">
      <section className="card card-wide">
        <div className="card-heading">
          <h2>Collab</h2>
        </div>

        <div className="progress-strip">
          {STEP_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`progress-step-button${step === item.id ? " progress-step-button-active" : ""}`}
              onClick={() => setStep(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {renderCurrentStep()}
    </main>
  );
}

export default CollabPage;
