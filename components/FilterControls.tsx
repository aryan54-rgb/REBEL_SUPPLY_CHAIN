"use client";

import { useSupplyChainStore } from "@/lib/store";

const REGIONS = [
    "All",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Middle East",
    "Oceania",
    "Central America",
];

export function FilterControls() {
    const {
        nodes,
        selectedRegion,
        selectedManufacturerId,
        radiusKm,
        setRegionFilter,
        setSelectedManufacturer,
        setRadiusKm,
    } = useSupplyChainStore();

    const manufacturers = nodes.filter((n) => n.tier === 2);

    return (
        <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900">Geographic Filters</h3>

            {/* Region Filter */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Region
                </label>
                <select
                    value={selectedRegion}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {REGIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>

            {/* Manufacturer Selector */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                    Manufacturer for Radius Search
                </label>
                <select
                    value={selectedManufacturerId || ""}
                    onChange={(e) =>
                        setSelectedManufacturer(e.target.value === "" ? null : e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">None</option>
                    {manufacturers.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name} ({m.country})
                        </option>
                    ))}
                </select>
            </div>

            {/* Radius Slider */}
            {selectedManufacturerId && (
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                        Radius: {radiusKm} km
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={radiusKm}
                        onChange={(e) => setRadiusKm(parseInt(e.target.value, 10))}
                        className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">0 - 5000 km</div>
                </div>
            )}
        </div>
    );
}
