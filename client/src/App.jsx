import { useEffect, useState } from "react";
import { api } from "./api";
import DemoLayout from "./components/DemoLayout";
import { ROUTES, getCurrentRoute } from "./lib/routes";
import CollabPage from "./pages/CollabPage";
import LedgerPage from "./pages/LedgerPage";
import OverviewPage from "./pages/OverviewPage";
import WalletsPage from "./pages/WalletsPage";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

const initialForm = {
  code: "",
  productName: "Creator Playbook",
  productDescription: "A compact creator growth playbook built by both collaborators.",
  productAssetName: "",
  price: 499,
  platformFeePercent: 10,
  creatorAName: "",
  creatorBName: "",
  creatorASplit: 60,
};

function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [settling, setSettling] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [locks, setLocks] = useState({
    creatorALocked: false,
    creatorBLocked: false,
  });

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute());
    window.addEventListener("hashchange", syncRoute);
    if (!window.location.hash) {
      window.location.hash = ROUTES.overview;
    }

    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    async function bootstrapDemo() {
      try {
        setStatus("Loading demo");
        const invite = await api.createInvite({ creatorAName: "Aditi" });
        const joined = await api.joinCollab({
          code: invite.code,
          creatorBName: "Rohan",
        });

        const configuredPayload = {
          code: joined.code,
          productName: "Creator Playbook",
          productDescription:
            "A compact creator growth playbook built by both collaborators.",
          productAssetName: "creator-playbook.pdf",
          price: 499,
          platformFeePercent: 10,
          creatorAName: joined.creatorAName,
          creatorBName: joined.creatorBName,
          creatorASplit: 60,
        };

        const configured = await api.configureCollab(configuredPayload);
        await api.seedOrders(configured.code);

        setLocks({
          creatorALocked: true,
          creatorBLocked: true,
        });

        setSession(configured);
        setForm((current) => ({
          ...current,
          ...configuredPayload,
        }));

        const [ordersData, walletsData, previewData] = await Promise.all([
          api.listOrders(configured.code),
          api.listWallets(configured.code),
          api.previewSplit(configuredPayload),
        ]);

        setOrders(ordersData || []);
        setWallets(walletsData || []);
        setPreview(previewData);
        setStatus("Demo ready");
      } catch (error) {
        setStatus(error.message);
      } finally {
        setBootstrapping(false);
      }
    }

    bootstrapDemo();
  }, []);

  useEffect(() => {
    if (
      bootstrapping ||
      !form.code ||
      !form.creatorAName ||
      !form.creatorBName ||
      !form.productName
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refreshPreview(form);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [form, bootstrapping]);

  async function refreshPreview(nextForm = form) {
    if (!nextForm.creatorAName || !nextForm.creatorBName || !nextForm.productName) {
      return;
    }

    try {
      const data = await api.previewSplit(nextForm);
      setPreview(data);
      setStatus("Preview synced");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function loadCollab(code) {
    if (!code) {
      return;
    }

    try {
      const data = await api.getCollab(code);
      setSession(data);
      setForm((current) => ({
        ...current,
        code: data.code,
        productName: data.productName || current.productName,
        price: data.price || current.price,
        platformFeePercent: data.platformFeePercent ?? current.platformFeePercent,
        creatorAName: data.creatorAName || current.creatorAName,
        creatorBName: data.creatorBName || current.creatorBName,
        creatorASplit: data.creatorASplit ?? current.creatorASplit,
      }));
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function loadOrders(code = form.code) {
    try {
      const data = await api.listOrders(code);
      setOrders(data || []);
    } catch {
      setOrders([]);
    }
  }

  async function loadWallets(code = form.code) {
    try {
      const data = await api.listWallets(code);
      setWallets(data || []);
    } catch {
      setWallets([]);
    }
  }

  function navigate(nextRoute) {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
  }

  function updateField(key, value) {
    if (key === "creatorASplit") {
      setLocks({
        creatorALocked: false,
        creatorBLocked: false,
      });
    }

    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyPreset(values) {
    setLocks({
      creatorALocked: false,
      creatorBLocked: false,
    });
    setForm((current) => ({ ...current, ...values }));
  }

  function toggleLock(key) {
    setLocks((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function handleCreateInvite(creatorAName) {
    try {
      setCreating(true);
      const data = await api.createInvite({ creatorAName });
      setSession(data);
      setForm((current) => ({
        ...current,
        code: data.code,
        creatorAName: data.creatorAName,
        creatorBName: data.creatorBName || "",
        creatorASplit: data.creatorASplit ?? current.creatorASplit,
      }));
      setStatus("Collab code generated");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinCollab({ code, creatorBName }) {
    try {
      setJoining(true);
      const data = await api.joinCollab({ code, creatorBName });
      setSession(data);
      setForm((current) => ({
        ...current,
        code: data.code,
        creatorAName: data.creatorAName,
        creatorBName: data.creatorBName,
        creatorASplit: data.creatorASplit ?? current.creatorASplit,
      }));
      setStatus("Second creator joined");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setJoining(false);
    }
  }

  async function handlePublishProduct() {
    try {
      setSaving(true);
      const data = await api.configureCollab(form);
      setSession(data);
      await refreshPreview({
        ...form,
        creatorAName: data.creatorAName,
        creatorBName: data.creatorBName,
      });
      setStatus("Product published");
      navigate(ROUTES.ledger);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateOrder() {
    try {
      setOrderSaving(true);
      await api.createOrder(form);
      await Promise.all([
        refreshPreview(form),
        loadOrders(form.code),
        loadWallets(form.code),
        loadCollab(form.code),
      ]);
      setStatus("Purchase recorded");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setOrderSaving(false);
    }
  }

  async function handleRunSettlement() {
    try {
      setSettling(true);
      await api.settleCollab(form.code);
      await Promise.all([
        loadOrders(form.code),
        loadWallets(form.code),
        loadCollab(form.code),
      ]);
      setStatus("Settlement completed");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSettling(false);
    }
  }

  async function handleSeedOrders() {
    try {
      setSeeding(true);
      await api.seedOrders(form.code);
      await Promise.all([
        refreshPreview(form),
        loadOrders(form.code),
        loadWallets(form.code),
        loadCollab(form.code),
      ]);
      setStatus("Demo buyers loaded");
      navigate(ROUTES.ledger);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSeeding(false);
    }
  }

  useEffect(() => {
    if (bootstrapping || !form.code) {
      return;
    }

    loadCollab(form.code);
    loadOrders(form.code);
    loadWallets(form.code);
  }, [form.code, bootstrapping]);

  function renderRoute() {
    switch (route) {
      case ROUTES.collab:
        return (
          <CollabPage
            activeCode={form.code}
            session={session}
            form={form}
            locks={locks}
            creating={creating}
            joining={joining}
            saving={saving}
            orderSaving={orderSaving}
            seeding={seeding}
            onCreateInvite={handleCreateInvite}
            onJoinCollab={handleJoinCollab}
            onToggleLock={toggleLock}
            updateField={updateField}
            formatCurrency={formatCurrency}
            applyPreset={applyPreset}
            handlePublishProduct={handlePublishProduct}
            handleCreateOrder={handleCreateOrder}
            handleSeedOrders={handleSeedOrders}
          />
        );
      case ROUTES.ledger:
        return (
          <LedgerPage
            preview={preview}
            session={session}
            orders={orders}
            formatCurrency={formatCurrency}
          />
        );
      case ROUTES.wallets:
        return (
          <WalletsPage
            session={session}
            wallets={wallets}
            orders={orders}
            formatCurrency={formatCurrency}
            handleRunSettlement={handleRunSettlement}
            settling={settling}
          />
        );
      case ROUTES.overview:
      default:
        return <OverviewPage />;
    }
  }

  return (
    <DemoLayout route={route} navigate={navigate} status={status} activeCode={form.code}>
      {renderRoute()}
    </DemoLayout>
  );
}

export default App;
