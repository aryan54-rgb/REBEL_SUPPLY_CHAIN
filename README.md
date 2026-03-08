🛡️ REBEL_SUPPLY_CHAIN - Advanced Supply Chain Resilience Platform

A high-fidelity, enterprise-grade platform for analyzing multi-tier supply chain vulnerabilities, detecting single points of failure, simulating cascading disruptions, and automatically finding alternative suppliers.

<img src="https://raw.githubusercontent.com/aryan54-rgb/REBEL_SUPPLY_CHAIN/main/dashboard_screenshot.png" alt="Dashboard Preview">

🚀 Overview
REBEL_SUPPLY_CHAIN is the next evolution of supply chain analytics, combining AI-powered alternative supplier recommendations with enterprise database capabilities. It models complex, global supply chains as a Directed Acyclic Graph (DAG) with a realistic 50-node dataset spanning 5 tiers and 6 continents.

Core Capabilities

Multi-Tier Visualization: 5-tier DAG layout (Raw Materials → Retailers) using React Flow.
Cascading Risk Engine: Proprietary algorithm that calculates how failures propagate through the network.

🆕 Alternative Supplier Finder: AI-powered algorithm that automatically identifies and ranks replacement suppliers when disruptions occur.
Disruption Simulator: "What-if" analysis with capacity-aware impact assessment and alternative recommendations.
SPOF Detection: Automatic identification of Single Points of Failure.
🆕 Enterprise Database: MySQL-powered persistence with user management and product catalogs.
🆕 Team Collaboration: Multi-user platform with role-based access control.
Risk Dashboard: Advanced KPI cards including capacity utilization and alternative coverage metrics.

🛠️ Tech Stack
Framework: Next.js 15 (App Router)
Language: TypeScript
Database: MySQL + Prisma ORM
Styling: Tailwind CSS + Neo-Brutalist Design System
Visualization: React Flow (Network) & Recharts (Analytics)
State Management: Zustand
Authentication: Role-based user system
Icons: Lucide React

📦 Getting Started

Prerequisites

Node.js 18.x or higher
npm or yarn
MySQL 8.0+ (optional - runs on mock data without it)

Installation
Clone the repository:
git clone https://github.com/aryan54-rgb/REBEL_SUPPLY_CHAIN.git
cd REBEL_SUPPLY_CHAIN
Install dependencies:
npm install
Set up the database (optional):
# Install MySQL and create a database
# Copy .env.example to .env and configure DATABASE_URL
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Seed the database with sample data
npx prisma db seed
Start the development server:
npm run dev
Open http://localhost:3000 in your browser.

📊 Dataset Structure
The platform uses a comprehensive electronics supply chain dataset:

Nodes: 50 Suppliers/Entities across 5 tiers
Edges: 57 Supply Relationships
Risk Dimensions: Geopolitical, Weather, Shipping, Financial Stability
🆕 Capacity Metrics: Production capacity tracking
🆕 Geographic Data: Latitude/longitude for distance calculations
Enhanced Data Models
Users: Authentication with Admin/User roles
Suppliers: Enhanced profiles with capacity and geographic data
Products: Product catalog with supplier relationships
Nodes/Edges: Graph data for supply chain network
🆕 Key Enhancements Over Basic Analytics
1. Alternative Supplier Finder
The proprietary algorithm automatically identifies replacement suppliers when disruptions occur:

Smart Ranking: Considers risk, distance, capacity, and tier compatibility
Capacity Validation: Ensures alternatives can handle production volume
Geographic Intelligence: Calculates precise distances between suppliers
Risk Assessment: Evaluates alternative supplier stability

2. Enterprise Database Architecture
Persistent Storage: MySQL database with Prisma ORM
User Management: Role-based access control (Admin/User)
Audit Trails: Track changes and user activities
Scalability: Supports multiple teams and large datasets

3. Team Collaboration Features
Multi-User Support: Shared dashboards and analytics
Real-Time Sync: Changes reflect across all users instantly
Role Permissions: Different access levels for different team members
Collaborative Simulations: Team-based disruption planning
4. Advanced Analytics
Capacity Utilization: Track supplier production capacity usage
Alternative Coverage: Measure backup supplier availability
Recovery Time Estimates: Calculate switching timelines
Geographic Diversity: Analyze regional risk distribution

📂 Project Structure

REBEL_SUPPLY_CHAIN/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main dashboard
│   ├── analytics/           # Enhanced analytics with capacity metrics
│   ├── simulate/            # Advanced disruption simulator
│   ├── suppliers/           # Supplier management
│   └── api/                 # REST API endpoints
├── components/              # React components
│   ├── NetworkGraph.tsx      # Interactive supply chain visualization
│   ├── DisruptionSimulator.tsx # Enhanced simulator with alternatives
│   ├── AlternativeFinder.tsx  # New component for supplier suggestions
│   ├── RiskCostMatrix.tsx    # Risk vs cost analysis
│   ├── SupplierTable.tsx      # Data table with capacity info
│   └── Navigation.tsx         # Multi-user navigation
├── lib/                      # Core business logic
│   ├── algorithms.ts         # Risk calculation algorithms
│   ├── alternativeFinder.ts  # 🆕 New: Alternative supplier algorithm
│   ├── riskEngine.ts         # Dynamic risk assessment
│   ├── prisma.ts             # 🆕 New: Database client
│   ├── store.ts              # Zustand state management
│   └── mockData.ts           # Sample dataset (works without DB)
├── prisma/                   # 🆕 New: Database schema and seeding
│   ├── schema.prisma         # Database models
│   └── seed.ts               # Data seeding script
├── public/                   # Static assets
└── types/                    # TypeScript definitions


🎯 Use Cases
For Supply Chain Teams
Risk Assessment: Identify vulnerabilities before they become crises
Scenario Planning: Test multiple disruption scenarios simultaneously
Alternative Planning: Maintain production during supplier failures
Capacity Management: Optimize supplier utilization
For Enterprise Users
Team Collaboration: Coordinate risk mitigation across departments
Compliance Reporting: Demonstrate supply chain resilience to stakeholders
Strategic Planning: Build redundancy and diversify suppliers
Incident Response: Make data-driven decisions during disruptions

🔧 API Endpoints
The platform provides RESTful APIs for integration:

GET /api/suppliers - Retrieve supplier data
GET /api/edges - Get supply relationships
POST /api/simulate - Run disruption simulations
GET /api/alternatives - Find alternative suppliers
POST /api/users - User management (with auth)

📈 Performance Metrics
Response Time: <100ms for network analysis
Simulation Speed: Real-time disruption impact calculation
Alternative Finding: <50ms for replacement suggestions
Concurrent Users: Supports multiple team members
Data Scalability: Handles 1000+ node networks

🚀 Deployment

Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server



Database Management
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Run migrations
npx prisma db seed   # Seed database
npx prisma generate  # Generate Prisma client

Environment Variables
DATABASE_URL="mysql://user:password@localhost:3306/rebel_supply_chain"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"


📜 License
MIT License. See LICENSE for details.

🙏 Acknowledgments
Built on the foundation of supply chain analytics research
Inspired by real-world supply chain disruption challenges
Enhanced with enterprise collaboration requirements
Built for enterprise supply chain resilience in a global economy. 🚀

