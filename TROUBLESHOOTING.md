# Troubleshooting

Common setup issues and how to fix them.

---

## `npm install` fails with peer dependency errors

**Symptom:**
```
npm ERR! ERESOLVE could not resolve
npm ERR! peer react@"^18.0.0" from some-package
```

**Cause:** npm strict peer dependency resolution with React 19.

**Fix:**
```bash
npm install --legacy-peer-deps
```

Or use the included lockfile:
```bash
npm ci
```

---

## `npm run dev` fails with "Cannot find module"

**Symptom:**
```
Error: Cannot find module '@/lib/demo/calls'
```

**Cause:** TypeScript path aliases not resolved. Next.js handles this automatically, but an outdated `tsconfig.json` or missing `baseUrl` can break it.

**Fix:**
1. Check that `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["src/*"] }`.
2. Restart the dev server: `Ctrl+C`, then `npm run dev`.
3. If using VS Code, reload the window (`Cmd+Shift+P` → "Developer: Reload Window").

---

## Dashboard shows blank screen after clicking "Open Dashboard"

**Symptom:** White screen or infinite spinner.

**Cause:** Usually a client-side JavaScript error in a chart component.

**Fix:**
1. Open browser DevTools → Console.
2. Look for errors from `recharts` or `framer-motion`.
3. If the error is `ResizeObserver loop limit exceeded`, this is a harmless Recharts warning — ignore it.
4. If the error is a React render error, try clearing `.next` cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## `/api/analyze/stream` returns nothing or hangs

**Symptom:** `curl -N http://localhost:3000/api/analyze/stream` hangs indefinitely.

**Cause:** Next.js dev server sometimes buffers SSE responses. The stream is working but buffered.

**Fix:**
1. The stream will complete — just wait 2-3 seconds.
2. For real-time validation, use the browser DevTools Network tab instead of curl. Open the dashboard and watch the `stream` request in the Network tab.
3. In production (`npm run build && npm start`), SSE streaming works correctly without buffering.

---

## `npm test` fails with "Cannot find module '@/lib/..."

**Symptom:**
```
 FAIL  src/lib/__tests__/cache.test.ts
  ● Test suite failed to run
    Cannot find module '@/lib/cache'
```

**Cause:** Jest does not read `tsconfig.json` paths by default.

**Fix:** The project includes `moduleNameMapper` in `jest.config.js`. If it’s missing, add:
```js
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

---

## Docker build fails at `npm ci`

**Symptom:**
```
> [builder 4/4] RUN npm ci:
npm ERR! code EUSAGE
```

**Cause:** `package-lock.json` is out of sync with `package.json`.

**Fix:**
```bash
npm install
```

This regenerates `package-lock.json`. Then retry:
```bash
docker build -t mcp-sales-agent .
```

---

## Environment variables not loading

**Symptom:** API calls return 500 errors or "Missing API key" in logs.

**Cause:** `.env` file was not created, or variables have leading/trailing spaces.

**Fix:**
1. Confirm `.env` exists: `ls -la .env`
2. Check for spaces around `=`:
   ```bash
   # Bad
   OPENAI_API_KEY = sk-...
   # Good
   OPENAI_API_KEY=sk-...
   ```
3. Restart the dev server after editing `.env`.

---

## Prisma errors on `db:push`

**Symptom:**
```
Error: P1001: Can't reach database server
```

**Cause:** `DATABASE_URL` is not set or points to a non-running PostgreSQL instance.

**Fix:**
1. Demo mode does not require a database. Skip `db:push` if you're just exploring.
2. For production, start PostgreSQL:
   ```bash
   docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:16
   ```
3. Update `DATABASE_URL` in `.env` to match.

---

## Still stuck?

Open an issue with:
1. Your Node version (`node -v`)
2. Your OS
3. The full error message (copy-paste, not screenshot)
4. What you’ve already tried from this guide
