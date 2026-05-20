# Cloudflare Pages — static deploy (fix OpenNext errors)

Your build log shows:

```text
Running custom build `npx opennextjs-cloudflare build`
```

That is **wrong** for this repo. The dashboard is using a **Next.js Worker / OpenNext** preset. This site is **static** (`output: "export"` → folder `out/`).

---

## Option A — Fix Cloudflare project settings (required if using Git connect)

1. Cloudflare → **Workers & Pages** → your project → **Settings** → **Build**
2. Change **every** field to match this table:

| Field | Correct value | Wrong (remove) |
|--------|----------------|----------------|
| **Build command** | `npm run build` | `npx opennextjs-cloudflare build` |
| **Build output directory** | `out` | `.vercel/output/static`, `.next` |
| **Deploy command** | `npm run deploy:cloudflare` | `npx opennextjs-cloudflare build`, bare `npx wrangler deploy` (Worker) |
| **Framework preset** | **None** or **Static** | Next.js (Workers), OpenNext |

3. **Environment variables:** `NODE_VERSION` = `22` (Wrangler v4 requires Node 22+)
4. **Save** → **Deployments** → **Retry deployment**

### If **Deploy command** is required (your screen)

Use these three fields together:

| Field | Value |
|--------|--------|
| **Build command** | `npm run build` |
| **Build output directory** | `out` *(if shown)* |
| **Deploy command** | `npm run deploy:cloudflare` |

That runs `wrangler pages deploy out` — static only, no OpenNext.

**Project name:** Cloudflare project must be named `buildify-website` (matches `wrangler.toml`), or change the name in `package.json` → `deploy:cloudflare` script to match your project.

---

## Fix: `Authentication error [code: 10000]` on deploy

Build works; **Wrangler deploy** fails because `CLOUDFLARE_API_TOKEN` lacks **Pages deploy** permission or targets the **wrong account** (personal vs `BUILDIFY-TECH-SERVICES` org).

### 1. Create a new API token

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) → **Create Token** → **Custom token**
2. **Permissions:**

| Permission | Access |
|------------|--------|
| Account → **Cloudflare Pages** | **Edit** |
| Account → **Account Settings** | Read |
| User → **User Details** | Read |

3. **Account resources:** include the account where the Pages project lives:
   - **BUILDIFY-TECH-SERVICES** (org), **or**
   - your personal account — if the project is there
4. Create token → copy it once.

### 2. Add secrets in Cloudflare (project → Settings → Environment variables)

| Name | Type | Value |
|------|------|--------|
| `CLOUDFLARE_API_TOKEN` | **Secret** | paste new token |
| `CLOUDFLARE_ACCOUNT_ID` | Plain or Secret | Account ID from Workers & Pages overview (org or personal) |

Use the **Account ID** for the same account that owns the `buildify-website` Pages project — not necessarily the personal ID from build logs unless the project is under personal account.

### 3. Redeploy

Retry deployment. Deploy step should pass after token + account ID match.

### Optional: deploy script with explicit account

If needed, change deploy command to:

```bash
npx wrangler pages deploy out --project-name=buildify-website
```

and ensure `CLOUDFLARE_ACCOUNT_ID` is set in env (Wrangler reads it automatically).

If there is no way to clear **Deploy command** or **Build command**, **delete this project** and create a new one:

- **Create** → **Pages** → **Connect to Git** → `BUILDIFY-WEBSITE`
- Framework: **None**
- Build: `npm run build`
- Output: `out`
- Do **not** enable “Full stack” / “SSR” / “Workers” for Next.js

---

## Option B — GitHub Actions (recommended if dashboard keeps OpenNext)

This repo includes `.github/workflows/cloudflare-pages.yml` which runs `npm run build` and `pages deploy out`.

### One-time setup

1. Cloudflare → **My Profile** → **API Tokens** → **Create Token** → template **Edit Cloudflare Workers** (or custom with **Account** + **Cloudflare Pages: Edit**)
2. Copy **Account ID** from Workers & Pages overview (right column)
3. GitHub → **BUILDIFY-WEBSITE** → **Settings** → **Secrets and variables** → **Actions** → add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Cloudflare → create empty Pages project named **`buildify-website`** (or the workflow will try to deploy to that name)
5. Push to `main` — Actions tab runs the deploy

**Disable** automatic builds on the Cloudflare Git integration if both run (Settings → Builds → disconnect or pause Git builds) so only the Action deploys.

---

## Verify locally

```bash
npm run build
# must create ./out with index.html
```

---

## Errors explained

| Error | Cause |
|--------|--------|
| `WORKER_SELF_REFERENCE` / `buildify-3d-tech` not found | Worker deploy preset |
| `opennextjs-cloudflare build` failed | Dashboard build command still OpenNext |
| `pages-manifest.json` in `.next/standalone` | OpenNext expects SSR bundle, not static export |
