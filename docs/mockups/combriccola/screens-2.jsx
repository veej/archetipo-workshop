// Documents, Expenses, Participants screens & supporting rows

const { useState: useState2, useMemo: useMemo2 } = React;

/* ───────────────────────── Documents ───────────────────────── */
function DocumentsScreen({ trip, documents, onUpload }) {
  const [filter, setFilter] = useState2("all");
  const [view, setView] = useState2("grid");
  const cats = ["Volo", "Hotel", "Prenotazione", "Altro"];
  const filtered = filter === "all" ? documents : documents.filter(d => d.category === filter);

  return (
    <div className="th-page">
      <div className="th-page-header">
        <div className="titles">
          <h1 className="th-page-title">Documenti</h1>
          <div className="th-page-subtitle">{documents.length} file · accessibili a tutti i partecipanti</div>
        </div>
        <Button variant="outline" icon="link">Condividi cartella</Button>
        <Button variant="primary" icon="upload" onClick={onUpload}>Carica file</Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <CategoryChip active={filter === "all"} onClick={() => setFilter("all")} count={documents.length}>Tutti</CategoryChip>
          {cats.map(c => (
            <CategoryChip key={c} active={filter === c} onClick={() => setFilter(c)} count={documents.filter(d => d.category === c).length}>{c}</CategoryChip>
          ))}
        </div>
        <Tabs value={view} onChange={setView} options={[
          { value: "grid", label: "Griglia" },
          { value: "list", label: "Lista" },
        ]}/>
      </div>

      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {filtered.map(d => <DocCardGrid key={d.id} doc={d} trip={trip}/>)}
          <UploadDropzone onClick={onUpload}/>
        </div>
      ) : (
        <Card>
          <div style={{ padding: 8 }}>
            {filtered.map(d => <DocRow key={d.id} doc={d} trip={trip}/>)}
          </div>
        </Card>
      )}
    </div>
  );
}

function CategoryChip({ active, onClick, count, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 12px", fontSize: 12.5, fontWeight: 600,
      borderRadius: 999, cursor: "pointer",
      border: "1px solid " + (active ? "var(--th-primary)" : "var(--th-border)"),
      background: active ? "var(--th-primary-soft)" : "var(--th-surface)",
      color: active ? "var(--th-primary-hover)" : "var(--th-fg-muted)",
      transition: "all .12s",
      display: "inline-flex", alignItems: "center", gap: 6,
    }}>
      {children}
      <span style={{ fontSize: 11, fontVariantNumeric: "tabular-nums", opacity: 0.75 }}>{count}</span>
    </button>
  );
}

function categoryColor(cat) {
  switch (cat) {
    case "Volo":         return { bg: "var(--th-info-soft)",    fg: "var(--th-info)" };
    case "Hotel":        return { bg: "var(--th-primary-soft)", fg: "var(--th-primary-hover)" };
    case "Prenotazione": return { bg: "var(--th-success-soft)", fg: "var(--th-success)" };
    default:             return { bg: "var(--th-surface-2)",    fg: "var(--th-fg-muted)" };
  }
}

function DocCardGrid({ doc, trip }) {
  const c = categoryColor(doc.category);
  const uploader = trip.participants.find(p => p.id === doc.uploadedBy);
  return (
    <div className="th-card" style={{ padding: 16, cursor: "pointer", transition: "border-color .15s, box-shadow .15s" }}
         onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--th-shadow-md)"}
         onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 44, height: 52, borderRadius: 8, background: c.bg, color: c.fg, display: "grid", placeItems: "center" }}>
          <Icon name={doc.icon === "img" ? "image" : "pdf"} size={26}/>
        </div>
        <button className="th-btn th-btn-ghost th-btn-icon" aria-label="Altro" style={{ width: 28, height: 28 }}>
          <Icon name="more" size={14}/>
        </button>
      </div>
      <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.35, wordBreak: "break-word" }}>{doc.name}</div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Badge variant={doc.category === "Volo" ? "info" : doc.category === "Hotel" ? "primary" : doc.category === "Prenotazione" ? "success" : "default"}>{doc.category}</Badge>
        <span style={{ fontSize: 11.5, color: "var(--th-fg-subtle)" }}>{doc.size}</span>
      </div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--th-border)", display: "flex", alignItems: "center", gap: 8 }}>
        {uploader && <Avatar p={uploader} size="sm"/>}
        <div style={{ fontSize: 11.5, color: "var(--th-fg-muted)" }}>{uploader && uploader.name.split(' ')[0]} · {doc.uploadedAt}</div>
      </div>
    </div>
  );
}

