# Parivaar Photography

## GitHub Pages

The `main` branch deploys the static website to `https://ctrlcreate94-ship-it.github.io/Website/` using GitHub Actions. The Pages build omits `admin.html` because the admin interface requires the Node API and Nextcloud credentials. The gallery shows its built-in portfolio images on Pages; images published through the admin API require the Ubuntu deployment below.

## Portfolio admin

The admin page browses images in a configured Nextcloud folder and copies selected images into a persistent public-media directory. The website reads the published image catalog from the API. Nextcloud credentials are only used by the Node server and must never be added to frontend code.

### Configure on Ubuntu

1. Install a supported Node.js LTS release and run `npm ci` in the website directory.
2. Copy `.env.example` to `.env`. Set `NEXTCLOUD_URL` to the account's WebDAV URL, typically `https://cloud.example.com/remote.php/dav/files/USERNAME/`. Create a Nextcloud app password and set `NEXTCLOUD_APP_PASSWORD` to it. Use a dedicated Nextcloud account with access only to the photo folder where possible.
3. Set `NEXTCLOUD_SOURCE_PATH` to the folder as it appears inside that account, for example `/Photos/Website`. Set a unique `ADMIN_USERNAME` and strong `ADMIN_PASSWORD`. Generate `SESSION_SECRET` with `openssl rand -hex 32`.
4. Set `PUBLISHED_DIR` and `PORTFOLIO_FILE` to persistent locations writable by the Node service. Back up these files; they contain published photos and the gallery catalog.
5. Start the API with `npm run start:api`. It binds only to `127.0.0.1:3001`. Serve the static `dist` output using the existing web server and proxy `/api/` and `/media/` to the API.

### Nginx proxy example

Add these locations to the HTTPS site configuration. Keep port `3001` private; do not expose it directly to the internet.

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /media/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
}
```

Build the site with `npm run build`, point the web server's document root at `dist`, and keep the API running with a systemd service or another process manager. The admin page is `/admin.html`. In local development, run `npm run start:api` and `npm run dev` in separate terminals; Vite proxies `/api` and `/media` to the local API.

Only JPEG, PNG, WebP, GIF, and AVIF images up to 30 MB can be published. Publishing copies a selected image from Nextcloud into the persistent public directory; the copy is publicly viewable, while the Nextcloud source folder remains private.

## Contact form email

The contact form posts to `/api/contact` on the Node API. The API sends the message through Resend to `photography@parivaar.co.za`; the Resend API key stays on the server. GitHub Pages cannot run the Node API, so the Ubuntu API must be publicly reachable over HTTPS and reverse proxy `/api/` to port `3001`. Configure `RESEND_API_KEY` and a verified sender address in the server's `.env`, then configure the GitHub Actions repository variable `VITE_CONTACT_API_URL` to the API base URL ending in `/api` (for example `https://api.example.co.za/api`). Set `CONTACT_ALLOWED_ORIGIN` to the exact website origin, without a path. Never put the Resend API key in a `VITE_` variable or frontend file.

Before production sending, add and verify `parivaar.co.za` in Resend and publish the DNS records Resend provides. Use a sender address on the verified domain, such as `website@parivaar.co.za`, and keep the visitor's address in Reply-To.
