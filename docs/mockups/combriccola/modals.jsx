// Modals: Add expense, Upload document, Invite participant, Add stop
const { useState: useState3, useMemo: useMemo3 } = React;

/* ───────────────────────── Add Expense ───────────────────────── */
function AddExpenseModal({ open, onClose, trip, onSubmit }) {
  const [title, setTitle] = useState3("");
  const [amount, setAmount] = useState3("");
  const [paidBy, setPaidBy] = useState3(trip.participants.find(p => p.you).id);
  const [category, setCategory] = useState3("food");
  const [date, setDate] = useState3("2026-05-22");
  const [splitMode, setSplitMode] = useState3("equal");
  const [splitWith, setSplitWith] = useState3(trip.participants.map(p => p.id));

  React.useEffect(() => {
    if (open) {
      setTitle(""); setAmount(""); setPaidBy(trip.participants.find(p => p.you).id);
      setCategory("food"); setDate("2026-05-22"); setSplitMode("equal");
      setSplitWith(trip.participants.map(p => p.id));
    }
  }, [open]);

  const toggleParticipant = (id) => {
    setSplitWith(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const submit = () => {
    if (!title || !amount) return;
    onSubmit({
      id: "e" + Date.now(),
      title, amount: parseFloat(amount), paidBy, category, date,
      split: splitMode, participants: splitWith.length ? splitWith : trip.participants.map(p => p.id),
    });
    onClose();
  };

  const canSubmit = title.trim() && parseFloat(amount) > 0 && splitWith.length > 0;
  const perPerson = splitWith.length ? parseFloat(amount || 0) / splitWith.length : 0;

  return (
    <Modal open={open} onClose={onClose}
      title="Nuova spesa"
      subtitle="Registra una spesa e dividila tra il gruppo."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={submit} disabled={!canSubmit}>Aggiungi spesa</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
        <Field label="Descrizione">
          <input className="th-input" placeholder="Es. Cena Cantinho do Avillez" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus/>
        </Field>
        <div className="th-grid-2">
          <Field label="Importo">
            <div style={{ position: "relative" }}>
              <input className="th-input" type="number" step="0.01" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ paddingLeft: 28 }}/>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--th-fg-muted)", fontSize: 13 }}>€</span>
            </div>
          </Field>
          <Field label="Data">
            <input className="th-input" type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
          </Field>
        </div>
        <div className="th-grid-2">
          <Field label="Pagato da">
            <select className="th-select" value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {trip.participants.map(p => <option key={p.id} value={p.id}>{p.name}{p.you ? " (tu)" : ""}</option>)}
            </select>
          </Field>
          <Field label="Categoria">
            <select className="th-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="food">Cibo</option>
              <option value="hotel">Alloggio</option>
              <option value="flight">Volo</option>
              <option value="transport">Trasporti</option>
              <option value="activity">Attività</option>
              <option value="other">Altro</option>
            </select>
          </Field>
        </div>

        <Field label="Dividi tra">
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Tabs value={splitMode} onChange={setSplitMode} options={[
              { value: "equal", label: "In parti uguali" },
              { value: "custom", label: "Personalizzato" },
            ]}/>
          </div>
          <div style={{ border: "1px solid var(--th-border)", borderRadius: 10, overflow: "hidden" }}>
            {trip.participants.map((p, i) => {
              const checked = splitWith.includes(p.id);
              return (
                <label key={p.id} style={{
                  display: "grid", gridTemplateColumns: "auto auto 1fr auto", gap: 12, alignItems: "center",
                  padding: "10px 12px", cursor: "pointer",
                  background: checked ? "var(--th-primary-soft)" : "transparent",
                  borderTop: i ? "1px solid var(--th-border)" : "none",
                }}>
                  <input type="checkbox" checked={checked} onChange={() => toggleParticipant(p.id)} style={{ accentColor: "var(--th-primary)" }}/>
                  <Avatar p={p} size="sm"/>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}{p.you ? " (tu)" : ""}</div>
                  {checked && splitMode === "equal" && (
                    <div style={{ fontSize: 12.5, fontVariantNumeric: "tabular-nums", color: "var(--th-fg-muted)" }}>
                      {fmtCurrency(perPerson)}
                    </div>
                  )}
                  {checked && splitMode === "custom" && (
                    <input className="th-input" type="number" step="0.01" placeholder={fmtCurrency(perPerson).replace(/\D/g,'') / 100 + ""} style={{ width: 90, padding: "4px 8px", fontSize: 12 }}/>
                  )}
                </label>
              );
            })}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

