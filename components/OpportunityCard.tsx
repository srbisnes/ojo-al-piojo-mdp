"use client";

import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { clsx } from "clsx";
import type { PropiedadConAnalisis, AlertaIA } from "@/types";

interface OpportunityCardProps {
  propiedad: PropiedadConAnalisis;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

const alertaStyles: Record<
  AlertaIA,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  "Oportunidad Única": {
    bg: "bg-emerald-500/15 border-emerald-500/30",
    text: "text-emerald-400",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  "Precio de Mercado": {
    bg: "bg-sky-500/15 border-sky-500/30",
    text: "text-sky-400",
    icon: <DollarSign className="h-3.5 w-3.5" />,
  },
  Sobreprecio: {
    bg: "bg-amber-500/15 border-amber-500/30",
    text: "text-amber-400",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? "from-emerald-500 to-teal-400"
      : score >= 6
        ? "from-sky-500 to-cyan-400"
        : score >= 4
          ? "from-amber-500 to-orange-400"
          : "from-rose-500 to-red-400";

  return (
    <div
      className={clsx(
        "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg",
        color
      )}
    >
      {score}
    </div>
  );
}

export function OpportunityCard({
  propiedad,
  onSelect,
  isSelected,
}: OpportunityCardProps) {
  const analisis = propiedad.analisis;
  const alerta = analisis?.alerta ?? "Precio de Mercado";
  const styles = alertaStyles[alerta];

  return (
    <article
      onClick={() => onSelect?.(propiedad.id)}
      className={clsx(
        "group cursor-pointer rounded-2xl border bg-slate-900/80 p-4 transition-all hover:border-slate-600 hover:bg-slate-900",
        isSelected
          ? "border-sky-500/60 ring-2 ring-sky-500/20"
          : "border-slate-800"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                styles.bg,
                styles.text
              )}
            >
              {styles.icon}
              {alerta}
            </span>
          </div>
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
            {propiedad.titulo}
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3" />
            {propiedad.barrio}
          </p>
        </div>
        {analisis && <ScoreBadge score={analisis.score} />}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Maximize2 className="h-3.5 w-3.5" />
          {propiedad.superficie} m²
        </span>
        <span className="flex items-center gap-1">
          <Bed className="h-3.5 w-3.5" />
          {propiedad.dormitorios}
        </span>
        <span className="flex items-center gap-1">
          <Bath className="h-3.5 w-3.5" />
          {propiedad.banos}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-white">
            USD {propiedad.precio.toLocaleString("es-AR")}
          </p>
          <p className="text-xs text-slate-500">
            USD {propiedad.precioM2.toLocaleString("es-AR")}/m²
          </p>
        </div>
        {analisis && (
          <div className="text-right">
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-sm font-semibold">
                {analisis.rentabilidadEstimada.toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500">ROI anual est.</p>
          </div>
        )}
      </div>

      {analisis?.resumen && (
        <p className="mt-3 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {analisis.resumen}
        </p>
      )}
    </article>
  );
}
