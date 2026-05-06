// TravelHub — App shell, routing, state (no sidebar; horizontal tab nav)
const { useState: useStateApp, useMemo: useMemoApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#E55A4E","#C94A40","#FCE9E6"]
}/*EDITMODE-END*/;

const PALETTES = [
  { id: "coral",   name: "Coral",  primary: "#E55A4E", hover: "#C94A40", soft: "#FCE9E6" },
  { id: "rose",    name: "Rose",   primary: "#D63A65", hover: "#B12A52", soft: "#FCE4EC" },
  { id: "ocean",   name: "Ocean",  primary: "#2A6FDB", hover: "#1F58B0", soft: "#E4EDFB" },
  { id: "forest",  name: "Forest", primary: "#2F8A5F", hover: "#246E4C", soft: "#E2F1EA" },
  { id: "violet",  name: "Violet", primary: "#7A5AE0", hover: "#5E45B5", soft: "#EDE7FB" },
  { id: "amber",   name: "Amber",  primary: "#D4901E", hover: "#A8721A", soft: "#FBEFD9" },
];

function calcBalances(participants, expenses) {
  const balances = {};
  participants.forEach(p => balances[p.id] = 0);
  expenses.forEach(e => {
    const share = e.amount / e.participants.length;
    balances[e.paidBy] += e.amount;
    e.participants.forEach(pid => { balances[pid] -= share; });
  });
  return balances;
}