/* ───────────────────────── Upload Document ───────────────────────── */
function UploadDocModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState3("");
  const [category, setCategory] = useState3("Volo");
  const [dragOver, setDragOver] = useState3(false);

  React.useEffect(() => { if (open) { setName(""); setCategory("Volo"); } }, [open]);

  const submit = () => {
    if (!name) return;
    onSubmit({
      id: "d" + Date.now(),
      name: name.endsWith(".pdf") || name.endsWith(".png") || name.endsWith(".jpg") ? name : name + ".pdf",
      category, size: "—", uploadedBy: "marco", uploadedAt: "ora", icon: "pdf",
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}
      title="Carica documento"
      subtitle="PDF, immagini, biglietti — saranno visibili a tutti i partecipanti."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={submit} disabled={!name}>Carica</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) setName(e.dataTransfer.files[0].name); }}
          style={{
            border: "1.5px dashed " + (dragOver ? "var(--th-primary)" : "var(--th-border-strong)"),
            background: dragOver ? "var(--th-primary-soft)" : "var(--th-surface-2)",
            borderRadius: 12, padding: 32, textAlign: "center", color: "var(--th-fg-muted)",
            transition: "all .12s",
          }}>
          <Icon name="upload" size={32} style={{ color: dragOver ? "var(--th-primary)" : "var(--th-fg-subtle)" }}/>
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--th-fg)", marginTop: 8 }}>
            Trascina i file qui
          </div>
          <div style={{ fontSize: 12.5, marginTop: 4 }}>oppure <span className="th-link" onClick={() => setName("Volo TAP TP831 — andata.pdf")}>scegli dal computer</span></div>
        </div>

        <Field label="Nome file">
          <input className="th-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="esempio.pdf"/>
        </Field>
        <Field label="Categoria">
          <select className="th-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Volo</option>
            <option>Hotel</option>
            <option>Prenotazione</option>
            <option>Altro</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

/* ───────────────────────── Invite Participant ───────────────────────── */
function InviteModal({ open, onClose, trip, onInvite }) {
  const [emails, setEmails] = useState3("");
  const [role, setRole] = useState3("member");
  const [copied, setCopied] = useState3(false);

  React.useEffect(() => { if (open) { setEmails(""); setRole("member"); setCopied(false); } }, [open]);

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const send = () => {
    if (!emails.trim()) return;
    onInvite(emails.split(/[\s,]+/).filter(Boolean).length);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}
      title={`Invita amici a "${trip.name}"`}
      subtitle="Riceveranno un'email con un link per accedere subito al viaggio."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Annulla</Button>
        <Button variant="primary" icon="send" onClick={send} disabled={!emails.trim()}>Invia inviti</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
        <Field label="Indirizzi email" help="Separa più email con virgole o invio.">
          <textarea className="th-textarea" placeholder="alice@email.com, marco@email.com" value={emails} onChange={(e) => setEmails(e.target.value)}/>
        </Field>

        <Field label="Ruolo">
          <Tabs value={role} onChange={setRole} options={[
            { value: "member", label: "Partecipante" },
            { value: "co-organizer", label: "Co-organizzatore" },
          ]}/>
        </Field>

        <div className="th-divider"/>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>Oppure condividi un link</div>
            <div style={{ fontSize: 12, color: "var(--th-fg-muted)", marginTop: 2 }}>Scade tra 24 ore · richiede accesso</div>
          </div>
          <Button variant="outline" icon={copied ? "check" : "copy"} onClick={copyLink}>
            {copied ? "Copiato" : "Copia link"}
          </Button>
        </div>

        <div style={{ background: "var(--th-surface-2)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "var(--th-fg-muted)", fontFamily: "ui-monospace, Menlo, monospace", overflowX: "auto" }}>
          combriccola.app/invite/lisbon-2026/9f2e8b3a
        </div>
      </div>
    </Modal>
  );
}

/* ───────────────────────── Add Stop ───────────────────────── */
function AddStopModal({ open, onClose, trip, itinerary, onSubmit }) {
  const [title, setTitle] = useState3("");
  const [time, setTime] = useState3("12:00");
  const [day, setDay] = useState3(itinerary[0].date);
  const [category, setCategory] = useState3("activity");
  const [address, setAddress] = useState3("");
  const [note, setNote] = useState3("");

  React.useEffect(() => { if (open) { setTitle(""); setTime("12:00"); setDay(itinerary[0].date); setCategory("activity"); setAddress(""); setNote(""); } }, [open]);

  const submit = () => {
    if (!title) return;
    onSubmit({ day, stop: { id: "s" + Date.now(), title, time, category, address, note, subtitle: "" } });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}
      title="Nuova tappa"
      subtitle="Aggiungi un'attività, un'esperienza o un pasto al programma."
      footer={<>
        <Button variant="ghost" onClick={onClose}>Annulla</Button>
        <Button variant="primary" onClick={submit} disabled={!title}>Aggiungi tappa</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
        <Field label="Titolo">
          <input className="th-input" placeholder="Es. Visita alla Torre di Belém" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus/>
        </Field>
        <div className="th-grid-2">
          <Field label="Giorno">
            <select className="th-select" value={day} onChange={(e) => setDay(e.target.value)}>
              {itinerary.map(d => <option key={d.date} value={d.date}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="Orario">
            <input className="th-input" type="time" value={time} onChange={(e) => setTime(e.target.value)}/>
          </Field>
        </div>
        <Field label="Categoria">
          <select className="th-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="flight">Volo</option>
            <option value="hotel">Alloggio</option>
            <option value="food">Cibo</option>
            <option value="activity">Attività</option>
            <option value="transport">Trasporti</option>
          </select>
        </Field>
        <Field label="Indirizzo">
          <input className="th-input" placeholder="Es. Praça do Império, 1400-206 Lisboa" value={address} onChange={(e) => setAddress(e.target.value)}/>
        </Field>
        <Field label="Note">
          <textarea className="th-textarea" placeholder="Codice prenotazione, dettagli, link…" value={note} onChange={(e) => setNote(e.target.value)}/>
        </Field>
      </div>
    </Modal>
  );
}

Object.assign(window, { AddExpenseModal, UploadDocModal, InviteModal, AddStopModal });
