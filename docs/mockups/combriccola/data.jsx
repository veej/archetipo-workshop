// Mock data per TravelHub — Weekend a Lisbona, 6 amici

const TRIP = {
  id: "lisbon-2026",
  name: "Weekend a Lisbona",
  destination: "Lisbona, Portogallo",
  startDate: "2026-05-22",
  endDate: "2026-05-25",
  cover: "lisbon",
  days: 4,
  participants: [
    { id: "marco",  name: "Marco Bianchi",  initials: "MB", color: "#D97757", role: "organizer", you: true },
    { id: "sara",   name: "Sara Rossi",     initials: "SR", color: "#7A5AE0", role: "member" },
    { id: "luca",   name: "Luca Verdi",     initials: "LV", color: "#2A6FDB", role: "co-organizer" },
    { id: "giulia", name: "Giulia Conti",   initials: "GC", color: "#1F8A5B", role: "member" },
    { id: "matteo", name: "Matteo Greco",   initials: "MG", color: "#E8995A", role: "member" },
    { id: "chiara", name: "Chiara Marini",  initials: "CM", color: "#C44A6E", role: "member" },
  ],
  trips_other: [
    { id: "tokyo-autumn",  name: "Tokyo in autunno", destination: "Tokyo, Giappone", startDate: "2026-10-12", endDate: "2026-10-22", cover: "tokyo",   participants: 4, status: "upcoming" },
    { id: "ski-dolomiti",  name: "Settimana bianca", destination: "Cortina, Italia",  startDate: "2027-01-18", endDate: "2027-01-25", cover: "alps",    participants: 8, status: "planning" },
    { id: "sicilia-2025",  name: "Road trip Sicilia",destination: "Sicilia, Italia",  startDate: "2025-08-10", endDate: "2025-08-20", cover: "sicily",  participants: 6, status: "past" },
    { id: "amsterdam",     name: "Amsterdam in primavera", destination: "Amsterdam, NL", startDate: "2025-04-04", endDate: "2025-04-07", cover: "amsterdam", participants: 5, status: "past" },
  ],
};

const ITINERARY = [
  {
    date: "2026-05-22", label: "Venerdì 22 maggio", dayNum: 1,
    stops: [
      { id: "s1", time: "07:30", endTime: "09:50", title: "Volo FCO → LIS", subtitle: "TAP Air TP831 · Terminal 1", category: "flight", address: "Aeroporto Fiumicino", note: "Check-in online aperto da giovedì sera" },
      { id: "s2", time: "11:00", title: "Check-in Hotel da Baixa", subtitle: "Boutique 4★ · 3 camere doppie", category: "hotel", address: "Rua dos Fanqueiros 81, 1100-231 Lisboa", note: "Reception sempre aperta. Codice prenotazione: BAIXA-LX-9821" },
      { id: "s3", time: "13:30", title: "Pranzo a Time Out Market", subtitle: "Mercado da Ribeira", category: "food", address: "Av. 24 de Julho 49, 1200-479 Lisboa", note: "" },
      { id: "s4", time: "16:00", title: "Tram 28 + Alfama", subtitle: "Giro panoramico in tram storico", category: "activity", address: "Praça Martim Moniz", note: "Compriamo i biglietti giornalieri da 6€" },
      { id: "s5", time: "20:30", title: "Cena al Cantinho do Avillez", subtitle: "Prenotazione a nome Marco", category: "food", address: "R. dos Duques de Bragança 7, 1200-162 Lisboa", note: "Tavolo per 6 alle 20:30" },
    ],
  },
  {
    date: "2026-05-23", label: "Sabato 23 maggio", dayNum: 2,
    stops: [
      { id: "s6",  time: "09:30", title: "Belém: Torre + Monastero", subtitle: "Visita guidata 3h", category: "activity", address: "Praça do Império, 1400-206 Lisboa", note: "Biglietto cumulativo 12€/persona" },
      { id: "s7",  time: "12:30", title: "Pastéis de Belém", subtitle: "I pasticcini originali", category: "food", address: "R. de Belém 84-92", note: "" },
      { id: "s8",  time: "15:00", title: "LX Factory", subtitle: "Shopping & cultura", category: "activity", address: "R. Rodrigues de Faria 103", note: "" },
      { id: "s9",  time: "19:30", title: "Aperitivo a Bairro Alto", subtitle: "Park Bar — vista tramonto", category: "food", address: "Calçada do Combro 58", note: "Arriviamo presto, fa la fila" },
    ],
  },
  {
    date: "2026-05-24", label: "Domenica 24 maggio", dayNum: 3,
    stops: [
      { id: "s10", time: "10:00", title: "Sintra in giornata", subtitle: "Treno + Palácio da Pena", category: "activity", address: "Stazione Rossio", note: "Treno alle 10:11. Compriamo il combo Pena + Quinta" },
      { id: "s11", time: "13:30", title: "Pranzo a Sintra", subtitle: "Tascantiga", category: "food", address: "Escadinhas da Fonte da Pipa 2, Sintra", note: "" },
      { id: "s12", time: "21:00", title: "Concerto Fado", subtitle: "Tasca do Chico", category: "activity", address: "R. do Diário de Notícias 39", note: "" },
    ],
  },
  {
    date: "2026-05-25", label: "Lunedì 25 maggio", dayNum: 4,
    stops: [
      { id: "s13", time: "10:00", title: "Check-out + caffè", subtitle: "Lasciamo bagagli in hotel", category: "hotel", address: "Rua dos Fanqueiros 81", note: "" },
      { id: "s14", time: "11:30", title: "Mercado da Ribeira (last)", subtitle: "Souvenir e ultimo pranzo", category: "food", address: "Av. 24 de Julho 49", note: "" },
      { id: "s15", time: "16:45", endTime: "19:15", title: "Volo LIS → FCO", subtitle: "TAP Air TP832", category: "flight", address: "Aeroporto Humberto Delgado", note: "" },
    ],
  },
];