function DocRow({ doc, trip, compact }) {
  const c = categoryColor(doc.category);
  const uploader = trip.participants.find(p => p.id === doc.uploadedBy);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: compact ? "8px 12px" : "12px 12px", borderRadius: 8, cursor: "pointer" }}
         onMouseEnter={(e) => e.currentTarget.style.background = "var(--th-surface-2)"}
         onMouseLeave={(e) => e.currentTarget.style.background = ""}>
      <div style={{ width: 32, height: 36, borderRadius: 6, background: c.bg, color: c.fg, display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon name={doc.icon === "img" ? "image" : "pdf"} size={16}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</div>
        <div style={{ fontSize: 11.5, color: "var(--th-fg-muted)", marginTop: 1 }}>
          {doc.category} · {doc.size} · caricato {doc.uploadedAt}
        </div>
      </div>
      {!compact && uploader && <Avatar p={uploader} size="sm"/>}
      <button className="th-btn th-btn-ghost th-btn-icon" aria-label="Scarica" style={{ width: 30, height: 30 }}>
        <Icon name="download" size={14}/>
      </button>
    </div>
  );
}

function UploadDropzone({ onClick }) {
  return (
    <button onClick={onClick} className="th-card" style={{
      cursor: "pointer", border: "1.5px dashed var(--th-border-strong)",
      background: "transparent", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 8, padding: 24,
      color: "var(--th-fg-muted)", minHeight: 200, transition: "all .12s"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--th-primary)"; e.currentTarget.style.color = "var(--th-primary-hover)"; e.currentTarget.style.background = "var(--th-primary-soft)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--th-border-strong)"; e.currentTarget.style.color = "var(--th-fg-muted)"; e.currentTarget.style.background = "transparent"; }}>
      <Icon name="upload" size={26}/>
      <div style={{ fontWeight: 600, fontSize: 13 }}>Trascina qui o clicca</div>
      <div style={{ fontSize: 11.5 }}>PDF, JPG, PNG · max 25MB</div>
    </button>
  );
}

