# Rebel Supply Chain — Supply Chain Resilience & Risk Analyzer

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/aryan54-rgb/REBEL_SUPPLY_CHAIN/tree/main)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://rebel-supply-chain.vercel.app/)

## Overview

Rebel Supply Chain is an interactive analytics platform designed to map, visualize, simulate, and mitigate risks within complex multi-tier global supply chains.

The system focuses on supply chain resilience and risk intelligence, particularly in high-complexity industries like electronics manufacturing. It allows organizations to proactively identify vulnerabilities and simulate disruptions before they impact operations.

The user interface utilizes a striking **Neo-Brutalist design**—featuring bold borders, high contrast, strong typography, and an industrial analytics aesthetic to emphasize clarity and data density.

## Key Features

1️⃣ **Interactive Supply Chain Graph**  
Built with React Flow, featuring a multi-tier DAG layout, real-time graph visualization, color-coded supplier tiers, node risk indicators, and component flow visualization.

2️⃣ **Cascading Risk Engine**  
Uses a DFS-based propagation algorithm to simulate how disruptions cascade through the supply chain (e.g., Lithium mine failure → battery supplier → manufacturer → retailer).

3️⃣ **Disruption Simulation**  
Simulates supplier failures, regional collapses, and production losses to output impacted manufacturers, affected product lines, and updated cascading risk scores.

4️⃣ **Geographic Concentration Analytics**  
Detects supply chain regional dependency. Generates proactive alerts if a high percentage of suppliers (e.g., >40%) are concentrated in a single vulnerable region, helping prevent black-swan disruptions.

5️⃣ **SPOF (Single Point of Failure) Detection**  
Automatically identifies suppliers where a downstream manufacturer depends on exactly one source for a critical component, highlighting high-risk critical nodes.

6️⃣ **Risk vs Cost Intelligence**  
Scatter matrix visualizations allow for the deep analysis of high-risk/low-cost suppliers vs. expensive/safe suppliers to optimize sourcing decisions.

7️⃣ **Chokepoint Detection**  
Detects critical components supplied by very few entities (e.g., Lithium, Silicon, Cobalt) identifying critical upstream supply vulnerabilities.

8️⃣ **Smart Mitigation Engine**  
Provides real-time recommendations such as alternative AI-ranked suppliers, geographic diversification requirements, and safety stock strategies.

9️⃣ **Supplier Submission System**  
Intuitive UI for users to dynamically add new suppliers to the graph. Captures fields like name, type, region, capacity, products, and downstream connections (integrated with Prisma ORM).

## Architecture

The supply chain is modeled as a **Directed Acyclic Graph (DAG)**.
Nodes represent suppliers across 5 structured tiers:

- **Tier 4** — Raw Material Suppliers
- **Tier 3** — Component Suppliers
- **Tier 2** — Manufacturers
- **Tier 1** — Distributors
- **Tier 0** — Retailers

Edges represent active supply relationships. Our current dataset models **~50 suppliers**, **57 supply relationships**, and features global coverage across multiple continents.

## Risk Engine

Our intelligent risk engine continuously assesses nodes using a multi-dimensional weighted formula:

> **Risk Score** = (0.4 × Regional Risk) + (0.3 × Logistics Risk) + (0.2 × Weather Risk) + (0.1 × Base Risk)

## Simulations

When a disruption simulation is triggered (e.g., toggling a node offline), the platform outputs:
- **Impacted Manufacturers**: Who loses parts
- **Affected Product Lines**: Which downstream products halt
- **Cascading Risk Score**: Revised structural risk post-disruption

## Analytics Dashboard

The centralized Analytics Dashboard provides top-down visibility into the entire supply chain network. It tracks key metrics, efficiency ratios, cost-benefit matrices, and highlights exact structural inefficiencies in real-time.

## Smart Mitigation Engine

In response to detected risks or live simulations, the Smart Mitigation Engine automatically generates actionable intelligence:
- **Alternative Suppliers**: Ranked by tier, cost, and risk reduction.
- **Geographic Diversification**: Alerts to expand sourcing out of high-density areas.
- **Safety Stock Strategies**: Recommends inventory buffers for unstable routes.

## Technology Stack

**Frontend**
- Next.js (App Router)
- React Flow
- Recharts
- TypeScript

**State Management**
- Zustand

**Database**
- Prisma ORM
- PostgreSQL

**Design System**
- Neo-Brutalist UI

## Project Structure

```text
REBEL_SUPPLY_CHAIN/
├── app/                      # Next.js App Router (Pages & API)
├── components/               # UI & Neo-Brutalist React Components
├── lib/                      # Core Business Logic & Zustand Store
├── prisma/                   # Prisma Schema & Database Setup
├── public/                   # Static Assets
└── types/                    # TypeScript Type Definitions
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aryan54-rgb/REBEL_SUPPLY_CHAIN.git
   cd REBEL_SUPPLY_CHAIN
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file and add your PostgreSQL database URL.
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/rebel_supply"
   ```

4. **Setup Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Running the Project

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Future Improvements

- **Real-Time API Integrations**: Live weather and geopolitical tracking APIs.
- **AI-Powered Predictive Modeling**: Machine learning to forecast disruptions based on historical trends.
- **Supplier Portal**: A dedicated vendor portal for live capacity updates.
- **Automated Procurement**: Direct integration with ERP systems for automatic PO generation on disruption.

## Why This Project Matters

In an increasingly volatile global market, supply chain disruptions can cost enterprises billions of dollars and halt production lines worldwide. Rebel Supply Chain provides the deep visibility and proactive intelligence required to pivot sourcing strategies instantly, turning supply chain resilience into a competitive advantage.

## Screenshots 

![Dashboard Overview](https://raw.githubusercontent.com/aryan54-rgb/REBEL_SUPPLY_CHAIN/main/dashboard_screenshot.png)
*(Placeholder: Additional screenshots of simulations and risk analytics go here)*
