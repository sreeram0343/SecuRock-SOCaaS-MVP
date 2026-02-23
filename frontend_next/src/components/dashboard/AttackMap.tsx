
import React from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapProps {
    attacks: Array<{
        source: [number, number]; // [long, lat]
        destination: [number, number];
        value: number;
    }>;
}

const AttackMap: React.FC<MapProps> = ({ attacks }) => {
    return (
        <div className="w-full h-full min-h-[300px] overflow-hidden rounded-xl bg-slate-900/50">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 100,
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#1e293b" // slate-800
                                stroke="#334155" // slate-700
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#334155", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {attacks.map((attack, i) => (
                    <Line
                        key={`line-${i}`}
                        from={attack.source}
                        to={attack.destination}
                        stroke="#ef4444" // red-500
                        strokeWidth={2}
                        strokeLinecap="round"
                        style={{
                            animation: "dash 5s linear infinite",
                        }}
                    />
                ))}
                {attacks.map((attack, i) => (
                    <Marker key={`marker-source-${i}`} coordinates={attack.source}>
                        <circle r={3} fill="#ef4444" stroke="#fff" strokeWidth={1} />
                    </Marker>
                ))}
                {attacks.map((attack, i) => (
                    <Marker key={`marker-dest-${i}`} coordinates={attack.destination}>
                        <circle r={2} fill="#3b82f6" stroke="#fff" strokeWidth={0.5} />
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
};

export default AttackMap;
