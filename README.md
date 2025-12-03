
# AunuCloud – Dark Themed Hosting Platform (Demo)

This is a **demo starter project** for **AunuCloud** built with:

- **Next.js + TypeScript**
- **Custom CSS (dark, aurora, dimensional UI)**
- Skeleton integrations for:
  - Oxapay crypto payments
  - Pterodactyl panel (PLTA / PLTC keys)
  - MongoDB
  - Discord webhook
  - AunuSpace AI
- Extra folders:
  - `php/` callback example
  - `java/` Discord worker example

> This project is not production ready yet – all backend parts are **skeletons** you can extend.

---

## 1. Project structure

```text
aunucloud-app/
├─ pages/
│  ├─ index.tsx                # Animated dark homepage
│  ├─ hosting/
│  │  ├─ vps.tsx               # VPS plans
│  │  ├─ minecraft.tsx         # Minecraft hosting
│  │  └─ bot.tsx               # Bot hosting
│  ├─ auth/
│  │  ├─ login.tsx             # Aurora login UI
│  │  └─ register.tsx          # Aurora register UI
│  ├─ dashboard/
│  │  ├─ index.tsx             # Dashboard (role-aware)
│  │  └─ redeem.tsx            # Redeem code page
│  └─ api/
│     ├─ auth/                 # login / register handlers
│     ├─ payments/             # Oxapay create + webhook
│     ├─ services/             # redeem endpoint
│     └─ ai/                   # AunuSpace AI proxy
├─ components/
│  ├─ Layout.tsx
│  ├─ Navbar.tsx
│  ├─ Footer.tsx
│  └─ HeroAurora.tsx
├─ lib/
│  ├─ db.ts                    # MongoDB connection
│  ├─ roles.ts                 # Owner / Developer / Admin / Customer / Member
│  ├─ oxapay.ts                # Oxapay helper (stub)
│  ├─ pterodactyl.ts           # Pterodactyl helper (stub)
│  ├─ discord.ts               # Discord webhook helper
│  └─ ai.ts                    # AunuSpace AI helper (stub)
├─ public/assets/
│  └─ aunucloud-logo.jpg       # Logo imported from your image
├─ styles/globals.css          # Dark + aurora + 3D buttons
├─ php/oxapay-callback.php     # Example legacy callback
└─ java/src/.../DiscordWebhookWorker.java
```

---

## 2. Getting started

### Install dependencies

```bash
cd aunucloud-app
npm install
# or
yarn
```

### Configure environment

Create `.env.local` in `aunucloud-app/`:

```bash
MONGODB_URI=mongodb+srv://user:pass@cluster-url/aunucloud
MONGODB_DB=aunucloud

OXAPAY_API_KEY=your_oxapay_api_key_here

PANEL_URL=https://panel.your-ptero.com
PANEL_PLTA_KEY=your_pterodactyl_admin_key
PANEL_PLTC_KEY=your_pterodactyl_client_key

DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

AUNUSPACE_API_KEY=your_aunuspace_ai_key_here
```

> These values are **required** for the backend helpers to work.

### Run dev server

```bash
npm run dev
# open http://localhost:3000
```

You should see the animated dark homepage with:

- Aurora hero section and AunuCloud branding.
- Navigation to VPS / Minecraft / Bot pages.
- Auth pages with glassmorphism + dimensional buttons.
- Dashboard + redeem code page.

---

## 3. Roles & AunuSpace AI

Roles are defined in `lib/roles.ts`:

- `OWNER`
- `DEVELOPER`
- `ADMIN`
- `CUSTOMER`
- `MEMBER`

Concept:

- **Member** – default limited AI, simple usage only.
- **Customer** – higher limits, can ask billing + deployment questions.
- **Admin / Developer / Owner** – unlimited AI, can use advanced management tools.

In a real app you would:

1. Store the role in `users` collection (already done at registration: new users = `CUSTOMER`).
2. Read it in `dashboard` and in `AunuSpace AI` endpoint.
3. Add rate limiting / permissions based on `Role`.

Only the **Owner** should be allowed to:

- Promote users to `DEVELOPER` / `ADMIN`.
- Manage global stock (VPS / MC / Bot).
- Add other owner-level configuration.

---

## 4. Payments & Pterodactyl (high-level flow)

1. User picks a plan (for example on `/hosting/vps`).
2. Frontend calls `POST /api/payments/create-oxapay` with:
   - `userId`, `planId`, `amountUsd`, `serviceType`, `location`.
3. `lib/oxapay.createOxapayInvoice`:
   - Creates a pending order in MongoDB.
   - Calls Oxapay API (you need to implement the real HTTP request).
   - Returns `payUrl` to redirect the user.
