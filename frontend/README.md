# FraudGuard — Deep Learning Credit Card Fraud Detection System

> A hybrid **GraphSAGE + Autoencoder** architecture for real-time, high-precision credit card transaction fraud detection.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Running the Application](#running-the-application)
7. [Environment Variables](#environment-variables)
8. [License](#license)

---

## Project Description

**FraudGuard** is an end-to-end fraud detection platform that combines graph-based relational learning with unsupervised anomaly detection to identify fraudulent credit card transactions with high recall and low false-positive rates.

The system models transactions as nodes in a financial transaction graph, where edges encode shared attributes (e.g., merchant, card BIN, device fingerprint). A **GraphSAGE** encoder learns rich neighbourhood-aware node embeddings, which are then fed into a deep **Autoencoder** that flags anomalies by measuring reconstruction error against a learned distribution of legitimate transactions.

Key capabilities:
- Real-time scoring of incoming transactions via a REST API
- Interactive dashboard for analyst review, case management, and alert triage
- Explainability layer surfacing the top contributing graph features per decision
- Batch re-training pipeline for continuous model improvement

---

## Architecture Overview

```
Raw Transactions
       │
       ▼
┌─────────────────────┐
│  Feature Engineering │  (amount normalisation, velocity features,
│  & Graph Construction│   merchant-card bipartite graph)
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│     GraphSAGE       │  • 3-hop neighbourhood aggregation
│  (Graph Encoder)    │  • Mean / LSTM aggregator variants
│                     │  • 256-dim node embeddings
└─────────┬───────────┘
          │  node embeddings
          ▼
┌─────────────────────┐
│  Deep Autoencoder   │  • Encoder: 256 → 128 → 64 → 32
│  (Anomaly Detector) │  • Decoder: 32  → 64  → 128 → 256
│                     │  • ReLU activations, Dropout (p=0.3)
│                     │  • Trained on legitimate txns only
└─────────┬───────────┘
          │  reconstruction error (MSE)
          ▼
┌─────────────────────┐
│  Threshold Scoring  │  • Percentile-based dynamic threshold
│  & Alert Engine     │  • Confidence score 0–100
└─────────┬───────────┘
          │
          ▼
  FraudGuard Dashboard  (React + TypeScript frontend)
```

### Model Highlights

| Component | Detail |
|---|---|
| Graph encoder | GraphSAGE (Hamilton et al., 2017) — inductive, scales to unseen nodes |
| Anomaly model | Symmetric deep autoencoder — no fraud labels required for training |
| Loss function | Mean Squared Error (MSE) on reconstruction |
| Threshold policy | 95th-percentile MSE on held-out legitimate validation set |
| Inference latency | < 50 ms per transaction (GPU), < 200 ms (CPU) |
| Dataset | IEEE-CIS Fraud Detection / synthetic augmentation |

---

## Tech Stack

**Frontend**
- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tooling)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (component library)
- [Recharts](https://recharts.org/) (data visualisation)
- [React Router v6](https://reactrouter.com/) (client-side routing)

**Model / Backend** *(separate service — see `/Model_Files`)*
- Python 3.11, PyTorch, PyTorch Geometric
- GraphSAGE implementation via `torch_geometric.nn.SAGEConv`
- FastAPI inference server

---

## Project Structure

```
fraud-guard/
├── backend/              # Flask API & trained model weights
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utility functions & API clients
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md             # Root project README
```

---

## Setup & Installation

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Git | 2.x |

### 1 — Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd fraud-guard/frontend
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Configure environment variables

Copy the example env file and fill in the values (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
```

---

## Running the Application

### Development server

```bash
npm run dev
```

The app will be available at `http://localhost:8080` with hot-module replacement enabled.

### Production build

```bash
npm run build
npm run preview   # serve the built output locally
```

### Run tests

```bash
npm test
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the fraud detection inference API | `http://localhost:8000` |
| `VITE_THRESHOLD` | Override reconstruction-error alert threshold (0–1) | `0.95` |

---

## License

This project was developed as part of a university deep learning coursework submission.  
All rights reserved © 2026.
