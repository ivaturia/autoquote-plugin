# Auto Quote ChatGPT Plugin

This bundle contains a ChatGPT plugin that proxies to the Auto Quote API described in `openapi.yaml`. The API base (as provided) is:

https://quote-proxy-qmypa0.5sc6y6-3.usa-e2.cloudhub.io/

Files in this folder:

- `ai-plugin.json` - top-level plugin manifest
- `openapi.yaml` - OpenAPI spec referencing the remote proxy
- `.well-known/ai-plugin.json` - discoverable manifest for hosting
- `logo.svg` - small logo used by ChatGPT
- `README.md` - this file

Quick goal: host this folder as static files over HTTPS so ChatGPT can discover the plugin via `/.well-known/ai-plugin.json`.

Prerequisites (Windows PowerShell):

- Python 3 installed and on PATH (for a simple static server)
- ngrok installed (or any HTTPS hosting) and an account if required

Steps (simple, easy):

1. Open PowerShell in this folder:

   cd C:\Users\ivatu\Downloads\chatgpt-plugin

2. Start a simple static file server (Python):

   python -m http.server 3333

   This serves the current folder at http://localhost:3333

3. Expose the folder over HTTPS using ngrok (recommended):

   ngrok http 3333

   Copy the HTTPS forwarding URL (for example: https://abcd-1234.ngrok.io)

4. Register the plugin in ChatGPT:

   - In ChatGPT (web), go to Settings → Beta features → Plugins and enable plugins.
   - In the Plugins section, choose "Install plugin from URL" and enter:

     https://<your-ngrok-domain>/ .well-known/ai-plugin.json

   Example: https://abcd-1234.ngrok.io/.well-known/ai-plugin.json

5. Test the endpoints directly (optional) using PowerShell:

   POST sample (create a quote):

   $body = Get-Content .\sample-requests\quote-request.json -Raw
   Invoke-RestMethod -Uri "https://quote-proxy-qmypa0.5sc6y6-3.usa-e2.cloudhub.io/quotes" -Method Post -Body $body -ContentType "application/json"

   GET sample (retrieve a quote):

   Invoke-RestMethod -Uri "https://quote-proxy-qmypa0.5sc6y6-3.usa-e2.cloudhub.io/quotes/Q123456789" -Method Get

Notes:

- The OpenAPI spec points to the remote proxy URL. If you want ChatGPT to call a local mock server instead, edit `openapi.yaml` server URL to your ngrok HTTPS URL.
- The plugin manifest `ai-plugin.json` points to `./openapi.yaml`. When hosting, the manifest and the OpenAPI file must be reachable from the same domain.

If you'd like, I can also:

- Create a small Node/Express mock server that implements the static responses locally so you can test without the remote proxy.
- Provide `sample-requests/quote-request.json` and a PS1 script to call the endpoints.
This repository already includes a local mock server and sample requests.

Hosting on GitHub (recommended for a simple HTTPS host)
---------------------------------------------

You can publish this plugin via GitHub and GitHub Pages so ChatGPT can discover the plugin from a stable HTTPS URL. These steps assume you have a GitHub account and Git installed locally.

1. Create a new GitHub repository (e.g., `autoquote-plugin`).

2. Prepare the repo locally. From this folder run:

```powershell
git init
git add .
git commit -m "Add ChatGPT plugin bundle"
git branch -M main
git remote add origin https://github.com/<your-username>/autoquote-plugin.git
git push -u origin main
```

3. Enable GitHub Pages (two simple options):

- Option A — Use `docs/` on `main` branch
   - Create a `docs/` directory and copy these plugin files there: `ai-plugin.json`, `openapi.yaml`, `.well-known/ai-plugin.json`, `logo.svg`.
   - Commit and push. In the repo settings → Pages, set Source to `main` branch and `/docs` folder.

- Option B — Use `gh-pages` branch
   - Install the `gh-pages` npm package or push a dedicated branch `gh-pages` with static files and set Pages source to `gh-pages`.

4. After Pages is enabled, you will have a URL like:

    https://<your-username>.github.io/autoquote-plugin/

    The plugin manifest will be accessible at:

    https://<your-username>.github.io/autoquote-plugin/.well-known/ai-plugin.json

5. (Optional) If you want ChatGPT to call the endpoints on your GitHub Pages host (for the mock), you must host the mock backend separately (GitHub Pages serves static files only). Two approaches:

   - Keep `openapi.yaml` server URL pointing at the original proxy (no change). ChatGPT will call the provided proxy.
   - Or host the mock backend on a platform that provides HTTPS API endpoints (for example, Heroku, Render, Fly, or a small VPS). If you host your mock API at e.g., https://my-mock.example.com/, update `openapi.yaml` server URL to that host and re-deploy the OpenAPI file to the Pages `docs/` folder.

Updating `openapi.yaml` server URL for GitHub Pages / custom backend
------------------------------------------------------------------

If you want the OpenAPI spec to point to a different runtime host, edit `openapi.yaml`'s servers block. Example (replace with your Pages or mock URL):

```yaml
servers:
   - url: https://<your-mock-host-or-ngrok>.example.com/
```

Then commit and push the updated `openapi.yaml` to the repo (in `docs/` if using that option). GitHub Pages will serve the updated spec.

Register the plugin in ChatGPT
-----------------------------

Use the GitHub Pages hosted manifest URL when installing the plugin in ChatGPT:

   https://<your-username>.github.io/autoquote-plugin/.well-known/ai-plugin.json

Notes and recommendations
-------------------------
- GitHub Pages serves static files only — you cannot run the mock server there. Use Pages for the plugin manifest and OpenAPI spec, and point the OpenAPI `servers:` URL to a separate HTTPS API host if you want an API under your control.
- If you want a single-host solution (manifest + API), consider deploying the mock server to Render, Fly, or Heroku and serving both manifest and API from the same domain. ChatGPT prefers the manifest and OpenAPI spec be reachable and consistent.

If you want I can:

- Create a `docs/` folder and move the plugin files into it, commit and push to a repo skeleton (you'll need to provide the GitHub repo URL or grant push access).
- Deploy the mock server to Render or another free tier host and update `openapi.yaml` automatically.
