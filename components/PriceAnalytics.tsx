"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, Calendar, Home } from "lucide-react";
import type { PrecioZona } from "@/types";

const PRECIOS_ZONA: PrecioZona[] = [
  { barrio: "Güemes", precioM2Promedio: 1850, variacionAnual: 12.4, demanda: "alta" },
  { barrio: "Playa Grande", precioM2Promedio: 2100, variacionAnual: 15.1, demanda: "alta" },
  { barrio: "Chauvin", precioM2Promedio: 1420, variacionAnual: 8.7, demanda: "media" },
  { barrio: "Centro", precioM2Promedio: 1280, variacionAnual: 6.2, demanda: "media" },
  { barrio: "La Perla", precioM2Promedio: 1650, variacionAnual: 11.0, demanda: "alta" },
  { barrio: "Los Troncos", precioM2Promedio: 1980, variacionAnual: 13.5, demanda: "alta" },
  { barrio: "Punta Mogotes", precioM2Promedio: 1750, variacionAnual: 10.2, demanda: "media" },
];

const COLORS = [
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#22c55e",
  "#84cc16",
  "#eab308",
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PrecioZona }>;
}) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl">
      <p className="font-semibold text-white">{data.barrio}</p>
      <p className="text-sm text-sky-400">
        USD {data.precioM2Promedio.toLocaleString("es-AR")}/m²
      </p>
      <p className="text-xs text-emerald-400">
        +{data.variacionAnual}% anual
      </p>
    </div>
  );
};

export function PriceAnalytics() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <Calendar className="h-4 w-4 text-sky-400" />
          Rentabilidad: Temporario vs Tradicional
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-3">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Alquiler Temporario</span>
            </div>
            <p className="text-2xl font-bold text-white">18–28%</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              3 meses verano + fines de semana. Alta ocupación Dic–Mar.
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-sky-500/10 to-cyan-500/5 border border-sky-500/20 p-3">
            <div className="flex items-center gap-1.5 text-sky-400 mb-1">
              <Home className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Alquiler 36 meses</span>
            </div>
            <p className="text-2xl font-bold text-white">6–9%</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Contrato tradicional. Flujo estable, menor upside estacional.
            </p>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
          En MDP el temporario (Airbnb / Booking) suele duplicar o triplicar el
          ROI del alquiler tradicional gracias a la estacionalidad turística
          de diciembre a marzo.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">
          Valor promedio del m² por zona
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={PRECIOS_ZONA}
              margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="barrio"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
              <Bar dataKey="precioM2Promedio" radius={[6, 6, 0, 0]}>
                {PRECIOS_ZONA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
