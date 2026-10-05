# Cabrera vehicle editor

The website supports a Sanity-hosted inventory editor. The implementation is prepared; it is **not connected to a live Sanity project yet**. `owner.html` reports setup required until configured. No fake inventory is published.

## One-time setup

1. Create an owner-controlled project named Cabrera Auto Services at https://www.sanity.io/manage. Use a **public** dataset named `production`. Store only information and vehicle photos intended for public access in this dataset. Published available listings are selected by the website; query filtering is not a privacy boundary for a public dataset. Do not store customer records, paperwork, private VIN documents, or private notes here.
2. Copy the project ID. In `studio`, copy `.env.example` to `.env.local` and fill in the project ID. Use Node 22.12 or newer, run `npm install`, and run `npm run deploy`. Sign in when prompted and choose a Studio hostname. Keep the deployment URL.
3. From the repository root run `node scripts/connect-inventory.mjs PROJECT_ID HTTPS_STUDIO_URL`. The script writes the public website configuration and ignored local Studio environment file. No API token is required or shipped to visitors.
4. In Sanity project API settings, add the **actual website origins** to CORS, without credentials for public inventory queries. Add the hosted Studio origin with credentials if not already registered by deployment. Add development origins only if needed. Do not use wildcard origins.
5. Invite the shop owner as a member with an editor role permitted by the selected Sanity plan. Keep project administration with the business. Review plan limits and costs before choosing any paid plan.
6. Commit the updated `inventory-config.js` and deploy the website using the existing hosting flow. Changes in Sanity then require no site rebuild; autos page loads fresh inventory on each visit/refresh.
7. Verify end-to-end: create a clearly identified test vehicle with a photo, publish it as Available, check the public page, change its price and check again, then set Sold and Publish to remove it from the page. An unpublished draft and a Hidden vehicle must never appear in the page results. Use test-only data and remove it after checking.

## Owner workflow

Bookmark `owner.html` or the hosted Studio URL. Sign in, open All vehicles, create a Vehicle, enter details, upload photos, select Available, and Publish. Changes autosave as drafts; Publish makes them live. The first photo is the cover. To remove a sold vehicle from the website, select Sold and Publish. The record stays in the editor.

## Implementation

- `studio/schemaTypes/vehicle.js`: vehicle form, validation, photos, availability.
- `studio/sanity.config.js`: dedicated inventory navigation (All, Available, Sold, Hidden).
- `inventory-config.js`: public project ID, dataset, API version, and Studio URL.
- `inventory-source.js`: published-only read query; excludes drafts, Hidden and Sold; validates returned records.
- `autos.js`: existing filters and detail dialogs plus loading, retry, and network error states. Configured network failure does not silently show stale manual inventory as current stock.
- `inventory.js`: manual fallback used only while no project is configured.
- `owner.html`: connection status, editor link, and short owner guide. This guide is not an authentication boundary; Sanity enforces editor access.

The public inventory feed intentionally uses direct API reads rather than cached CDN reads, so price and sold-state changes show on refresh. An already open page does not update until refreshed. Unit checks: `node --test tests/inventory-source.test.cjs`. Live authentication, upload and publication need the real project and account setup above.

The GitHub repository serves website files from its root for GitHub Pages. The hosted Sites source checkout keeps those same files under `dist/`. The connection script and tests support both layouts.