function calcSettlements(balances) {
  const debtors = []; const creditors = [];
  Object.entries(balances).forEach(([id, v]) => {
    if (v < -0.5) debtors.push({ id, amount: -v });
    else if (v > 0.5) creditors.push({ id, amount: v });
  });
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amount, creditors[j].amount);
    settlements.push({ from: debtors[i].id, to: creditors[j].id, amount: Math.round(pay * 100) / 100 });
    debtors[i].amount -= pay;
    creditors[j].amount -= pay;
    if (debtors[i].amount < 0.5) i++;
    if (creditors[j].amount < 0.5) j++;
  }
  return settlements;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectApp(() => {
    const [primary, hover, soft] = t.palette;
    const root = document.documentElement;
    root.style.setProperty('--th-primary', primary);
    root.style.setProperty('--th-primary-hover', hover);
    root.style.setProperty('--th-primary-soft', soft);
    const rgb = primary.match(/[A-Fa-f0-9]{2}/g).map(h => parseInt(h, 16));
    root.style.setProperty('--th-ring', `rgba(${rgb.join(',')}, 0.35)`);
  }, [t.palette]);

  const [section, setSection] = useStateApp("dashboard");
  const [expenses, setExpenses] = useStateApp(window.MOCK.EXPENSES);
  const [documents, setDocuments] = useStateApp(window.MOCK.DOCUMENTS);
  const [itinerary, setItinerary] = useStateApp(window.MOCK.ITINERARY);
  const [trip, setTrip] = useStateApp(window.MOCK.TRIP);
  const [notifsOpen, setNotifsOpen] = useStateApp(false);
  const [unreadCount, setUnreadCount] = useStateApp(window.MOCK.NOTIFICATIONS.filter(n => !n.read).length);

  const [modal, setModal] = useStateApp(null);
  const [toasts, setToasts] = useStateApp([]);

  const balances = useMemoApp(() => calcBalances(trip.participants, expenses), [trip.participants, expenses]);
  const settlements = useMemoApp(() => calcSettlements(balances), [balances]);

  const pushToast = (text) => {
    const id = "t" + Date.now();
    setToasts(s => [...s, { id, text }]);
    setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), 2800);
  };

  const handleAddExpense = (exp) => { setExpenses(s => [...s, exp]); pushToast(`Spesa "${exp.title}" aggiunta`); };
  const handleAddDoc = (doc) => { setDocuments(s => [...s, doc]); pushToast(`File "${doc.name}" caricato`); };
  const handleInvite = (count) => { pushToast(`${count} invit${count === 1 ? 'o inviato' : 'i inviati'}`); };
  const handleAddStop = ({ day, stop }) => {
    setItinerary(s => s.map(d => d.date === day ? { ...d, stops: [...d.stops, stop].sort((a, b) => a.time.localeCompare(b.time)) } : d));
    pushToast(`Tappa "${stop.title}" aggiunta`);
  };

  const tripTabs = [
    { id: "dashboard",    label: "Dashboard",    icon: "home" },
    { id: "itinerary",    label: "Itinerario",   icon: "calendar", count: itinerary.reduce((n, d) => n + d.stops.length, 0) },
    { id: "documents",    label: "Documenti",    icon: "file",     count: documents.length },
    { id: "expenses",     label: "Spese",        icon: "wallet",   count: expenses.length },
    { id: "participants", label: "Partecipanti", icon: "users",    count: trip.participants.length },
  ];

  const me = trip.participants.find(p => p.you);
  const isTripView = section !== "list";

  return (
    <div className="th-app">
      {/* ───── Global header ───── */}
      <header className="th-header">
        <div className="th-header-row">
          <div className="th-header-brand" onClick={() => setSection("list")}>
            <div className="th-brand-mark">C</div>
            <span>Combriccola</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="th-search">
              <Icon name="search" size={14}/>
              <input placeholder="Cerca tappe, spese, documenti…"/>
              <kbd>⌘K</kbd>
            </div>
            <div style={{ position: "relative" }}>
              <IconButton icon="bell" label="Notifiche" badge={unreadCount > 0} onClick={() => setNotifsOpen(o => !o)}/>
              {notifsOpen && <NotificationsDropdown trip={trip} onClose={() => { setNotifsOpen(false); setUnreadCount(0); }}/>}
            </div>
            <Avatar p={me}/>
          </div>
        </div>

        {isTripView && (
          <div className="th-trip-tabs">
            <div className="th-trip-tabs-inner">
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 18, marginRight: 6, borderRight: "1px solid var(--th-border)", color: "var(--th-fg-muted)", fontSize: 12.5, flexShrink: 0, whiteSpace: "nowrap" }}>
                <button className="th-btn th-btn-ghost" style={{ padding: "4px 8px", fontSize: 12.5, color: "var(--th-fg-muted)", whiteSpace: "nowrap" }} onClick={() => setSection("list")}>
                  <Icon name="chevron-right" size={14} style={{ transform: "rotate(180deg)" }}/>
                  Viaggi
                </button>
              </div>
              {tripTabs.map(tab => (
                <button key={tab.id} className={`th-trip-tab ${section === tab.id ? "active" : ""}`} onClick={() => setSection(tab.id)}>
                  <Icon name={tab.icon} size={15}/>
                  {tab.label}
                  {tab.count !== undefined && <span className="th-nav-count">{tab.count}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ───── Main ───── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {section === "list" && <TripsListScreen trip={trip} onOpenTrip={() => setSection("dashboard")}/>}
        {section === "dashboard" && <DashboardScreen
          trip={trip} itinerary={itinerary} expenses={expenses} balances={balances}
          onNav={setSection}
          onAddExpense={() => setModal("expense")}
          onUploadDoc={() => setModal("doc")}
          onInvite={() => setModal("invite")}
        />}
        {section === "itinerary" && <ItineraryScreen trip={trip} itinerary={itinerary} onAddStop={() => setModal("stop")}/>}
        {section === "documents" && <DocumentsScreen trip={trip} documents={documents} onUpload={() => setModal("doc")}/>}
        {section === "expenses" && <ExpensesScreen trip={trip} expenses={expenses} balances={balances} settlements={settlements} onAdd={() => setModal("expense")}/>}
        {section === "participants" && <ParticipantsScreen trip={trip} onInvite={() => setModal("invite")}/>}
      </main>

      <AddExpenseModal open={modal === "expense"} onClose={() => setModal(null)} trip={trip} onSubmit={handleAddExpense}/>
      <UploadDocModal  open={modal === "doc"}     onClose={() => setModal(null)} onSubmit={handleAddDoc}/>
      <InviteModal     open={modal === "invite"}  onClose={() => setModal(null)} trip={trip} onInvite={handleInvite}/>
      <AddStopModal    open={modal === "stop"}    onClose={() => setModal(null)} trip={trip} itinerary={itinerary} onSubmit={handleAddStop}/>

      <ToastStack toasts={toasts}/>

      <TweaksPanel>
        <TweakSection label="Tema accent"/>
        <TweakColor label="Palette" value={t.palette}
          options={PALETTES.map(p => [p.primary, p.hover, p.soft])}
          onChange={(v) => setTweak('palette', v)}/>
        <div style={{ padding: "0 4px 8px", color: "#7a7672", fontSize: 11 }}>
          {(() => {
            const found = PALETTES.find(p => p.primary === t.palette[0]);
            return found ? found.name : "Personalizzato";
          })()}
        </div>
      </TweaksPanel>
    </div>
  );
}

function NotificationsDropdown({ trip, onClose }) {
  const notifs = window.MOCK.NOTIFICATIONS;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }}/>
      <div style={{
        position: "absolute", right: 0, top: "calc(100% + 8px)", width: 360, zIndex: 41,
        background: "var(--th-surface)", border: "1px solid var(--th-border)",
        borderRadius: 12, boxShadow: "var(--th-shadow-lg)", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--th-border)" }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Notifiche</div>
          <button className="th-link" style={{ fontSize: 12 }} onClick={onClose}>Segna tutte come lette</button>
        </div>
        <div style={{ maxHeight: 380, overflowY: "auto" }} className="th-scroll">
          {notifs.map(n => {
            const iconMap = { expense: "wallet", document: "file", itinerary: "calendar", join: "users" };
            return (
              <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: "1px solid var(--th-border)", background: !n.read ? "var(--th-primary-soft)" : "transparent" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--th-surface-2)", color: "var(--th-fg-muted)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Icon name={iconMap[n.type]} size={15}/>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: "var(--th-fg-muted)", marginTop: 2 }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width: 7, height: 7, borderRadius: 999, background: "var(--th-primary)", marginTop: 8, flexShrink: 0 }}/>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
