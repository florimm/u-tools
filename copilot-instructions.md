# 🤖 Copilot Instructions for **u-tools**

> This file guides GitHub Copilot (and humans!) to generate code that matches the **u-tools** architecture and conventions.
> u-tools is a web toolbox with a **React + Vite** frontend and a **C# (.NET 8)** backend. Tools are modular and will later connect on a **visual canvas** (like Linux pipes).

---

## 1) Project Goals (What to optimize for)

- **Modularity**: Each tool is self-contained (manifest + UI + backend).
- **Simplicity**: Minimal boilerplate; small, composable utilities.
- **Consistency**: Shared SDK/types and common UI affordances.
- **Canvas-readiness**: Tools must declare typed inputs/outputs to enable future graph wiring.
- **Security**: Validate inputs; rate-limit risky endpoints (e.g., network tools).

---

## 2) Repository Structure (Where things go)

```
u-tools/
├── apps/
│   ├── web/                     # React + Vite frontend
│   └── api/                     # C# .NET backend
├── packages/
│   ├── tool-sdk/                # Shared types, hooks, and manifest schema
│   └── ui/                      # Shared UI components (cards, inputs, toasts)
├── tools/                       # One folder per tool (front+back colocated)
│   ├── converters.unit/
│   │   ├── manifest.json
│   │   ├── frontend.tsx
│   │   └── backend.cs
│   ├── network.ping/
│   │   ├── manifest.json
│   │   ├── frontend.tsx
│   │   └── backend.cs
│   └── dev.json-formatter/
└── README.md
```

**Copilot: When generating code, always place files in the correct folder** under `/tools/<category>.<toolname>/` and **wire them** in `apps/api/Program.cs` and the web tool loader (see §5).

---

## 3) Engineering Conventions

### Frontend (React + Vite + TypeScript)
- Use **functional components**, **hooks**, and **TypeScript**.
- Prefer **react-hook-form** for forms and **Zod** for schema validation.
- State: keep components local; expose shared state via **Redux Toolkit** (if needed by multiple areas).
- Styling: default to **TailwindCSS**. If using styled-components, keep it scoped to the tool.
- Use **fetch** wrappers from `@u-tools/tool-sdk` (e.g., `useToolApi(basePath)`).
- Accessibility: label inputs; use semantic HTML; keyboard-friendly actions.

### Backend (.NET 8)
- Use **Minimal APIs** or **Controllers**; keep endpoints small and cohesive.
- Input validation via **FluentValidation**; return **typed** responses.
- Add **CORS** config to allow the dev frontend origin.
- For streaming tools (future), prefer **SignalR** or raw WebSockets.

### Naming & Style
- Tool folder: `category.toolname` (lowercase, dot-separated).
- Endpoint base path: `/tools/<category>/<toolname>`.
- Types: `PascalCase` in C#, `camelCase` in TS, JSON keys `camelCase`.

---

## 4) Tool Manifest (Schema)

Create `tools/<category>.<toolname>/manifest.json`:

```json
{
  "id": "converters.unit",
  "name": "Unit Converter",
  "version": "1.0.0",
  "category": "Converters",
  "frontend": { "module": "./frontend.tsx" },
  "backend":  { "entry": "./backend.cs", "basePath": "/tools/converters/unit" },
  "io": {
    "inputs": [
      { "name": "value", "type": "number", "required": true },
      { "name": "from",  "type": "string", "enum": ["m","km","ft","mi"], "required": true },
      { "name": "to",    "type": "string", "enum": ["m","km","ft","mi"], "required": true }
    ],
    "outputs": [
      { "name": "result", "type": "number" }
    ]
  },
  "ui": { "icon": "ruler", "tags": ["convert", "units"] }
}
```

**Copilot: Respect IO types** (`io.inputs`/`io.outputs`). These will drive canvas connections later.

---

## 5) Frontend Pattern (Tool UI)

Create `frontend.tsx` with a **minimal, accessible UI** and a **clear action** button.

```tsx
import { useState } from "react";
import { useToolApi } from "@u-tools/tool-sdk";

export default function UnitConverter() {
  const api = useToolApi("/tools/converters/unit");
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  const [result, setResult] = useState<number | null>(null);

  async function convert() {
    const res = await api.post<{ result: number }>("/convert", { value, from, to });
    setResult(res.result);
  }

  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold">Unit Converter</h2>
      <div className="mt-3 grid gap-2 max-w-sm">
        <label className="grid gap-1">
          <span>Value</span>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(+e.target.value)}
            className="input"
          />
        </label>
        <label className="grid gap-1">
          <span>From</span>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="select">
            <option>m</option><option>km</option><option>ft</option><option>mi</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span>To</span>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="select">
            <option>m</option><option>km</option><option>ft</option><option>mi</option>
          </select>
        </label>
        <button onClick={convert} className="btn">Convert</button>
      </div>
      {result !== null && <p className="mt-3">Result: {result}</p>}
    </div>
  );
}
```

