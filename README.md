# Cabrera Auto Services

Responsive static website for Cabrera Auto Services in Chicago.

Open `index.html` in a browser, or serve this directory with any static web server. No build or package installation is required.

The site includes auto repair services, shop photos, mobile navigation, a location map, and a phone-based visit planning dialog. Appointments and estimates are arranged directly with the shop by phone.

The `assets/` directory contains optimized photographs supplied for this website and the favicon.

For GitHub Pages, use the `main` branch and repository root (`/`) as the publishing source in repository settings.

## On-page repair estimator

The homepage calculator accepts a year, make, model, and repair and displays a parts-and-labor range without leaving the page. `estimator-config.js` contains explicitly illustrative parts and labor assumptions; these are not approved Cabrera prices or a vehicle-specific repair database. Vehicle details identify the request and do not alter the sample arithmetic. Visitors can adjust the assumed rate, parts allowance, and labor hours.

Before presenting shop pricing, replace all sample allowances with approved pricing and update the on-page sample labels to accurately describe the data and its limitations. Do not imply vehicle-specific accuracy without an appropriate data source. Taxes, fees, diagnosis, and additional work are excluded.

## Autos for sale

`autos-for-sale.html` includes search, body and budget filters, sorting, and a vehicle-details dialog with a photo gallery. `inventory.js` holds `window.CABRERA_INVENTORY`, currently empty because no actual listings have been supplied. The page shows an honest empty state until records are added.

Vehicle fields: `id`, `year`, `make`, `model`, `trim`, `price` (number or null for call-for-price), `mileage` (number), `body`, `transmission`, `fuel`, `exterior`, `description`, `features` (array of strings), and `images` (array of asset paths or HTTPS URLs). Publish only verified listing information and authorized photographs. Put vehicle photos in `assets/`.