/* ───────────────────────── Expenses ───────────────────────── */
function ExpensesScreen({ trip, expenses, balances, settlements, onAdd }) {
  const [tab, setTab] = useState2("expenses");
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const me = trip.participants.find(p => p.you);
  const myPaid = expenses.filter(e => e.paidBy === me.id).reduce((s, e) => s + e.amount, 0);

  return (
    <div className="th-page">
      <div className="th-page-header">
        <div className="titles">
          <h1 className="th-page-title">Spese</h1>
          <div className="th-page-subtitle">Tutte le spese del viaggio, sempre aggiornate.</div>
        </div>
        <Button variant="outline" icon="download">Esporta CSV</Button>
        <Button variant="primary" icon="plus" onClick={onAdd}>Nuova spesa</Button>
      </div>

      <div className="th-grid-3" style={{ marginBottom: 22 }}>
        <SummaryCard label="Totale viaggio" value={fmtCurrency(total)} sublabel={`${expenses.length} spese registrate`}/>
        <SummaryCard label="Pro capite" value={fmtCurrency(total / trip.participants.length)} sublabel="diviso tra 6 amici"/>
        <SummaryCard label="Tu hai anticipato" value={fmtCurrency(myPaid)} sublabel="su voli, hotel e cene" highlight/>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Tabs value={tab} onChange={setTab} options={[
          { value: "expenses", label: "Spese" },
          { value: "balances", label: "Saldi" },
          { value: "settle", label: "Suggerimenti rimborso" },
        ]}/>
      </div>

      {tab === "expenses" && (
        <Card>
          <div style={{ padding: 8 }}>
            {expenses.slice().reverse().map(e => <ExpenseRow key={e.id} expense={e} trip={trip}/>)}
          </div>
        </Card>
      )}

      {tab === "balances" && (
        <Card>
          <div style={{ padding: 16 }}>
            {trip.participants.map(p => {
              const balance = balances[p.id] || 0;
              const paid = expenses.filter(e => e.paidBy === p.id).reduce((s, e) => s + e.amount, 0);
              const owed = expenses.reduce((s, e) => {
                if (!e.participants.includes(p.id)) return s;
                return s + e.amount / e.participants.length;
              }, 0);
              return (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto auto", gap: 16, alignItems: "center", padding: "12px 4px", borderBottom: "1px solid var(--th-border)" }}>
                  <Avatar p={p} size="lg"/>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}{p.you && <span style={{ marginLeft: 8, fontSize: 11.5, color: "var(--th-fg-muted)" }}>(tu)</span>}</div>
                    <div style={{ fontSize: 12, color: "var(--th-fg-muted)" }}>{p.role === "organizer" ? "Organizzatore" : p.role === "co-organizer" ? "Co-organizzatore" : "Partecipante"}</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12 }}>
                    <div style={{ color: "var(--th-fg-subtle)" }}>Pagato</div>
                    <div style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(paid)}</div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 12, minWidth: 80 }}>
                    <div style={{ color: "var(--th-fg-subtle)" }}>Quota</div>
                    <div style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(owed)}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 130 }}>
                    {Math.abs(balance) < 0.5 ? (
                      <Badge variant="success" icon="check">In pari</Badge>
                    ) : balance > 0 ? (
                      <div>
                        <div style={{ fontSize: 11, color: "var(--th-fg-subtle)" }}>Deve ricevere</div>
                        <div style={{ fontWeight: 700, color: "var(--th-success)", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(balance)}</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 11, color: "var(--th-fg-subtle)" }}>Deve dare</div>
                        <div style={{ fontWeight: 700, color: "var(--th-warning)", fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(Math.abs(balance))}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {tab === "settle" && (
        <Card>
          <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, color: "var(--th-fg-muted)", fontSize: 13 }}>
              Per pareggiare tutti i conti del viaggio servono <strong style={{ color: "var(--th-fg)" }}>{settlements.length} bonifici</strong>.
              Suggeriamo le transazioni minime necessarie:
            </div>
            {settlements.map((s, i) => {
              const from = trip.participants.find(p => p.id === s.from);
              const to = trip.participants.find(p => p.id === s.to);
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto auto 1fr auto auto", gap: 14, alignItems: "center", padding: "14px 4px", borderTop: i ? "1px solid var(--th-border)" : "none" }}>
                  <Avatar p={from}/>
                  <Icon name="arrow-right" size={16} style={{ color: "var(--th-fg-subtle)" }}/>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{from.name.split(' ')[0]}</span>
                    <span style={{ color: "var(--th-fg-muted)", fontSize: 13 }}> deve a </span>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{to.name.split(' ')[0]}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--th-fg)", fontFamily: "var(--th-font-display)", fontVariantNumeric: "tabular-nums" }}>
                    {fmtCurrency(s.amount)}
                  </div>
                  <Button variant="outline" size="sm" icon="check">Segna pagato</Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

function SummaryCard({ label, value, sublabel, highlight }) {
  return (
    <div className="th-card" style={{ padding: 18, ...(highlight ? { background: "var(--th-primary-soft)", borderColor: "transparent" } : {}) }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: highlight ? "var(--th-primary-hover)" : "var(--th-fg-subtle)" }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--th-font-display)", marginTop: 8, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--th-fg-muted)", marginTop: 6 }}>{sublabel}</div>
    </div>
  );
}

function ExpenseRow({ expense, trip, compact }) {
  const payer = trip.participants.find(p => p.id === expense.paidBy);
  const cat = expense.category;
  const c = {
    flight:    { bg: "var(--th-info-soft)", fg: "var(--th-info)" },
    hotel:     { bg: "var(--th-primary-soft)", fg: "var(--th-primary-hover)" },
    food:      { bg: "var(--th-warning-soft)", fg: "var(--th-warning)" },
    activity:  { bg: "var(--th-success-soft)", fg: "var(--th-success)" },
    transport: { bg: "#EEE6FB", fg: "#7A5AE0" },
  }[cat] || { bg: "var(--th-surface-2)", fg: "var(--th-fg-muted)" };
  const splitPpl = expense.participants.map(id => trip.participants.find(p => p.id === id));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "36px 1fr auto auto", gap: 12, alignItems: "center", padding: compact ? "8px 12px" : "12px", borderRadius: 8, cursor: "pointer" }}
         onMouseEnter={(e) => e.currentTarget.style.background = "var(--th-surface-2)"}
         onMouseLeave={(e) => e.currentTarget.style.background = ""}>
      <div style={{ width: 36, height: 36, borderRadius: 9, background: c.bg, color: c.fg, display: "grid", placeItems: "center" }}>
        <CategoryIcon kind={cat} size={16}/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{expense.title}</div>
        <div style={{ fontSize: 11.5, color: "var(--th-fg-muted)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <span><strong style={{ color: "var(--th-fg)" }}>{payer.name.split(' ')[0]}</strong> ha pagato</span>
          <span>·</span>
          <span>diviso tra {expense.participants.length}</span>
          {!compact && <>
            <span>·</span>
            <span>{new Date(expense.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}</span>
          </>}
        </div>
      </div>
      {!compact && <AvatarStack people={splitPpl} max={4} size="sm"/>}
      <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--th-font-display)", fontVariantNumeric: "tabular-nums", textAlign: "right", minWidth: 80 }}>
        {fmtCurrency(expense.amount)}
      </div>
    </div>
  );
}