4. Oxapay webhook hits `pages/api/payments/webhook.ts` (or `php/oxapay-callback.php` if you need PHP):
   - `handleOxapayWebhook` verifies + marks order as PAID.
   - `autoDeployService` calls Pterodactyl API using PLTA / PLTC keys and:
     - Picks a **random node** in the chosen location from `nodes` collection.
     - Creates a server and stores it as `services` in MongoDB.
   - `sendDiscordWebhook` posts proof-of-payment / service info to Discord.

You still need to:

- Implement real HTTP calls to Oxapay and Pterodactyl APIs.
- Store and manage stock (`nodes`, `plans`, `stock` collections).

---

## 5. Redeem codes

- Admin/Developer/Owner can generate codes in MongoDB, e.g.:

```js
db.redeemCodes.insertOne({
  code: "AUNU-TEST-1234",
  used: false,
  action: { type: "EXTEND_SERVICE", days: 30 },
  createdBy: "admin-id"
});
```

- Customer enters code on `/dashboard/redeem`.
- `POST /api/services/redeem`:
  - Validates `code` in `redeemCodes` collection.
  - Marks it as used.
  - TODO: perform `action` (extend service / create bonus plan, etc.).

---

## 6. PHP & Java folders

- `php/oxapay-callback.php`  
  Example endpoint if Oxapay must call PHP; it logs the payload and you can forward it to Next.js.

- `java/src/main/java/com/aunucloud/webhook/DiscordWebhookWorker.java`  
  Simple worker that pushes Discord embeds from a Java service (optional).

---

## 7. Customizing

- Replace `public/assets/aunucloud-logo.jpg` with your final logo if you wish.
- Update texts, pricing, features and regions in:
  - `pages/hosting/*.tsx`
  - `pages/index.tsx`
- Flesh out:
  - Authentication (JWT / session cookies).
  - Admin UI to manage stock, users and roles.
  - AunuSpace AI frontend chat component on the dashboard.

---

Made for **AunuCloud** with love. 🚀


---

## 8. OxaPay integration (real endpoint)

The helper in `lib/oxapay.ts` now calls the official **Generate Invoice** endpoint
(`POST https://api.oxapay.com/v1/payment/invoice`) with your `OXAPAY_API_KEY`
and creates a payment URL, following the OxaPay docs. citeturn3view0

Set these additional env vars:

```bash
OXAPAY_BASE_URL=https://api.oxapay.com/v1
OXAPAY_CALLBACK_URL=https://your-domain.com/api/payments/webhook
OXAPAY_RETURN_URL=https://your-domain.com/dashboard
OXAPAY_SANDBOX=true   # or false in production
```

The webhook handler verifies the HMAC signature, marks the order as **PAID**
and then triggers `autoDeployService` + Discord webhook, based on OxaPay’s webhook
specification. citeturn4view0

## 9. AunuSpace AI chat UI

The dashboard now includes an `AiChatPanel` component with a small chat UI.
It calls `/api/ai/query`, which forwards the request to your AunuSpace AI
backend via `lib/ai.ts`. Configure:

```bash
AUNUSPACE_API_KEY=your_key_here
AUNUSPACE_BASE_URL=https://your-ai-endpoint.com/chat
```

Then implement your own AI server to respond with `{ reply: "..." }`.


## 10. Simple admin dashboard

A new page `/dashboard/admin` shows:

- Latest **orders** from the `orders` collection
- Current **stock** for each plan from the `plans` collection

Data is loaded via:

- `GET /api/admin/orders`
- `GET /api/admin/stock`

Right now the role is hard-coded to `OWNER` inside `pages/dashboard/admin.tsx`.
Once you add a proper auth system, restrict this page + API routes so only
**Owner / Developer / Admin** can access them.


## 11. VPS coming soon (3D scene)

The `/hosting/vps` page now shows a **Three.js** based space scene with an
astronaut repairing a satellite, plus copy explaining that VPS is "coming soon".
There is no auto-deploy logic for VPS yet; redemptions of type `VPS` are stored
as reservations in `vpsReservations`.

## 12. Redeem system

New admin endpoints and pages:

- `POST /api/redeem/generate` – create codes (AUNU_XXXX_XXXX)
- `GET /api/redeem/list` – list all codes + claims
- `POST /api/redeem/claim` – user redeem

Pages:

- `/dashboard/redeem` – user redeem form
- `/dashboard/admin-redeem` – admin code generator + overview

Redeem types:

- `BALANCE` – adds USD amount to `users.balance`
- `MINECRAFT` – auto-deploy MC hosting via Pterodactyl (stub)
- `BOT` – auto-deploy bot hosting via Pterodactyl (stub)
- `VPS` – mark VPS reservation (no real deploy yet)

## 13. AunuSpace AI via Puter.js

The dashboard AI panel is now powered by **Puter.js**:

- `pages/_app.tsx` injects `<script src="https://js.puter.com/v2/"></script>` using `next/script`.
- `components/AiChatPanel.tsx` calls `puter.ai.chat()` directly on the client.
- No backend API keys are required; usage is handled by Puter. citeturn0search0turn0search11
