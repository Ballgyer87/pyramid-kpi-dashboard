/* ============================================================================
   middleware.js — puts a username/password prompt in front of the whole site.
   Runs on Vercel's free tier (Edge Middleware), no paid plan needed.

   The actual username/password are NOT stored here — they live as Environment
   Variables in your Vercel project settings (DASHBOARD_USER / DASHBOARD_PASSWORD),
   so they're never committed to GitHub or visible in this code.
   ============================================================================ */

export default function middleware(request) {
  const authHeader = request.headers.get("authorization");
  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASSWORD;

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const separatorIndex = decoded.indexOf(":");
      const suppliedUser = decoded.slice(0, separatorIndex);
      const suppliedPass = decoded.slice(separatorIndex + 1);
      if (suppliedUser === user && suppliedPass === pass) {
        return; // credentials OK, let the request through
      }
    }
  }

  return new Response("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Pyramid Food Service KPI Dashboard"' },
  });
}