const DOCUMENTS = [
  { id: "d1",  name: "Volo TAP TP831 — andata.pdf",   category: "Volo",        size: "238 KB", uploadedBy: "marco", uploadedAt: "12 mag", icon: "pdf" },
  { id: "d2",  name: "Volo TAP TP832 — ritorno.pdf",  category: "Volo",        size: "241 KB", uploadedBy: "marco", uploadedAt: "12 mag", icon: "pdf" },
  { id: "d3",  name: "Hotel da Baixa — voucher.pdf",  category: "Hotel",       size: "412 KB", uploadedBy: "luca",  uploadedAt: "14 mag", icon: "pdf" },
  { id: "d4",  name: "Polizza assicurazione.pdf",     category: "Altro",       size: "896 KB", uploadedBy: "marco", uploadedAt: "15 mag", icon: "pdf" },
  { id: "d5",  name: "Pena — biglietti.pdf",          category: "Prenotazione",size: "184 KB", uploadedBy: "giulia",uploadedAt: "18 mag", icon: "pdf" },
  { id: "d6",  name: "Cantinho do Avillez — conferma.pdf", category: "Prenotazione", size: "92 KB", uploadedBy: "marco", uploadedAt: "20 mag", icon: "pdf" },
  { id: "d7",  name: "Mappa metro Lisbona.png",       category: "Altro",       size: "1.2 MB", uploadedBy: "sara",  uploadedAt: "20 mag", icon: "img" },
  { id: "d8",  name: "Itinerario condiviso.pdf",      category: "Altro",       size: "320 KB", uploadedBy: "marco", uploadedAt: "21 mag", icon: "pdf" },
];

const EXPENSES = [
  { id: "e1", title: "Voli A/R per tutti", amount: 1140.00, paidBy: "marco", date: "2026-04-12", split: "equal", category: "flight",  participants: ["marco","sara","luca","giulia","matteo","chiara"] },
  { id: "e2", title: "Hotel da Baixa (3 notti)", amount: 720.00, paidBy: "luca", date: "2026-04-20", split: "equal", category: "hotel", participants: ["marco","sara","luca","giulia","matteo","chiara"] },
  { id: "e3", title: "Cena Cantinho do Avillez", amount: 312.50, paidBy: "marco", date: "2026-05-22", split: "equal", category: "food", participants: ["marco","sara","luca","giulia","matteo","chiara"] },
  { id: "e4", title: "Tram 28 — biglietti giornalieri", amount: 36.00, paidBy: "giulia", date: "2026-05-22", split: "equal", category: "transport", participants: ["marco","sara","luca","giulia","matteo","chiara"] },
  { id: "e5", title: "Pranzo Time Out Market", amount: 84.20, paidBy: "chiara", date: "2026-05-22", split: "equal", category: "food", participants: ["marco","sara","luca","giulia","matteo","chiara"] },
  { id: "e6", title: "Pena + Quinta Sintra", amount: 96.00, paidBy: "matteo", date: "2026-05-24", split: "equal", category: "activity", participants: ["marco","sara","luca","giulia","matteo","chiara"] },
  { id: "e7", title: "Taxi aeroporto", amount: 28.00, paidBy: "sara", date: "2026-05-22", split: "custom", category: "transport", participants: ["sara","giulia","chiara"] },
  { id: "e8", title: "Aperitivo Park Bar", amount: 54.00, paidBy: "luca", date: "2026-05-23", split: "equal", category: "food", participants: ["marco","sara","luca","giulia","matteo","chiara"] },
];

const NOTIFICATIONS = [
  { id: "n1", type: "expense",  text: "Luca ha aggiunto «Aperitivo Park Bar» — 54,00 €",      time: "2 ore fa", read: false },
  { id: "n2", type: "document", text: "Sara ha caricato «Mappa metro Lisbona.png»",            time: "ieri",     read: false },
  { id: "n3", type: "itinerary",text: "Marco ha modificato la tappa di sabato",                time: "ieri",     read: true  },
  { id: "n4", type: "join",     text: "Chiara si è unita al viaggio",                          time: "3 giorni fa", read: true },
  { id: "n5", type: "expense",  text: "Matteo ha aggiunto «Pena + Quinta Sintra» — 96,00 €",   time: "5 giorni fa", read: true },
];

window.MOCK = { TRIP, ITINERARY, DOCUMENTS, EXPENSES, NOTIFICATIONS };
