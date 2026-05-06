# TravelHub — Product Requirements Document

**Author:** Archetipo
**Date:** 2026-05-06
**Version:** 1.0

---

## Elevator Pitch

> Per **gruppi di amici che viaggiano insieme (4-10 persone)**, che hanno il problema di **trovare le informazioni del viaggio sparse tra WhatsApp, email, PDF e Google Docs**, **TravelHub** è un **travel hub centralizzato** che **offre una visione d'insieme immediata di tutto il viaggio — itinerario, documenti, spese**. A differenza di **WhatsApp + Google Docs + Splitwise usati insieme**, il nostro prodotto **unifica tutto in un'unica interfaccia strutturata, pensata per chi non vuole fare nulla ma deve sapere tutto**.

---

## Vision

Un unico posto dove tutto il gruppo trova sempre le informazioni del viaggio — senza dover cercare tra messaggi, PDF e screenshot.

### Product Differentiator

La **dashboard di sintesi travel-aware**: progettata per il partecipante passivo che apre l'app e in 10 secondi sa dove dorme stanotte, a che ora è il volo e quanto deve ancora al gruppo. Non uno strumento di pianificazione, ma un hub di accesso alle informazioni già pianificate altrove.

---

## User Personas

### Persona 1: Marco

**Ruolo:** Il Coordinatore
**Età:** 30 | **Background:** Lavora in consulenza, abituato a organizzare e gestire informazioni. Ha già un sistema personale (Notion + screenshot su WhatsApp) ma è frustrato dalla dispersione delle informazioni nel gruppo.

**Goals:**
- Avere un posto unico dove caricare tutto il materiale del viaggio
- Condividere le informazioni senza dover rispondere 10 volte alle stesse domande
- Tenere traccia delle spese e dei saldi senza litigare a fine viaggio

**Pain Points:**
- Deve rispondere ogni volta a "ma qual era l'indirizzo dell'hotel?"
- I PDF dei voli sono sepolti nella sua email, gli altri non li trovano
- Splitwise separato da tutto il resto crea un contesto frammentato

**Behaviors & Tools:** Notion, Google Docs, WhatsApp, email, Splitwise. Prenotazione attiva su Booking e Google Flights.

**Motivazioni:** Vuole che il gruppo sia autonomo e non dipenda da lui per ogni info
**Tech Savviness:** Alta

#### Customer Journey — Marco

| Phase | Action | Thought | Emotion | Opportunity |
|---|---|---|---|---|
| Awareness | Cerca alternative a Notion per condividere info di viaggio | "Devo trovare qualcosa che usino anche gli altri, non solo io" | Frustrazione | Posizionare TravelHub come strumento per il gruppo, non per il singolo |
| Consideration | Confronta TravelHub con Google Docs e Notion | "Finalmente una cosa pensata per i viaggi, non generica" | Curiosità | Demo della dashboard con dati precaricati |
| First Use | Crea il primo viaggio, carica i documenti, invita il gruppo | "Semplice — ci ho messo 5 minuti" | Soddisfazione | Onboarding guidato con template viaggio |
| Regular Use | Il gruppo consulta in autonomia, Marco smette di rispondere su WhatsApp | "Funziona — non mi chiedono più dove si dorme" | Sollievo | Notifiche di attività del gruppo per sentirsi meno solo |
| Advocacy | Suggerisce TravelHub al prossimo viaggio con altri amici | "Lo uso per tutti i viaggi ormai" | Fidelizzazione | Funzione "duplica viaggio" e referral |

---

### Persona 2: Sara

**Ruolo:** La Partecipante
**Età:** 28 | **Background:** Usa il telefono per tutto ma evita le app nuove se non le servono subito. Ha sempre qualcuno che organizza per lei e si fida di chi lo fa.

**Goals:**
- Sapere dove essere e quando, senza dover cercare
- Vedere quanto deve al gruppo senza calcoli manuali
- Accedere ai documenti (es. prenotazione hotel) in modo rapido al momento del bisogno

