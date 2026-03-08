"use client";

// ============================================================
// Dashboard Page — 3-panel layout:
//   LEFT: Network Graph (full-height)
//   RIGHT-TOP: Risk/Cost Matrix
//   RIGHT-BOTTOM: Mitigation Panel
// ============================================================

import React from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  Activity,
  Layers,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { useSupplyChainStore } from "@/lib/store";
import { TIER_LABELS, TIER_COLORS } from "@/lib/mockData";
import { FilterControls } from "@/components/FilterControls";
import Navigation from "@/components/Navigation";

const NetworkGraph = dynamic(() => import("@/components/NetworkGraph"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div style={{ fontWeight: 900 }}>Loading graph…</div>
    </div>
  ),
});
const RiskCostMatrix = dynamic(() => import("@/components/RiskCostMatrix"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div style={{ fontWeight: 900 }}>Loading chart…</div>
    </div>
  ),
});
const MitigationPanel = dynamic(() => import("@/components/MitigationPanel"), {
  ssr: false,
});

function StatCard({
  icon,
  label,
  value,
  bg,
  textColor = "#000",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
  textColor?: string;
}) {
  return (
    <div
      className="brutal-card flex items-center gap-3"
      style={{ padding: "8px 14px", background: bg, color: textColor }}
    >
      {icon}
      <div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            opacity: 0.6,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 18,
            fontFamily: "Roboto Mono, monospace",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function TierLegend() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {Object.entries(TIER_LABELS).map(([tier, label]) => (
        <div key={tier} className="flex items-center gap-1">
          <div
            style={{
              width: 12,
              height: 12,
              background: TIER_COLORS[Number(tier)] ?? "#ccc",
              border: "2px solid #000",
            }}
          />
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              fontFamily: "Roboto Mono",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-1">
        <div
          style={{
            width: 12,
            height: 12,
            background: "#FF3333",
            border: "2px solid #000",
          }}
        />
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            fontFamily: "Roboto Mono",
            textTransform: "uppercase",
          }}
        >
          High Risk
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    networkAnalytics,
    selectedRegion,
    selectedManufacturerId,
    radiusKm,
    filteredNodes,
    loadFromApi,
  } = useSupplyChainStore();
  const { totalNodes, avgRisk, highRiskCount, spofCount, dangerousDepCount } =
    networkAnalytics;
  const visibleSuppliers = filteredNodes.length;
  const radiusLabel =
    selectedManufacturerId && radiusKm > 0 ? `${radiusKm} km` : "Off";

  React.useEffect(() => {
    loadFromApi();
  }, [loadFromApi]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "#F5F5F0",
      }}
    >
      <Navigation />

      {/* ── Stats strip ───────────────────────────────────── */}
      <div
        style={{
          borderBottom: "3px solid #000",
          background: "#FFF",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div className="flex gap-3 flex-wrap">
          <StatCard
            icon={<Layers size={18} strokeWidth={3} />}
            label="Suppliers"
            value={totalNodes}
            bg="#FFF"
          />
          <StatCard
            icon={<Activity size={18} strokeWidth={3} />}
            label="Avg Risk"
            value={avgRisk}
            bg="#FFDF00"
          />
          <StatCard
            icon={<AlertTriangle size={18} strokeWidth={3} />}
            label="High Risk"
            value={highRiskCount}
            bg="#FF3333"
            textColor="#FFF"
          />
          <StatCard
            icon={<ShieldCheck size={18} strokeWidth={3} />}
            label="SPOFs"
            value={spofCount}
            bg="#FF2E88"
            textColor="#FFF"
          />
          <StatCard
            icon={<TrendingDown size={18} strokeWidth={3} />}
            label="Dangerous Deps"
            value={dangerousDepCount}
            bg="#9BFF00"
          />
        </div>
        <TierLegend />
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          overflow: "hidden",
        }}
      >
        {/* LEFT: Network Graph (full height) with filter controls */}
        <div
          style={{
            borderRight: "3px solid #000",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px 12px", borderBottom: "2px solid #000", background: "#FFF" }}>
            <FilterControls />
          </div>
          <div
            style={{
              padding: "8px 12px",
              borderBottom: "2px solid #000",
              background: "#FFF8D6",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                opacity: 0.65,
                marginBottom: 4,
              }}
            >
              Filtered Network
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Roboto Mono, monospace",
              }}
            >
              <span>Region = {selectedRegion}</span>
              <span>Radius = {radiusLabel}</span>
              <span>Visible Suppliers = {visibleSuppliers}</span>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <NetworkGraph />
          </div>
        </div>

        {/* RIGHT: Stacked panels */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#FFF",
          }}
        >
          {/* Risk/Cost chart */}
          <div
            style={{
              borderBottom: "3px solid #000",
              height: "45%",
              minHeight: 260,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 12,
                zIndex: 10,
                fontSize: 10,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                opacity: 0.4,
              }}
            >
              Risk vs Cost Matrix
            </div>
            <RiskCostMatrix />
          </div>

          {/* Mitigation panel */}
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                borderBottom: "3px solid #000",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#9BFF00",
              }}
            >
              <ShieldCheck size={14} strokeWidth={3} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Mitigation Recommendations
              </span>
            </div>
            <div style={{ flex: 1, overflow: "hidden", height: "calc(100% - 36px)" }}>
              <MitigationPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
