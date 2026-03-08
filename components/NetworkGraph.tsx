"use client";

// ============================================================
// NetworkGraph — Enhanced DAG visualization
// Features:
//   - Path highlighting on node selection
//   - Animated edges for selected paths
//   - Disabled node overlay for disruption simulation
//   - Auto-layout by tier (left → right)
// ============================================================

import React, { useCallback, useMemo, useEffect, useState } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    NodeProps,
    Handle,
    Position,
    useNodesState,
    useEdgesState,
    MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useSupplyChainStore } from "@/lib/store";
import { TIER_COLORS, TIER_LABELS } from "@/lib/mockData";

// ── Custom Node Component ──────────────────────────────────
function SupplierNodeComponent({ data, id }: NodeProps) {
    const { selectedNodeId, selectNode, disabledNodeIds, selectedUpstream, selectedDownstream, filteredNodes } =
        useSupplyChainStore();
    const isSelected = selectedNodeId === id;
    const isDisabled = disabledNodeIds.has(id);
    const isInPath =
        selectedNodeId !== null &&
        (selectedUpstream.includes(id) || selectedDownstream.includes(id));

    const isVisible = filteredNodes.some((n) => n.id === id);
    const nodeOpacity = isVisible ? 1 : 0.2;

    const riskScore = data.risk_score as number;
    const tier = data.tier as number;
    const name = data.label as string;
    const costScore = data.cost_score as number;
    const isHighRisk = riskScore > 70;

    const bgColor = isDisabled
        ? "#999"
        : isHighRisk
            ? "#FF3333"
            : (TIER_COLORS[tier] ?? "#FFFFFF");
    const textColor = isDisabled ? "#666" : isHighRisk ? "#FFFFFF" : "#000000";

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                selectNode(isSelected ? null : id);
            }}
            style={{
                background: bgColor,
                color: textColor,
                border: isSelected
                    ? "4px solid #FF2E88"
                    : isInPath
                        ? "4px solid #FFDF00"
                        : "3px solid #000000",
                boxShadow: isSelected
                    ? "6px 6px 0px 0px rgba(255,46,136,0.6)"
                    : isInPath
                        ? "5px 5px 0px 0px rgba(255,223,0,0.5)"
                        : "4px 4px 0px 0px rgba(0,0,0,1)",
                padding: "10px 14px",
                minWidth: 190,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                opacity: nodeOpacity,
                position: "relative",
            }}
            onMouseEnter={(e) => {
                if (!isDisabled) {
                    e.currentTarget.style.transform = "translate(-2px, -2px)";
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    background: "#000",
                    width: 8,
                    height: 8,
                    border: "2px solid #000",
                }}
            />

            {/* Disabled overlay */}
            {isDisabled && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 10,
                    }}
                >
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#FF3333" }}>
                        ✕ OFFLINE
                    </span>
                </div>
            )}

            <div
                style={{
                    fontWeight: 900,
                    fontSize: 12,
                    marginBottom: 4,
                    lineHeight: 1.2,
                }}
            >
                {name}
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                }}
            >
                <span
                    style={{
                        fontSize: 9,
                        fontWeight: 700,
                        background: "#000",
                        color: "#FFF",
                        padding: "1px 5px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {TIER_LABELS[tier] ?? `Tier ${tier}`}
                </span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: "Roboto Mono, monospace",
                        color: textColor,
                    }}
                >
                    R:{riskScore}
                </span>
            </div>
            {/* Cost bar */}
            <div style={{ position: "relative", height: 6, background: "rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.3)" }}>
                <div
                    style={{
                        height: "100%",
                        width: `${costScore}%`,
                        background: isDisabled ? "#666" : "#000",
                    }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 9,
                    fontFamily: "Roboto Mono, monospace",
                    fontWeight: 600,
                    marginTop: 2,
                    opacity: 0.6,
                }}
            >
                <span>Cost: {costScore}</span>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                style={{
                    background: "#000",
                    width: 8,
                    height: 8,
                    border: "2px solid #000",
                }}
            />
        </div>
    );
}

const nodeTypes = { supplier: SupplierNodeComponent };

// ── Layout constants — 5 tiers, left → right ──────────────
const TIER_X: Record<number, number> = { 4: 0, 3: 320, 2: 640, 1: 960, 0: 1280 };

