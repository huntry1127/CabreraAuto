# Cabrera Auto Services search setup

Primary domain: https://cabreraautoservices.com/

## Implemented
- Unique titles and descriptions for the homepage and cars-for-sale page.
- Absolute canonical URLs, Open Graph and Twitter sharing metadata.
- AutoRepair, WebSite and WebPage/CollectionPage structured data. Business address, repair phone, verified Monday–Saturday hours, and visible services are included. Sunday remains by appointment in visible text; no fixed Sunday hours are invented.
- robots.txt permits page and asset crawling, and points to sitemap.xml. The owner page retains noindex and is omitted from the sitemap. This is indexing guidance, not access protection.
- sitemap.xml lists the two public pages. Last-modified dates are omitted rather than implying live inventory is updated on each deployment.
- Local service copy and a JavaScript-disabled contact fallback on the inventory page.

## Launch steps requiring the business accounts
1. In Google Search Console, add a Domain property for cabreraautoservices.com. Copy its exact verification TXT value into GoDaddy DNS. No verification token has been invented or installed.
2. Submit https://cabreraautoservices.com/sitemap.xml. Use URL Inspection on the homepage and inventory page to check the rendered content and request indexing.
3. Validate the public pages in Google Rich Results Test. Local JSON syntax and consistency checks do not substitute for Google's validation.
4. Update the existing Google Business Profile website link, repair phone (773) 413-7713, address, and hours. Preserve separate U-Haul contact information if it exists. Confirm how appointment-only Sunday hours should appear in the profile.
5. Keep business information consistent in existing directories and ask actual customers for honest reviews.

## Inventory search limitation
Cars currently load from Sanity in the browser and detail views use a dialog. The inventory page is the canonical search page; individual cars do not yet have independently indexable detail pages. A future improvement is public vehicle pages with HTML descriptions and matching titles, updated automatically when inventory changes. Do not add inaccurate vehicle Product, price, or review markup.

## Hosting
GitHub Pages uses the repository-root CNAME with cabreraautoservices.com. Preserve it on future updates, keep HTTPS enforced, and retain Sanity CORS access for the apex and www domain. The ChatGPT Site remains a separate publication with canonical metadata referring to the public domain.

## Local search focus
Belmont Cragin and Chicago’s West Side appear naturally in homepage copy, metadata, the location section, a service-area FAQ, inventory copy and structured areaServed data. The shop location remains Belmont Cragin; West Side describes the drivers served, not a second address. No separate neighborhood doorway pages or unverified local claims are added.
