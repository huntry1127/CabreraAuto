# Cabrera inventory connection

Sanity project: `sla6i9i4`. Dataset: `production`.

The website is configured for published Available vehicles. Draft, Sold, and Hidden vehicles are excluded. It reads current inventory on each page visit/refresh; no rebuild is needed for listing updates. Only public vehicle details and photos belong in this dataset.

## Standalone editor

The local Studio lives in `/workspace/sites/studio-cabrera-auto-services`, next to `/workspace/sites/cabrera-auto-services`. It has its own build, source repository, and private deployment. The website’s Owner inventory link opens that deployment. The Studio is not embedded in the website.

The source is also mirrored under `studio-cabrera-auto-services/` in this GitHub repository as a standalone package. Run `npm ci` and `npm run build` inside that folder. The public project ID is included in its config; no API tokens are shipped. Sanity enforces login and project-member edit permissions. Hosted editor access is currently private to Ryan; owner access and invitation will be configured later.

## Remaining permission

The website origin is added to Sanity CORS without credentials. The editor origin needs Allow credentials enabled in Sanity’s API > CORS origins settings before authenticated editing can work. This is pending confirmation. Do not mark setup complete until the editor successfully signs in and saves.

## Finish and verify

1. Add the deployed editor origin to CORS with credentials, after confirmation.
2. Sign in to the editor with the Sanity account that owns this project.
3. Create a clearly identified test-only vehicle, upload a photo, set Available and Publish. Verify it on the autos page, change the price and verify it after refresh, then mark Sold and Publish. Verify it is excluded. Test data must never be presented as actual stock.
4. Deploy the schema with `npx sanity schemas deploy` from the standalone Studio when CLI authentication is available, for Sanity MCP schema discovery. Browser sign-in does not authenticate the CLI. Editing through the Studio uses its registered local schema.
5. Invite the owner and grant access to the private hosted editor when requested. No invitation has been sent.

## Owner workflow

Open Owner inventory and the editor. Create a Vehicle, enter the year, make, model, asking price, and mileage, upload photos, select Available, and Publish. The first photo is the cover. To remove a sold vehicle from the website, set Sold and Publish. Leave incomplete listings Hidden or unpublished.

## Checks

`node --test tests/inventory-source.test.cjs` tests published-only normalization, malformed data, configuration, fetch options, and network errors. The standalone Studio build passes. Live authenticated publishing and uploads are pending the editor permission and sign-in check.
