# Jocki website

A dependency-free, responsive public website for **Jocki**, served at **https://jocki.app**. The illustration switches between notes, tasks and data. Release discovery reads actual assets from `jocki-app/jocki`; before the first release it links to the source and releases page. Requests require no secret and use a five-minute session cache.

Run `npm run build`, `npm test`, and `npm run preview`. All assets are local. Theme selection respects system settings and supports an explicit toggle.

## Hosting

The Pages workflow builds and checks each push. Set repository variable `PAGES_ENABLED=true` and select GitHub Actions as the Pages source to deploy. Configure `jocki.app` as the Pages custom domain; `CNAME` also records it in the static output. DNS and certificate provisioning must be configured in the domain account. See [GitHub's domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Licensed under GPL-3.0-only.
