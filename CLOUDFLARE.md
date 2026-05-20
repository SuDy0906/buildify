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
| **Deploy command** | *(empty / not set)* | `npx wrangler deploy`, any wrangler command |
| **Framework preset** | **None** or **Static** | Next.js (Workers), OpenNext |

3. **Environment variables:** `NODE_VERSION` = `20`
4. **Save** → **Deployments** → **Retry deployment**

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
