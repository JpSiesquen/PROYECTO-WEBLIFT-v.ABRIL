# Copilot Instructions — PROYECTO-WEBLIFT-v.ABRIL

## Project type
Static website built with **HTML + CSS + JavaScript** (no backend server).
Uses **Firebase Firestore (client SDK)** only to store contact-form submissions.

## Entry point
- Main entry file: `index.html`

## Run locally
- Open `index.html` in a browser.
- If you hit `file://` limitations (modules/fetch/CORS), use a simple local server (e.g., VS Code Live Server).

## Repository conventions
- **Do not assume** Node/npm, build tools, bundlers, or TypeScript.
- **Do not introduce** frameworks (React/Vue/Angular) or new dependencies unless explicitly requested.
- Keep changes **minimal** and consistent with existing structure and naming.

## Firebase / Firestore safety
- This project uses the **Firebase client SDK** only (never Firebase Admin / service accounts in the repo).
- **Never commit secrets** (tokens, passwords, private keys, service account JSON).
- Treat all client input as untrusted; rely on Firestore rules for enforcement.

## Workflow expectations (when making changes)
1. Explain the plan briefly.
2. List files to be changed.
3. Implement the smallest change that solves the task.
4. Provide steps to verify by opening `index.html` (and any relevant page).