**Pain Points:**
- Scrollare WhatsApp alla ricerca del PDF del volo mandato 3 settimane fa
- Non sa mai a quanto ammonta il suo debito con il gruppo fino a fine viaggio
- Crea un account solo se il valore è immediatamente chiaro

**Behaviors & Tools:** WhatsApp, Instagram, Google Maps. Fruizione passiva, raramente produce contenuto.

**Motivazioni:** Godersi il viaggio senza pensieri logistici
**Tech Savviness:** Media-bassa

#### Customer Journey — Sara

| Phase | Action | Thought | Emotion | Opportunity |
|---|---|---|---|---|
| Awareness | Riceve un invito via email da Marco | "Cos'è TravelHub? Un'altra roba da installare?" | Scetticismo | Email di invito con preview immediata del viaggio, senza login obbligatorio per il primo accesso |
| Consideration | Apre il link e vede la dashboard del viaggio | "Oh, c'è scritto tutto — il volo, l'hotel, quanto devo" | Piacevole sorpresa | Dashboard leggibile in 10 secondi, zero attrito |
| First Use | Crea il profilo con Google in un click | "Ok, 30 secondi — fatto" | Sollievo | OAuth Google/GitHub — nessun form |
| Regular Use | Apre l'app il giorno del volo per cercare l'indirizzo dell'hotel | "Lo trovo subito" | Fiducia | Ricerca rapida e sezione documenti in evidenza |
| Advocacy | Manda uno screenshot della dashboard a un'amica | "Guarda come si vede tutto — Marco ha usato questa cosa" | Soddisfazione passiva | Share della dashboard come vettore di acquisizione |

---

## Brainstorming Insights

> Scoperte chiave emerse durante la sessione di inception.

### Assumptions Challenged

- **"Tutti usano l'app attivamente"** — Sfatato. Il 70% dei partecipanti sarà passivo. La UX del consumatore è più critica di quella del produttore.
- **"Serve un link pubblico per abbassare la barriera"** — Parzialmente sfatato. I link pubblici espongono dati sensibili (passaporti, numeri prenotazione). OAuth in un click (Google/GitHub) è sufficiente per ridurre l'attrito.
- **"Il prodotto compete con TripIt e Splitwise"** — Sfatato. Il vero competitor è il gruppo WhatsApp con un Google Doc pinnato. Il posizionamento deve battere l'abitudine, non un'altra app.

### New Directions Discovered

- **Mercato adiacente:** gruppi di colleghi in trasferta di lavoro — stesso problema, budget aziendale, compliance ricevute. Da esplorare post-MVP.
- **Accesso guest via link** come vettore di acquisizione virale (Growth): Sara vede la dashboard senza account → si iscrive → diventa coordinatrice nel prossimo viaggio.
- **Il nemico numero uno è l'attrito nell'onboarding del primo viaggio**: se caricare i documenti richiede più di 60 secondi, Marco non lo fa.

---

## Product Scope

### MVP — Minimum Viable Product

- Creazione e gestione viaggi (nome, date, destinazione)
- Invito partecipanti via email con ruolo organizzatore multiplo
- Dashboard di sintesi del viaggio (tappe del giorno, documenti, saldo)
- Itinerario giornaliero con tappe, orari e indirizzi
- Upload e organizzazione documenti per categoria (volo, hotel, altro)
- Gestione spese con suddivisione personalizzabile per partecipante
- Riepilogo saldi (dare/avere per persona)
- Notifiche email per eventi chiave (invito, nuovo documento, nuova spesa)
- Centro notifiche in-app

### Growth Features (Post-MVP)

- Galleria foto condivisa con upload multiplo
- Accesso guest via link con scadenza e revoca (con separazione dati sensibili)
- Notifiche push (browser/mobile)
- Funzione "duplica viaggio" per template riutilizzabili

### Vision (Future)

- Integrazione automatica voli/hotel da email forward
- Notifiche WhatsApp/SMS per eventi critici
- Report spese esportabile (PDF/CSV) — utile per rimborsi aziendali
- Mercato business travel: gruppi di colleghi in trasferta

---

## Technical Architecture

