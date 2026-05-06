// Screens for TravelHub: TripsList, TripDashboard, Itinerary, Documents, Expenses, Participants
// Uses globals: Icon, Avatar, AvatarStack, Button, IconButton, Badge, Card, Modal, Field, Tabs, fmtCurrency, fmtDateRange, daysUntil
// destination illustrations from illustrations.jsx

const { useState, useMemo } = React;

/* ───────────────────────── Trips List ───────────────────────── */
function TripsListScreen({ trip, onOpenTrip }) {
  const [tab, setTab] = useState("all");
  const allTrips = [
    { id: trip.id, name: trip.name, destination: trip.destination, startDate: trip.startDate, endDate: trip.endDate, cover: trip.cover, participants: trip.participants.length, status: "active" },
    ...trip.trips_other,
  ];
  const filtered = tab === "all" ? allTrips : allTrips.filter(t => t.status === tab || (tab === "upcoming" && (t.status === "active" || t.status === "upcoming" || t.status === "planning")));

  return (
    <div className="th-page">
      <div className="th-page-header">
        <div className="titles">
          <h1 className="th-page-title">I tuoi viaggi</h1>
          <div className="th-page-subtitle">Tutto il tuo gruppo, in un unico posto.</div>
        </div>
        <Button variant="primary" icon="plus">Nuovo viaggio</Button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <Tabs value={tab} onChange={setTab} options={[
          { value: "all", label: "Tutti" },
          { value: "upcoming", label: "In arrivo" },
          { value: "past", label: "Passati" },
        ]}/>
        <div className="th-row" style={{ gap: 8 }}>
          <Button variant="outline" size="sm" icon="filter">Filtri</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
        {filtered.map(t => <TripCard key={t.id} t={t} active={t.id === trip.id} onClick={() => t.id === trip.id && onOpenTrip()}/>)}
      </div>
    </div>
  );
}