export default function NetworkGraph() {
    const {
        nodes: supplierNodes,
        edges: supplyEdges,
        selectNode,
        selectedNodeId,
        selectedUpstream,
        selectedDownstream,
        disabledNodeIds,
        filteredNodes,
    } = useSupplyChainStore();

    // Create a map of visible node IDs for quick lookup
    const visibleNodeIds = useMemo(() => {
        return new Set(filteredNodes.map((n) => n.id));
    }, [filteredNodes]);

    // Build React Flow nodes
    const initialNodes: Node[] = useMemo(() => {
        const tierCounts: Record<number, number> = {};
        const tierIndices: Record<number, number> = {};
        for (const n of supplierNodes) {
            tierCounts[n.tier] = (tierCounts[n.tier] ?? 0) + 1;
            tierIndices[n.tier] = 0;
        }

        return supplierNodes.map((supplier) => {
            const idx = tierIndices[supplier.tier]!;
            tierIndices[supplier.tier] = idx + 1;
            const count = tierCounts[supplier.tier]!;
            const ySpacing = 150;
            const yOffset = ((count - 1) * ySpacing) / 2;

            return {
                id: supplier.id,
                type: "supplier",
                position: {
                    x: TIER_X[supplier.tier] ?? 0,
                    y: idx * ySpacing - yOffset + 350,
                },
                data: {
                    label: supplier.name,
                    tier: supplier.tier,
                    risk_score: supplier.risk_score,
                    cost_score: supplier.cost_score,
                },
            };
        });
    }, [supplierNodes]);

    // Build React Flow edges with path highlighting
    const flowEdges: Edge[] = useMemo(() => {
        const highlightedPairs = new Set<string>();
        if (selectedNodeId) {
            // Build full path: find edges connecting upstream & downstream to selected
            for (const e of supplyEdges) {
                const srcInPath =
                    e.source === selectedNodeId || selectedUpstream.includes(e.source);
                const tgtInPath =
                    e.target === selectedNodeId || selectedDownstream.includes(e.target);
                const srcIsUpstream = selectedUpstream.includes(e.source);
                const tgtIsSelected = e.target === selectedNodeId;
                const srcIsSelected = e.source === selectedNodeId;
                const tgtIsDownstream = selectedDownstream.includes(e.target);

                if (
                    (srcIsUpstream && tgtIsSelected) ||
                    (srcIsUpstream && selectedUpstream.includes(e.target)) ||
                    (srcIsSelected && tgtIsDownstream) ||
                    (selectedDownstream.includes(e.source) && tgtIsDownstream)
                ) {
                    highlightedPairs.add(`${e.source}-${e.target}`);
                }
            }
        }

        return supplyEdges.map((e, i) => {
            const key = `${e.source}-${e.target}`;
            const isHighlighted = highlightedPairs.has(key);
            const isDisabled =
                disabledNodeIds.has(e.source) || disabledNodeIds.has(e.target);
            const isFiltered = !visibleNodeIds.has(e.source) || !visibleNodeIds.has(e.target);

            return {
                id: `e-${i}`,
                source: e.source,
                target: e.target,
                animated: isHighlighted,
                style: {
                    stroke: isDisabled
                        ? "#ccc"
                        : isHighlighted
                            ? "#FF2E88"
                            : "#000",
                    strokeWidth: isHighlighted ? 3 : 2,
                    strokeDasharray: isDisabled ? "8 4" : undefined,
                    opacity: isFiltered ? 0.2 : isDisabled ? 0.3 : 1,
                },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: isDisabled ? "#ccc" : isHighlighted ? "#FF2E88" : "#000",
                },
                type: "smoothstep",
            };
        });
    }, [supplyEdges, selectedNodeId, selectedUpstream, selectedDownstream, disabledNodeIds, visibleNodeIds]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edgesState, setEdges, onEdgesChange] = useEdgesState(flowEdges);

    // Sync edges when selection or disabled state changes
    useEffect(() => {
        setEdges(flowEdges);
    }, [flowEdges, setEdges]);

    useEffect(() => {
        setNodes(initialNodes);
    }, [initialNodes, setNodes]);

    const onPaneClick = useCallback(() => {
        selectNode(null);
    }, [selectNode]);

    return (
        <div className="w-full h-full" style={{ minHeight: "100%" }}>
            <ReactFlow
                nodes={nodes}
                edges={edgesState}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onPaneClick={onPaneClick}
                fitView
                fitViewOptions={{ padding: 0.15 }}
                minZoom={0.15}
                maxZoom={2.5}
                proOptions={{ hideAttribution: true }}
            >
                <Background gap={20} size={1} color="#ddd" />
                <Controls />
                <MiniMap
                    nodeColor={(n) => {
                        const risk = n.data?.risk_score as number | undefined;
                        const tier = n.data?.tier as number | undefined;
                        if (disabledNodeIds.has(n.id)) return "#999";
                        if (risk && risk > 70) return "#FF3333";
                        return TIER_COLORS[tier ?? 0] ?? "#FFF";
                    }}
                    style={{
                        border: "3px solid #000",
                        boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                    }}
                />
            </ReactFlow>
        </div>
    );
}