> **Proposto da:** Leonardo (Architect)

### System Architecture

Il progetto utilizza un boilerplate esistente con auth, database e UI già configurati. Ricostruire le fondamenta comporterebbe sprechi di tempo e introdurrebbe inconsistenze. L'architettura si basa su questo stack consolidato e lo estende con i moduli applicativi di TravelHub.

**Architectural Pattern:** Modular Monolith con Next.js App Router

**Main Components:**
- **`/trips`** — Creazione, gestione e dashboard dei viaggi
- **`/participants`** — Inviti, gestione membri, ruoli organizzatore
- **`/documents`** — Upload, categorizzazione e accesso ai documenti via Supabase Storage
- **`/expenses`** — Registrazione spese, suddivisione personalizzata, calcolo saldi
- **`/notifications`** — Centro notifiche in-app + invio email via Resend
- **`/media`** — Galleria foto condivisa (Growth)

### Technology Stack

| Layer | Tecnologia | Versione | Rationale |
|---|---|---|---|
| Frontend + Backend | Next.js (App Router) | 15.x | Boilerplate esistente; SSR nativo per dashboard veloci |
| Linguaggio | TypeScript | 5.x | Type-safety end-to-end, già configurato |
| Auth | Supabase OAuth (GitHub + Google) | — | OAuth in un click — zero attrito per Sara |
| Database | PostgreSQL via Supabase | — | Hosting managed, già connesso |
| ORM | Prisma | 5.x | Type-safety sulle query, migration gestite |
| Storage (documenti/foto) | Supabase Storage | — | Elimina la complessità di un file server custom |
| UI Components | shadcn/ui | — | Boilerplate esistente, design system coerente |
| CSS | Tailwind CSS | v4 | Già configurato con `@tailwindcss/postcss` |
| Email | Resend | — | Integrazione Next.js in pochi minuti, piano free generoso |
| Testing | Vitest + Testing Library | — | Standard per Next.js App Router |

### Project Structure

**Organizational pattern:** Feature-based modules dentro `src/app/`

```
src/
  app/
    layout.tsx
    page.tsx                    # Home / lista viaggi
    providers.tsx
    globals.css
    dashboard/
      page.tsx                  # Protected — lista viaggi utente
    trips/
      [id]/
        page.tsx                # Dashboard viaggio
        itinerary/page.tsx      # Itinerario giornaliero
        documents/page.tsx      # Documenti e biglietti
        expenses/page.tsx       # Spese e saldi
        settings/page.tsx       # Partecipanti e ruoli
    auth/
      signin/page.tsx
      callback/route.ts
      signout/route.ts
    api/
      trips/route.ts
      documents/route.ts
      expenses/route.ts
      notifications/route.ts
  components/
    ui/                         # shadcn/ui
    trips/                      # Componenti dominio viaggio
    expenses/                   # Componenti dominio spese
  lib/
    utils.ts
    prisma.ts
    supabase/
      client.ts
      server.ts
      middleware.ts
    resend.ts                   # Email client
  middleware.ts
prisma/
  schema.prisma                 # User + Trip + Participant + Document + Expense
```

### Development Environment

Next.js 15 con Turbopack per il dev server (`next dev --turbopack`). Supabase locale opzionale via Supabase CLI per sviluppo offline.

**Required tools:** Node.js 20+, npm, Supabase CLI (opzionale), Prisma CLI

### CI/CD & Deployment

**Build tool:** Next.js build (`next build`)

**Pipeline:** GitHub Actions — lint + typecheck + test su ogni PR

**Deployment:** Vercel (zero config, integrazione nativa Next.js)

**Target infrastructure:** Vercel (frontend + API) + Supabase hosted (database + auth + storage)

### Architecture Decision Records (ADR)

- **ADR-1:** Resend per email invece di Nodemailer — zero configurazione SMTP, API moderna, plan free sufficiente per MVP
- **ADR-2:** Supabase Storage per documenti — evita di gestire bucket S3 custom, già integrato con auth e RLS
- **ADR-3:** Accesso guest via link rimandato a Growth — i dati sensibili (passaporti, numeri prenotazione) richiedono mitigazioni di sicurezza (scadenza link, revoca, separazione dati) non sostenibili nell'MVP
- **ADR-4:** Modular Monolith — velocità di sviluppo nell'MVP, possibilità di estrarre microservizi se il carico lo richiede in futuro

