"use client";

import { useCallback, useMemo, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import type { PropiedadConAnalisis } from "@/types";
import { clsx } from "clsx";

const MDP_CENTER = {
  latitude: -38.0055,
  longitude: -57.5426,
  zoom: 12.5,
};

interface MapViewProps {
  propiedades: PropiedadConAnalisis[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function getMarkerColor(score?: number): string {
  if (!score) return "#64748b";
  if (score >= 8) return "#10b981";
  if (score >= 6) return "#0ea5e9";
  if (score >= 4) return "#f59e0b";
  return "#f43f5e";
}

export function MapView({ propiedades, selectedId, onSelect }: MapViewProps) {
  const [viewState, setViewState] = useState(MDP_CENTER);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const selected = useMemo(
    () => propiedades.find((p) => p.id === selectedId),
    [propiedades, selectedId]
  );

  const handleMarkerClick = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect]
  );

  if (!token) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="text-center px-6">
          <MapPin className="mx-auto h-10 w-10 text-slate-600 mb-3" />
          <p className="text-sm text-slate-400">
            Configurá <code className="text-sky-400">NEXT_PUBLIC_MAPBOX_TOKEN</code>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            en tu archivo .env.local para ver el mapa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-800">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={token}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        {propiedades.map((prop) => {
          const isSelected = prop.id === selectedId;
          const color = getMarkerColor(prop.analisis?.score);
          return (
            <Marker
              key={prop.id}
              latitude={prop.lat}
              longitude={prop.lng}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(prop.id);
              }}
            >
              <div
                className={clsx(
                  "cursor-pointer transition-transform",
                  isSelected && "scale-125"
                )}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full shadow-lg border-2 border-white/20"
                  style={{ backgroundColor: color }}
                >
                  <MapPin className="h-4 w-4 text-white" fill="white" />
                </div>
              </div>
            </Marker>
          );
        })}

        {selected && (
          <Popup
            latitude={selected.lat}
            longitude={selected.lng}
            anchor="top"
            onClose={() => onSelect(null)}
            closeOnClick={false}
            offset={15}
          >
            <div className="min-w-[180px]">
              <p className="font-semibold text-sm text-white leading-tight">
                {selected.titulo}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{selected.barrio}</p>
              <p className="text-sm font-bold text-sky-400 mt-1.5">
                USD {selected.precio.toLocaleString("es-AR")}
              </p>
              {selected.analisis && (
                <p className="text-xs text-emerald-400 mt-0.5">
                  Score IA: {selected.analisis.score}/10 · ROI{" "}
                  {selected.analisis.rentabilidadEstimada.toFixed(1)}%
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
