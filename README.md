# 🧰 u-tools (Universal Tools)

## 🤖 Copilot & AI Instructions

This repository includes a `copilot-instruction` file at the root. It provides guidance for GitHub Copilot and other AI coding assistants on coding standards, architectural decisions, and contribution requirements. Please review it before contributing or using AI tools in this repo.

A fast, modular collection of **web tools** — from unit converters and ping to dev utilities — with a future **drag-and-drop canvas** that lets you **connect tools visually** (like Linux pipes, but in your browser).

---

## ✨ Features

- **React + Vite** frontend — fast, modular, and scalable
- **C# (.NET)** backend API — powerful and type-safe
- **Tool-based architecture** — every tool is self-contained (UI + backend)
- **Future Canvas UI** — connect tools to automate workflows visually
- **Realtime execution** — (planned) interactive data flow between tools

---

## 🧱 Architecture

```
u-tools/
├── apps/
│   ├── web/                     # React + Vite frontend
│   └── api/                     # C# .NET backend
├── packages/
│   ├── tool-sdk/                # Shared tool contracts & SDK
│   └── ui/                      # Shared UI components
├── tools/                       # Tool modules (frontend + backend)
│   ├── converters.unit/
│   ├── network.ping/
│   └── dev.json-formatter/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- .NET 8 SDK

### 1️⃣ Clone and Install
```bash
git clone https://github.com/florimm/u-tools.git
cd u-tools
```

### 2️⃣ Install Frontend Dependencies
```bash
cd apps/web
npm install
```

### 3️⃣ Run the API
```bash
cd apps/api
dotnet restore
dotnet run
# Runs on http://localhost:5000
```

### 4️⃣ Run the Web App
```bash
cd apps/web
npm run dev
# Opens http://localhost:5173
```

---

## 🧩 Tool Manifest Example

```json
{
  "id": "converters.unit",
  "name": "Unit Converter",
  "version": "1.0.0",
  "category": "Converters",
  "frontend": { "module": "./frontend.tsx" },
  "backend": { "entry": "./backend.cs", "basePath": "/tools/converters/unit" },
  "io": {
    "inputs": [{ "name": "value", "type": "number" }],
    "outputs": [{ "name": "result", "type": "number" }]
  },
  "ui": { "icon": "ruler", "tags": ["convert", "units"] }
}
```

---

## 🧠 Future Vision

> “Make everyday work easier by connecting small tools together.”

u-tools will let you drag & connect utilities like this:

```
[Ping] → [Filter > 20ms] → [Notifier]
```

Everything runs locally or via the backend API.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: C# (.NET 8), Minimal APIs, FluentValidation
- **Realtime (Planned)**: SignalR / WebSockets
- **Testing**: Vitest, xUnit

---

## 🤝 Contributing

1. Create a new folder under `/tools/<category>.<toolname>`
2. Add:
   - `manifest.json`
   - `frontend.tsx`
   - `backend.cs`
3. Register it in the frontend and backend
4. Test and open a PR 🚀

---

## 🗺️ Roadmap

- [ ] Setup core architecture
- [ ] Add initial tools (Unit Converter, Ping, JSON Formatter)
- [ ] Implement Canvas UI
- [ ] Add tool chaining (visual piping)
- [ ] Add real-time execution support
- [ ] Create tool marketplace

---

## 📜 License

MIT License © 2025 Your Name / Organization

---

## ❤️ Acknowledgements

Inspired by the simplicity of Linux pipes and the flexibility of modern web apps.
u-tools aims to bring the best of both worlds — **developer power and intuitive UI**.