/* ───────────────────────── Participants / Settings ───────────────────────── */
function ParticipantsScreen({ trip, onInvite }) {
  return (
    <div className="th-page">
      <div className="th-page-header">
        <div className="titles">
          <h1 className="th-page-title">Partecipanti</h1>
          <div className="th-page-subtitle">{trip.participants.length} amici nel viaggio</div>
        </div>
        <Button variant="primary" icon="send" onClick={onInvite}>Invita amici</Button>
      </div>

      <Card>
        <div style={{ padding: 8 }}>
          {trip.participants.map(p => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 16, alignItems: "center", padding: "12px 14px", borderRadius: 8 }}
                 onMouseEnter={(e) => e.currentTarget.style.background = "var(--th-surface-2)"}
                 onMouseLeave={(e) => e.currentTarget.style.background = ""}>
              <Avatar p={p} size="lg"/>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {p.name}
                  {p.you && <span style={{ marginLeft: 8, fontSize: 11.5, color: "var(--th-fg-muted)", fontWeight: 500 }}>(tu)</span>}
                </div>
                <div style={{ fontSize: 12, color: "var(--th-fg-muted)", marginTop: 2 }}>
                  {p.name.toLowerCase().replace(' ', '.')}@gmail.com
                </div>
              </div>
              {p.role === "organizer" ? <Badge variant="primary">Organizzatore</Badge> :
               p.role === "co-organizer" ? <Badge variant="info">Co-organizzatore</Badge> :
               <Badge>Partecipante</Badge>}
              <button className="th-btn th-btn-ghost th-btn-icon" aria-label="Altro">
                <Icon name="more" size={16}/>
              </button>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 18, color: "var(--th-fg-muted)", fontSize: 12.5, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="info" size={14}/>
        Solo gli organizzatori possono modificare l'itinerario, eliminare il viaggio e rimuovere partecipanti.
      </div>
    </div>
  );
}

Object.assign(window, { DocumentsScreen, ExpensesScreen, ParticipantsScreen, ExpenseRow, DocRow });
