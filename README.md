# Archetipo Workshop

Questo è un workshop pratico in cui costruirai un prodotto digitale da zero usando l'AI come copilota e il framework [Archetipo](https://github.com/techreloaded-ar/archetipo) come guida metodologica. Il boilerplate di partenza include Next.js 15, Supabase per auth e storage, Prisma, Tailwind CSS v4 e shadcn/ui: tutto già configurato per permetterti di concentrarti sul prodotto, non sull'infrastruttura.

## Guida Setup

### Backend backlog disponibili

Durante il setup puoi scegliere uno di questi backend per la gestione del backlog:

- `File`: il backlog viene gestito su file nel progetto e viene copiato anche `archetipo-viewer`, un viewer locale per lavorare su `docs/BACKLOG.md`. Questo backend non inizializza GitHub Project e non scrive `.archetipo/config.yaml`.
- `GitHub Projects`: il backlog viene gestito tramite GitHub Projects v2. Questo backend copia `.archetipo`, inizializza il project board e scrive `.archetipo/config.yaml`.

Scegli `File` se vuoi un flusso locale e semplice. Scegli `GitHub Projects` se vuoi backlog, status e sub-issue integrate in GitHub.

### Prerequisiti comuni

- **Node.js** v18+ installato ([nodejs.org](https://nodejs.org))
- **Git** installato
- Un account **GitHub** per repository e login OAuth
- Un account **Supabase** gratuito ([supabase.com](https://supabase.com))

### Prerequisiti aggiuntivi per `GitHub Projects`

- **GitHub CLI** installata ([cli.github.com](https://cli.github.com))
- Permessi GitHub Projects v2 attivi sulla CLI

Autentica GitHub CLI prima di lanciare lo script se intendi scegliere il backend `GitHub Projects`:

```bash
gh auth login
gh auth refresh -s read:project -s project
```

`gh auth login` autentica la CLI. `gh auth refresh -s read:project -s project` abilita gli scope necessari a GitHub Projects v2, che Archetipo usa per creare e aggiornare il backlog.

---

### 1. Installa Archetipo Workshop

Crea prima un repository GitHub vuoto, senza README iniziale, e copia il suo URL remoto. Poi apri un terminale in una cartella a piacere e lancia lo script per il tuo sistema operativo.

**macOS / Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/techreloaded-ar/archetipo-workshop/main/setup.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://raw.githubusercontent.com/techreloaded-ar/archetipo-workshop/main/setup.ps1 | iex
```

Lo script ti chiederà:

1. nome della cartella del progetto;
2. URL del repository remoto;
3. backend backlog: `File` oppure `GitHub Projects`;
4. strumenti AI su cui installare le skill di Archetipo.

Al termine entra nella cartella del progetto:

```bash
cd nome-cartella-progetto
```

#### Se hai scelto `File`

Il setup:

- copia le skill da `backend/file/skills` negli strumenti selezionati;
- copia `archetipo-viewer/` nella root del progetto;
- non esegue l'inizializzazione di GitHub Projects;
- non genera `.archetipo/config.yaml`.

Per usare il viewer backlog:

1. Apri `archetipo-viewer/index.html` in Chrome o Edge.
2. Premi `Apri progetto`.
3. Seleziona la root del progetto.

Il viewer leggerà `docs/BACKLOG.md` e, quando presenti, i file in `docs/planning/`.

#### Se hai scelto `GitHub Projects`

Il setup:

- copia le skill da `backend/github/skills` negli strumenti selezionati;
- copia `.archetipo/` nella root del progetto;
- esegue `node .archetipo/cli/archetipo.mjs setup-project`;
- crea e configura il GitHub Project;
- scrive `.archetipo/config.yaml`.

---

### 2. Crea un progetto Supabase

1. Vai su [supabase.com](https://supabase.com) e fai login.
2. Clicca **New Project**.
3. Scegli nome, password del database e region.
4. Salva la password del database.
5. Aspetta che il progetto sia pronto.

---

### 3. Configura le variabili d'ambiente

Copia il file di esempio:

```bash
cp .env.example .env
```

Compila `.env` con i valori del tuo progetto Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
DATABASE_URL=
```

Per trovare i valori:

- clicca **Connect** nella top bar di Supabase;
- nel tab **Frameworks**, seleziona **Next.js** e copia `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`;
- net tab **Direct** scegli come metodo di connessione **Session Pooler** e copia la connection string `postgresql://...`

Nella connection string sostituisci `[YOUR-PASSWORD]` con la password scelta quando hai creato il progetto.

---

### 4. Installa le dipendenze

```bash
npm install
```

Durante `npm install` viene eseguito anche `postinstall`, che genera il Prisma Client e sincronizza lo schema con il database. Non sono necessari altri comandi Prisma durante il setup iniziale.

---

### 5. Avvia il server di sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

### 6. Testa il login OAuth

1. Vai su [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin).
2. Registrati e completa il flusso OAuth.
3. Verifica di essere reindirizzato alla dashboard protetta.



## Troubleshooting

### GitHub Project non viene creato

- Questo controllo vale solo se hai scelto il backend `GitHub Projects`.
- Verifica l'autenticazione con `gh auth status`.
- Esegui `gh auth refresh -s read:project -s project`.
- Rilancia lo script di setup.

### Non trovo `.archetipo/config.yaml`

- Se hai scelto il backend `File`, e' normale: quel backend non usa GitHub Projects e non genera `config.yaml`.
- Se hai scelto `GitHub Projects`, rilancia il setup e verifica che `gh auth login` e `gh auth refresh -s read:project -s project` siano andati a buon fine.

### Non trovo `archetipo-viewer/`

- `archetipo-viewer/` viene copiato solo se hai scelto il backend `File`.
- Se hai scelto `GitHub Projects`, la sua assenza e' corretta.

### "Invalid API key" o errori di autenticazione

- Verifica che `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` siano corretti in `.env`.
- Assicurati di non avere spazi extra nei valori.

### "Can't reach database server"

- Verifica che `DATABASE_URL` sia corretto in `.env`.
- Assicurati di aver sostituito `[YOUR-PASSWORD]` con la password reale del database.
- Controlla di usare il **Session Pooler**.

### Il login OAuth non funziona

- Verifica che i provider GitHub e/o Google siano attivati in Supabase **Authentication -> Providers**.
- Assicurati che il Redirect URL in Supabase includa `http://localhost:3000/auth/callback`.

### Dopo `npm install` compare un errore Prisma

- Verifica che `DATABASE_URL` in `.env` sia corretta.
- Prova a eseguire manualmente `npx prisma generate`.
- Se hai modificato `prisma/schema.prisma`, esegui `npm run db:push`.

## Deploy su Vercel

### 1. Prepara il repository

Assicurati che il codice sia pushato su GitHub e che il progetto faccia build correttamente in locale:

```bash
npm run build
```

### 2. Importa il progetto su Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi con il tuo account GitHub.
2. Clicca **Add New -> Project**.
3. Seleziona il repository dalla lista e autorizza l'accesso se richiesto.
4. Vercel rileva automaticamente Next.js: lascia le impostazioni di default.

### 3. Configura le variabili d'ambiente

Prima di cliccare Deploy, aggiungi queste variabili nella sezione **Environment Variables**:

| Variabile | Valore |
|---|---|
| `DATABASE_URL` | Connection string PostgreSQL con Session Pooler |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del progetto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chiave pubblica Supabase |

### 4. Clicca Deploy

Vercel eseguirà build e deploy. Al termine riceverai un URL pubblico, per esempio `https://tuo-progetto.vercel.app`.

### 5. Aggiorna i redirect OAuth

Per far funzionare il login OAuth in produzione, aggiorna gli URL di redirect su Supabase e sui provider OAuth che usi.

**Su Supabase:**

1. Apri il [Supabase Dashboard](https://supabase.com/dashboard) e seleziona il tuo progetto.
2. Vai su **Authentication -> URL Configuration**.
3. Aggiungi il tuo URL Vercel alla lista dei **Redirect URLs**:

   ```text
   https://tuo-progetto.vercel.app/auth/callback
   ```

**Sul provider OAuth:**

- **GitHub**: vai su [github.com/settings/developers](https://github.com/settings/developers), apri la tua OAuth App e aggiorna **Authorization callback URL** con `https://tuo-progetto.vercel.app/auth/callback`.
- **Google**: vai sulla [Google Cloud Console](https://console.cloud.google.com/apis/credentials), apri il tuo OAuth Client e aggiungi `https://tuo-progetto.vercel.app/auth/callback` tra gli **Authorized redirect URIs**.

### Troubleshooting Deploy

**Build fallisce con errore Prisma "Cannot find module"**

- Vercel deve generare il Prisma Client durante il build. Verifica che `postinstall` in `package.json` includa `prisma generate`.

**"Can't reach database server" in produzione**

- Verifica che `DATABASE_URL` usi il Session Pooler.
- Controlla che la password nella connection string sia corretta e non contenga il placeholder `[YOUR-PASSWORD]`.

**OAuth login redirect non funziona**

- Assicurati di aver aggiunto `https://tuo-progetto.vercel.app/auth/callback` nei Redirect URLs di Supabase.
- Verifica che `NEXT_PUBLIC_SUPABASE_URL` sia configurata correttamente nelle env di Vercel.

**Le modifiche alle variabili d'ambiente non hanno effetto**

- Dopo aver modificato le env su Vercel, fai un **Redeploy** da **Deployments -> ultimo deploy -> Redeploy**.