function TripCard({ t, active, onClick }) {
  const days = daysUntil(t.startDate);
  let statusBadge = null;
  if (t.status === "active" || (days >= 0 && days <= 30)) statusBadge = <Badge variant="primary">Tra {days} giorni</Badge>;
  else if (t.status === "past") statusBadge = <Badge>Concluso</Badge>;
  else if (t.status === "planning") statusBadge = <Badge variant="warning">In pianificazione</Badge>;
  else if (days > 30) statusBadge = <Badge variant="info">In arrivo</Badge>;

  return (
    <Card style={{ overflow: "hidden", cursor: "pointer" }}>
      <div onClick={onClick}>
        <div className="th-cover-wrap" style={{ height: 168 }}>
          {destinationIllustration(t.cover, { className: "th-cover" })}
        </div>
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "var(--th-font-display)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
              <div style={{ color: "var(--th-fg-muted)", fontSize: 12.5, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="map-pin" size={12}/> {t.destination}
              </div>
            </div>
            {statusBadge}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
            <div style={{ fontSize: 12.5, color: "var(--th-fg-muted)" }}>{fmtDateRange(t.startDate, t.endDate)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--th-fg-muted)", fontSize: 12 }}>
              <Icon name="users" size={13}/> {t.participants}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ───────────────────────── Dashboard ───────────────────────── */
function DashboardScreen({ trip, itinerary, expenses, balances, onNav, onAddExpense, onUploadDoc, onInvite }) {
  const days = daysUntil(trip.startDate);
  const today = itinerary[0]; // For mock, "today" is day 1
  const nextStop = today.stops[0];
  const nextFlight = itinerary.flatMap(d => d.stops).find(s => s.category === "flight");
  const me = trip.participants.find(p => p.you);
  const myBalance = balances[me.id] || 0;

  return (
    <div className="th-page">
      {/* Hero */}
      <div className="th-card" style={{ overflow: "hidden", marginBottom: 24, border: "1px solid var(--th-border)" }}>
        <div className="th-cover-wrap" style={{ height: 220, position: "relative" }}>
          {destinationIllustration(trip.cover, { className: "th-cover" })}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,16,12,0.0) 40%, rgba(20,16,12,0.55) 100%)" }}/>
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 18, color: "white", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
            <div>
              <Badge variant="primary" icon="sparkles">Tra {days} giorni</Badge>
              <h1 style={{ color: "white", fontSize: 32, marginTop: 10, lineHeight: 1.05 }}>{trip.name}</h1>
              <div style={{ marginTop: 6, fontSize: 14, opacity: 0.92, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="map-pin" size={14}/> {trip.destination}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="calendar" size={14}/> {fmtDateRange(trip.startDate, trip.endDate)}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="users" size={14}/> {trip.participants.length} amici</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="outline" icon="users" onClick={onInvite} style={{ background: "rgba(255,255,255,0.95)", borderColor: "transparent" }}>Invita</Button>
              <Button variant="primary" icon="edit" style={{ background: "white", color: "var(--th-fg)" }}>Modifica</Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 hero tiles */}
      <h3 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--th-fg-subtle)", fontWeight: 700, fontFamily: "var(--th-font-sans)", marginBottom: 12 }}>In sintesi · oggi</h3>
      <div className="th-grid-3" style={{ marginBottom: 28 }}>
        <HeroTile
          kind="stop"
          eyebrow="Prossima tappa"
          title={nextStop.title}
          subtitle={nextStop.subtitle}
          meta={`${nextStop.time} · ${nextStop.address.split(',')[0]}`}
          onClick={() => onNav("itinerary")}
        />
        <HeroTile
          kind="flight"
          eyebrow="Prossimo volo"
          title="Roma → Lisbona"
          subtitle="TAP TP831 · Terminal 1"
          meta="Ven 22 mag · 07:30 — 09:50"
          onClick={() => onNav("documents")}
        />
        <HeroTile
          kind="balance"
          eyebrow="Il tuo saldo"
          title={myBalance >= 0 ? "Devi ricevere" : "Devi pagare"}
          amount={Math.abs(myBalance)}
          meta={myBalance >= 0 ? "dal gruppo" : "al gruppo"}
          positive={myBalance >= 0}
          onClick={() => onNav("expenses")}
        />
      </div>

      {/* Two-col content */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* Today's itinerary */}
        <Card>
          <div className="th-card-header">
            <div style={{ flex: 1 }}>
              <div className="th-card-title">Oggi · {today.label.split(' ').slice(1).join(' ')}</div>
              <div className="th-card-subtitle">{today.stops.length} tappe pianificate</div>
            </div>
            <Button variant="ghost" size="sm" iconRight="arrow-right" onClick={() => onNav("itinerary")}>Vedi itinerario</Button>
          </div>
          <div style={{ padding: "8px 8px 12px" }}>
            {today.stops.slice(0, 4).map(s => <TimelineRow key={s.id} stop={s}/>)}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Recent docs */}
          <Card>
            <div className="th-card-header">
              <div style={{ flex: 1 }}>
                <div className="th-card-title">Ultimi documenti</div>
              </div>
              <Button variant="ghost" size="sm" icon="upload" onClick={onUploadDoc}>Carica</Button>
            </div>
            <div style={{ padding: 8 }}>
              {window.MOCK.DOCUMENTS.slice(-4).reverse().map(d => <DocRow key={d.id} doc={d} compact trip={trip}/>)}
            </div>
          </Card>

          {/* Recent expenses */}
          <Card>
            <div className="th-card-header">
              <div style={{ flex: 1 }}>
                <div className="th-card-title">Ultime spese</div>
              </div>
              <Button variant="ghost" size="sm" icon="plus" onClick={onAddExpense}>Aggiungi</Button>
            </div>
            <div style={{ padding: 8 }}>
              {expenses.slice(-3).reverse().map(e => <ExpenseRow key={e.id} expense={e} trip={trip} compact/>)}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HeroTile({ kind, eyebrow, title, subtitle, meta, amount, positive, onClick }) {
  const colorMap = {
    stop:    { soft: "var(--th-primary-soft)", fg: "var(--th-primary-hover)", icon: "map-pin" },
    flight:  { soft: "var(--th-info-soft)", fg: "var(--th-info)", icon: "compass" },
    balance: { soft: positive ? "var(--th-success-soft)" : "var(--th-warning-soft)",
               fg:   positive ? "var(--th-success)" : "var(--th-warning)",
               icon: positive ? "trending-up" : "trending-down" },
  };
  const c = colorMap[kind];
  return (
    <div className="th-card" style={{ padding: 18, cursor: "pointer", transition: "border-color .15s, box-shadow .15s" }}
         onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--th-shadow-md)"}
         onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}
         onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--th-fg-subtle)" }}>{eyebrow}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: c.soft, color: c.fg, display: "grid", placeItems: "center" }}>
          <Icon name={c.icon} size={16}/>
        </div>
      </div>
      {amount !== undefined ? (
        <div>
          <div style={{ fontSize: 13, color: "var(--th-fg-muted)", fontWeight: 500, marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: 30, fontWeight: 700, fontFamily: "var(--th-font-display)", letterSpacing: "-0.02em", color: c.fg, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{fmtCurrency(amount)}</div>
          <div style={{ fontSize: 12.5, color: "var(--th-fg-muted)", marginTop: 6 }}>{meta}</div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--th-font-display)", letterSpacing: "-0.01em", lineHeight: 1.25 }}>{title}</div>
          <div style={{ fontSize: 13, color: "var(--th-fg-muted)", marginTop: 4 }}>{subtitle}</div>
          <div style={{ fontSize: 12.5, color: "var(--th-fg-subtle)", marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="clock" size={12}/> {meta}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineRow({ stop, editable, onEdit }) {
  const catColor = {
    flight: { bg: "var(--th-info-soft)", fg: "var(--th-info)" },
    hotel:  { bg: "var(--th-primary-soft)", fg: "var(--th-primary-hover)" },
    food:   { bg: "var(--th-warning-soft)", fg: "var(--th-warning)" },
    activity:{ bg: "var(--th-success-soft)", fg: "var(--th-success)" },
  }[stop.category] || { bg: "var(--th-surface-2)", fg: "var(--th-fg-muted)" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "60px 36px 1fr auto", gap: 12, padding: "10px 12px", borderRadius: 8, alignItems: "flex-start" }}
         onMouseEnter={(e) => e.currentTarget.style.background = "var(--th-surface-2)"}
         onMouseLeave={(e) => e.currentTarget.style.background = ""}>
      <div style={{ fontVariantNumeric: "tabular-nums", fontSize: 13, fontWeight: 600, color: "var(--th-fg)", paddingTop: 6 }}>
        {stop.time}{stop.endTime ? <div style={{ fontSize: 11.5, color: "var(--th-fg-subtle)", fontWeight: 500 }}>{stop.endTime}</div> : null}
      </div>
      <div style={{ width: 32, height: 32, borderRadius: 9, background: catColor.bg, color: catColor.fg, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}>
        <CategoryIcon kind={stop.category} size={16}/>
      </div>
      <div style={{ minWidth: 0, paddingTop: 2 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{stop.title}</div>
        {stop.subtitle && <div style={{ color: "var(--th-fg-muted)", fontSize: 12.5, marginTop: 1 }}>{stop.subtitle}</div>}
        {stop.address && <div style={{ color: "var(--th-fg-subtle)", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="map-pin" size={11}/> {stop.address}
        </div>}
        {stop.note && <div style={{ marginTop: 6, padding: "6px 10px", background: "var(--th-surface-2)", borderRadius: 6, fontSize: 12, color: "var(--th-fg-muted)" }}>
          {stop.note}
        </div>}
      </div>
      {editable && (
        <button className="th-btn th-btn-ghost th-btn-icon" onClick={() => onEdit && onEdit(stop)} aria-label="Modifica">
          <Icon name="more" size={16}/>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── Itinerary ───────────────────────── */
function ItineraryScreen({ trip, itinerary, onAddStop }) {
  const [activeDay, setActiveDay] = useState(itinerary[0].date);
  const day = itinerary.find(d => d.date === activeDay);

  return (
    <div className="th-page">
      <div className="th-page-header">
        <div className="titles">
          <h1 className="th-page-title">Itinerario</h1>
          <div className="th-page-subtitle">{trip.days} giorni · {itinerary.reduce((n, d) => n + d.stops.length, 0)} tappe</div>
        </div>
        <Button variant="outline" icon="download">Esporta PDF</Button>
        <Button variant="primary" icon="plus" onClick={onAddStop}>Nuova tappa</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        {/* Day rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "sticky", top: 80, alignSelf: "flex-start" }}>
          {itinerary.map(d => {
            const isActive = d.date === activeDay;
            return (
              <button key={d.date} onClick={() => setActiveDay(d.date)}
                style={{
                  textAlign: "left", padding: "12px 14px",
                  borderRadius: 10, border: "1px solid " + (isActive ? "var(--th-primary)" : "var(--th-border)"),
                  background: isActive ? "var(--th-primary-soft)" : "var(--th-surface)",
                  cursor: "pointer", transition: "all .12s",
                }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? "var(--th-primary-hover)" : "var(--th-fg-subtle)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Giorno {d.dayNum}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 2, color: "var(--th-fg)" }}>
                  {d.label.split(' ').slice(0, 1).join(' ')} {d.label.split(' ')[1]}
                </div>
                <div style={{ fontSize: 11.5, color: isActive ? "var(--th-primary-hover)" : "var(--th-fg-muted)", marginTop: 4 }}>
                  {d.stops.length} tappe
                </div>
              </button>
            );
          })}
        </div>

        {/* Day detail */}
        <Card>
          <div className="th-card-header">
            <div style={{ flex: 1 }}>
              <div className="th-card-title">{day.label}</div>
              <div className="th-card-subtitle">Giorno {day.dayNum} di {trip.days}</div>
            </div>
            <Button variant="ghost" size="sm" icon="plus" onClick={onAddStop}>Tappa</Button>
          </div>
          <div style={{ padding: "8px 8px 16px" }}>
            {day.stops.map((s, i) => (
              <div key={s.id} style={{ position: "relative" }}>
                {i < day.stops.length - 1 && <div style={{ position: "absolute", left: 90, top: 50, bottom: -4, width: 2, background: "var(--th-border)", borderRadius: 1 }}/>}
                <TimelineRow stop={s} editable/>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { TripsListScreen, DashboardScreen, ItineraryScreen, TimelineRow, HeroTile });