**Register tools in the web app**:
```ts
// apps/web/src/tools/index.ts
// Use Vite glob import or a build script to load manifests.
export const TOOL_MANIFESTS = import.meta.glob("../../tools/**/manifest.json", { eager: true });
```

---

## 6) Backend Pattern (Endpoints)

Create `backend.cs` with minimal endpoints under `/tools/<category>/<toolname>`.

```csharp
using Microsoft.AspNetCore.Mvc;

namespace UTools.Tools.Converters.Unit;

public static class Endpoints
{
    public static IEndpointRouteBuilder MapUnitConverter(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/tools/converters/unit");

        group.MapPost("/convert", ([FromBody] ConvertRequest req) =>
        {
            double factor = (req.From, req.To) switch
            {
                ("m","km") => 0.001,
                ("km","m") => 1000,
                ("ft","m") => 0.3048,
                ("m","ft") => 3.28084,
                ("mi","km") => 1.60934,
                ("km","mi") => 0.621371,
                _ => throw new ArgumentException("Unsupported conversion")
            };
            return Results.Ok(new { result = req.Value * factor });
        });

        return app;
    }

    public record ConvertRequest(double Value, string From, string To);
}
```

**Wire in `apps/api/Program.cs`**:
```csharp
using UTools.Tools.Converters.Unit;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
var app = builder.Build();

app.UseCors(p => p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());

app.MapGet("/", () => "u-tools API");
app.MapUnitConverter();

app.Run();
```

---

## 7) Security & Reliability

- **Validate** inputs (FluentValidation or guards).
- **CORS**: Allow-list known origins; never use `*` in prod.
- **Rate-limit** network tools (e.g., ping, DNS) to avoid abuse.
- **Error shape**: `{ error: { code: string, message: string } }`.
- **Logging**: log tool id + endpoint + duration; avoid PII.

---

## 8) Testing

### Frontend
- Use **Vitest** + **@testing-library/react**.
- Write tests for:
  - Rendering and basic interactions
  - API calls mocked via `msw` or fetch mocks
  - Validation logic (Zod/resolvers)

### Backend
- Use **xUnit**.
- Test:
  - Valid inputs → expected outputs
  - Invalid inputs → 400 with helpful message
  - Edge cases and units for pure logic

---

## 9) Commit & PR Conventions

- Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- PR checklist:
  - [ ] Files placed under correct `/tools/<category>.<toolname>/`
  - [ ] Manifest declared with IO types
  - [ ] Frontend uses `useToolApi`
  - [ ] Backend endpoint base path matches manifest
  - [ ] Basic tests included
  - [ ] README snippet for the tool

---

## 10) Canvas (Plan for Future)

- Use **React Flow** for node graph.
- Enforce connections by **matching IO types** from manifests.
- Execution engine:
  - **Batch** (DAG evaluation) and **Stream** (SignalR).
- Persist pipelines as JSON:
```json
{ "nodes": [], "edges": [], "version": "0.1.0" }
```

---

## 11) Prompt Snippets for Copilot Chat

**Create a new tool skeleton**
> Create a tool named `network.ping` under `/tools/network.ping` with manifest, React UI (host input, run button, output area), and a .NET endpoint `/tools/network/ping/run` that returns `{ rttMs: number }`. Wire it in `apps/api/Program.cs` and export the manifest in the frontend loader.

**Add form validation with Zod**
> In the `converters.unit` tool, use Zod to validate that `value` is finite and `from/to` are among `["m","km","ft","mi"]`. Show inline error messages under inputs.

**Implement rate limiting**
> Add a simple in-memory rate limiter for `/tools/network/ping/run` limiting to 10 requests/minute per IP and return 429 with a JSON error when exceeded.

**Stream results (SignalR)**
> Add a SignalR hub `ToolRunHub` that streams logs from long-running tools. Update `network.ping` to emit per-ping results to the client and display them incrementally.

---

## 12) Do / Don’t

**Do**
- Keep tools small and focused.
- Match manifest IO types with UI/endpoint contracts.
- Write minimal tests for new tools.
- Fail fast with clear error messages.

**Don’t**
- Hardcode API URLs; read from `VITE_API_BASE_URL`.
- Expose secrets in client code.
- Break the endpoint base path convention.
- Introduce tight coupling between tools.

---

## 13) Environment Variables

Frontend (`apps/web/.env.local`):
```
VITE_API_BASE_URL=http://localhost:5000
```

Backend (`apps/api/appsettings.Development.json`):
```json
{
  "AllowedHosts": "*",
  "Cors": { "Origins": [ "http://localhost:5173" ] }
}
```

---

*Thanks! Keep u-tools modular and canvas-ready.*
