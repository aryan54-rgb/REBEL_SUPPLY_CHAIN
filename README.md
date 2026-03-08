# 🛡️ Supply Chain Resilience & Risk Analyzer

A high-fidelity, production-grade prototype for analyzing multi-tier supply chain vulnerabilities, detecting single points of failure, and simulating cascading disruptions.

![Dashboard Preview](https://raw.githubusercontent.com/aryan54-rgb/TRial/main/dashboard_screenshot.png)

## 🚀 Overview

This application models complex, global supply chains as a Directed Acyclic Graph (DAG). It focuses on the **Electronics Industry** (Laptops, Smartphones) with a realistic 50-node dataset spanning 5 tiers and 6 continents.

### Core Capabilities
*   **Multi-Tier Visualization:** 5-tier DAG layout (Raw Materials → Retailers) using React Flow.
*   **Cascading Risk Engine:** Proprietary algorithm that calculates how a failure at a Tier-4 supplier propagates to Tier-0 retailers.
*   **Disruption Simulator:** "What-if" analysis tool to toggle nodes offline and quantify total network impact (lost edges, orphaned nodes, risk delta).
*   **SPOF Detection:** Automatic identification of Single Points of Failure where a manufacturer relies on a single dependency.
*   **Risk Dashboard:** KPI cards for network-wide health, high-risk node tracking, and dangerous dependency analysis.

## 🛠️ Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Neo-Brutalist Design System
*   **Visualization:** React Flow (Network) & Recharts (Analytics)
*   **State Management:** Zustand
*   **Icons:** Lucide React

## 📦 Getting Started

### Prerequisites
*   Node.js 18.x or higher
*   npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aryan54-rgb/TRial.git
   cd TRial
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) (or 3001) in your browser.

## 📊 Dataset Structure

The project uses a comprehensive electronics dataset:
*   **Nodes:** 50 Suppliers/Entities
*   **Edges:** 57 Supply Relationships
*   **Risk Dimensions:** Geopolitical, Weather, Shipping, and Financial Stability scores.

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (Pages & API)
├── components/           # Custom UI & Visualization components
├── lib/                  # Core algorithms, Store (Zustand), and Data
├── public/               # Static assets
└── types/                # Shared TypeScript definitions
```

## 📜 License

MIT License. See `LICENSE` for details.