---

## Functional Requirements

**FR1 — Creazione viaggio**
L'utente autenticato può creare un viaggio specificando nome, date (inizio/fine), destinazione principale e immagine di copertina opzionale.

**FR2 — Invito partecipanti via email**
L'organizzatore può invitare partecipanti inserendo il loro indirizzo email. L'invitato riceve un'email con link per accettare e unirsi al viaggio.

**FR3 — Ruolo organizzatore multiplo**
L'organizzatore può promuovere uno o più partecipanti al ruolo di co-organizzatore. Solo gli organizzatori possono eliminare il viaggio o rimuovere partecipanti.

**FR4 — Dashboard del viaggio**
Pagina di sintesi del viaggio accessibile a tutti i partecipanti: mostra le tappe del giorno corrente, gli ultimi documenti caricati e il saldo personale dell'utente.

**FR5 — Itinerario giornaliero**
Gli organizzatori possono creare e modificare un itinerario strutturato per giorno, con tappe che includono nome, orario, indirizzo e note libere.

**FR6 — Upload documenti**
I partecipanti possono caricare file (PDF, immagini) associati al viaggio. I file vengono archiviati su Supabase Storage e accessibili a tutti i partecipanti.

**FR7 — Organizzazione documenti per categoria**
I documenti possono essere etichettati con una categoria (Volo, Hotel, Prenotazione, Altro) per facilitare la ricerca.

**FR8 — Registrazione spesa**
Qualsiasi partecipante può registrare una spesa indicando importo, descrizione, data e chi ha pagato.

**FR9 — Suddivisione spesa personalizzabile**
Al momento della registrazione, la spesa può essere suddivisa in parti uguali tra tutti i partecipanti oppure con importi personalizzati per ciascuno.

**FR10 — Riepilogo saldi**
La sezione spese mostra per ogni partecipante il totale pagato, il totale dovuto e il saldo netto (dare/avere) verso gli altri membri del gruppo.

**FR11 — Notifiche email**
Il sistema invia email automatiche per eventi chiave: invito al viaggio, caricamento di un nuovo documento, aggiunta di una nuova spesa che coinvolge il destinatario.

**FR12 — Centro notifiche in-app**
Ogni utente ha un centro notifiche in-app con badge che mostra le attività recenti del viaggio (nuovi documenti, spese, modifiche all'itinerario).

---

## Non-Functional Requirements

### Security

- Autenticazione obbligatoria via OAuth (GitHub o Google) per accedere a qualsiasi dato del viaggio
- Accesso ai documenti su Supabase Storage protetto da Row Level Security (RLS): solo i partecipanti del viaggio possono scaricare i file
- Le email di invito contengono token monouso con scadenza (24h) per prevenire abusi
- Nessun dato sensibile esposto in URL pubblici nell'MVP

### Integrations

- **Supabase Auth** — gestione OAuth e sessioni (già configurato nel boilerplate)
- **Supabase Storage** — archiviazione documenti e foto con RLS
- **Prisma / PostgreSQL** — persistenza dati applicativi
- **Resend** — invio email transazionali (inviti, notifiche)

---

## Next Steps

1. **UX Design** — Definire i flussi di interazione dettagliati e wireframe per le feature MVP, con focus sulla dashboard di sintesi per Sara
2. **Prisma Schema** — Estendere il modello dati con Trip, Participant, Document, Expense, Notification
3. **Backlog** — Decomporre i requisiti funzionali in epiche e user story pronte per lo sviluppo
4. **Validazione** — Review con stakeholder e test delle assunzioni più rischiose (attrito onboarding Marco, adozione Sara)

---

_PRD generato via Archetipo Product Inception — 2026-05-06_
_Sessione condotta da: Vincenzo con il team Archetipo_
