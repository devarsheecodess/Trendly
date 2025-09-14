# OAuth Setup and Environment Variables

This project uses Google OAuth with Passport and issues a JWT stored in an HttpOnly cookie.

Required environment variables (add to your `.env`):

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_REDIRECT_URI` - Callback URI registered in Google Console (e.g. `http://localhost:3000/oauth/user/login/google/callback`)
- `FRONTEND_URL` - Frontend origin (e.g. `http://localhost:5173`)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret to sign JWTs (set to a secure random value in production)
- `EXPRESS_SESSION_SECRET` - (optional) fallback secret
- `NODE_ENV` - `development` or `production`

Local testing notes:
- Run backend: `cd Backend; npm install; node server.js`
- Run frontend: `cd Frontend; npm install; npm run dev`
- Ensure your Google OAuth client has the correct redirect URI configured.
- The backend will set a HttpOnly `token` cookie on successful login; frontend sends `credentials: 'include'` when fetching `/oauth/me` or calling other authenticated endpoints.

Development note about cookies and OAuth:

- Modern browsers require cookies set during cross-site navigations (e.g., Google -> your backend -> browser) to have `SameSite=None` and `Secure` flags. `Secure` requires HTTPS, so on plain `http://localhost` the browser will refuse to set such cookies when the redirect comes from Google.
- This means the ideal, secure flow (backend sets an HttpOnly cookie on the OAuth callback) may not work on `http://localhost` unless you run HTTPS locally or serve frontend and backend from the same origin.

Workarounds for local testing:

- Run both frontend and backend on the same origin (use a proxy or serve frontend assets from the backend) so cookies are same-site.
- Use HTTPS locally (e.g., `mkcert`) so `Secure` cookies are accepted.
- As a last resort for quick local tests only, you can temporarily enable a development-only redirect that includes a short-lived token for the frontend to exchange for a cookie — avoid this in production.

Recommended: set up local HTTPS or proxy the frontend through the backend during development to fully test the secure cookie-based OAuth flow.

Security improvements made:
- No longer include `name`/`email`/`id` in redirect query parameters.
- Backend issues signed JWT in secure, HttpOnly cookie.
- Frontend fetches user info from backend endpoint `/oauth/me` using the cookie.

If you want to use access tokens for Google APIs (e.g., YouTube), store them securely on the backend and associate them with the user model instead of exposing them to the frontend.
