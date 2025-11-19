# Obsidian Circuit

A lightweight cyber‑triage web app that combines WalletConnect identity, PCAP/networklog analysis, decentralized storage (IPFS), and a small analytics layer. 


---

## Quick summary

Obsidian Circuit helps investigators collect and analyze network artifacts (PCAPs, logs), link them to identities via WalletConnect, and optionally anchor/capture evidence on decentralized storage. The UI is React-based; backend is Node.js/Express with a few analysis scripts in the `server` folder. 

---

## What’s in the repo 

```
~/Obsidian-Circuit/
├── client/
│   ├── public/
│   └── src/
│       ├── contracts/
│       │   ├── contract.js
│       │   └── ipfsContract.sol
│       └── pages/
│           ├── Dashboard.js
│           ├── FileAnalysis.js
│           ├── GeneratePdf.js
│           ├── History.js
│           ├── LogAnalysis.js
│           ├── Login.js
│           ├── NetworkAnalysis.js
│           ├── form.js
│           └── system.js
│       ├── styling/
│       ├── App.js
│       └── index.js
├── models/
│   └── User.js          ← Mongoose schema (name, email, password)
├── server/
│   ├── uploads/         ← file upload destination (multer)
│   ├── MetaData.py
│   ├── analyze_pcap.py
│   ├── parse_logs.py
│   └── server.js        ← Express server handling uploads + pcap parsing
└── README.md            ← (you are viewing this file)
```

---

## What each part does

### `client/`

* React UI with pages used for triage: `Login`, `Dashboard`, `FileAnalysis`, `NetworkAnalysis`, `LogAnalysis`, `History`, etc.
* `client/src/contracts/` contains a JS helper and a Solidity contract stub (`ipfsContract.sol`) — looks like the client has the contract artifacts and/or contract interaction code.

### `server/`

* `server/server.js` is an Express app that uses `multer` to accept uploads (PCAPs) into `server/uploads/` and then parses them with `pcap-parser`.
* The server exposes a POST endpoint for analysis (e.g. `/api/analyze-network`) and returns `networkLogs` and `suspiciousActivity` from the PCAP.
* Python scripts in `server/` (`analyze_pcap.py`, `parse_logs.py`, `MetaData.py`) appear to be supplementary analysis tools that can be used offline or invoked from the server.

### `models/User.js`

* Simple Mongoose schema with `name`, `email` (unique), and `password` fields, timestamps enabled.
* This indicates the app stores users in MongoDB.

---

## Key implementation details (useful if you want to run / modify)

### Backend (server) highlights

* Uses `express`, `multer`, `pcap-parser`, and `cors`.
* Upload path is `~/Obsidian-Circuit/server/uploads/` by default (set in `multer({ dest: 'uploads/' })`).
* The POST route in `server/server.js` accepts `file` and streams it to `pcap-parser` to extract packets. Suspicious packets are collected and returned as JSON.
* Server listens on `http://localhost:1000` (see `app.listen(1000, ...)`).

### Database

* `models/User.js` uses `mongoose`. You will need a running MongoDB (local or remote) and a `MONGO_URI` environment variable if you add DB connection code to `server.js`.

### Client

* Pages are located in `client/src/pages/` and implement the UI flows. `client/src/contracts/contract.js` is likely the helper that talks to the on-chain contract or IPFS contract.

### Contracts & IPFS

* There is an `ipfsContract.sol` file (a stub) in `client/src/contracts/`. The project appears to plan anchoring or referencing IPFS hashes on-chain; the actual on-chain integration may be client-side (via `contract.js`) or server-mediated depending on your design.

---

## Environment variables (recommended)

Create a `.env` file in `~/Obsidian-Circuit/server/` with the following (fill values):

```
MONGO_URI=mongodb://localhost:27017/obsidian_circuit
PORT=1000
IPFS_ENDPOINT=https://ipfs.infura.io:5001
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
CONTRACT_ADDRESS=0x... (if you deploy a contract)
```

> Keep secrets out of git (use `.env` and `.gitignore`).

---

## How to install & run (exact paths & commands)

Open a terminal and execute the following from the project root `~/Obsidian-Circuit`.

**1) Start backend**

```bash
# from project root
cd ~/Obsidian-Circuit/server
npm install        # if you haven't installed server deps yet
node server.js     # starts server on http://localhost:1000
```

**2) Start client**

```bash
# in a new terminal
cd ~/Obsidian-Circuit/client
npm install
npm start          # runs react dev server (usually http://localhost:3000)
```

**3) (Optional) Start MongoDB**

```bash
# If you have MongoDB installed locally
sudo systemctl start mongod
# or, on Mac with brew
brew services start mongodb-community
```

**4) Upload & analyze a PCAP (example using curl)**

```bash
curl -F "file=@/path/to/sample.pcap" http://localhost:1000/api/analyze-network
```

---

## Pages — what they likely do (map to code in `client/src/pages`)

* **Login.js** — WalletConnect / credential login flow.
* **Dashboard.js** — Home screen with summary, recent cases, analytics.
* **FileAnalysis.js** — Upload PCAPs / logs and view parsed packet results.
* **NetworkAnalysis.js** — Visualize network activity and suspicious hosts.
* **LogAnalysis.js** — Analyze application/system logs.
* **GeneratePdf.js** — Export case reports to PDF.
* **History.js** — Case history and archived analyses.
* **form.js / system.js** — helper forms or system views used by pages.

---

## Notes & suggestions (small dev checklist)

* Add DB connection and session handling in `server/server.js` (if you want persistent users)
* Move `client/src/contracts/contract.js` into a shared `contracts/` folder if the server will interact with contracts too
* Add endpoint(s) to pin files to IPFS from the server (server-side IPFS pinning) for reliability
* Add basic auth/role-based logic so only authorized users can access certain endpoints
* Add tests for the packet parsing flow (e.g., a small sample pcap input)

---

## Architecture diagram

A visual architectural diagram (PNG) reflecting the project layout and data flow was created/updated. You can view it here on the development machine at:

`/mnt/data/5b10686d-c472-4c89-b92e-dc9a06addc1d.png`

If you want, I can:
• regenerate a polished PNG/SVG with labels for MongoDB, Mongoose (User model), the PCAP analysis flow, and `client/src/pages/*` — or
• produce a dark mode or higher-resolution version.

---

## Contributing

Feel free to open issues or PRs. Small ways to help:
• add tests for `server/analyze` route
• document the contract interaction in `client/src/contracts/contract.js`
• add CI to run unit tests

---

Built for real-world triage — let me know what you want improved next (detailed diagrams, deployment scripts, CI integration, or a condensed README for GitHub display).
