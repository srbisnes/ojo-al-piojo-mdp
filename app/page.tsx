"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Search, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { OpportunityCard } from "@/components/OpportunityCard";
import { PriceAnalytics } from "@/components/PriceAnalytics";
import type { PropiedadConAnalisis, FiltrosDashboard, BarrioMDP, TipoAlquiler } from "@/types";

const BARRIOS: (BarrioMDP | "todos")[] = ["todos", "Güemes", "Playa Grande", "Chauvin", "Centro", "La Perla", "Los Troncos", "Punta Mogotes", "Stella Maris"];
const TIPOS: (TipoAlquiler | "todos")[] = ["todos", "temporario", "tradicional", "mixto"];
const FILTROS_INICIALES: FiltrosDashboard = { barrio: "todos", precioMin: 0, precioMax: 500000, scoreMin: 0, tipoAlquiler: "todos" };

export default function DashboardPage() {
  const [propiedades, setPropiedades] = useState<PropiedadConAnalisis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosDashboard>(FILTROS_INICIALES);
  const [showFilters, setShowFilters] = useState(false);

  const fetchPropiedades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/propiedades");
      if (!res.ok) throw new Error("Error al cargar propiedades");
      const json = await res.json();
      setPropiedades(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPropiedades(); }, [fetchPropiedades]);

  const filtradas = useMemo(() => {
    return propiedades
      .filter((p) => {
        if (filtros.barrio !== "todos" && p.barrio !== filtros.barrio) return false;
        if (p.precio < filtros.precioMin || p.precio > filtros.precioMax) return false;
        if (filtros.scoreMin > 0 && (p.analisis?.score ?? 0) < filtros.scoreMin) return false;
        if (filtros.tipoAlquiler !== "todos" && p.tipoAlquiler !== filtros.tipoAlquiler) return false;
        return true;
      })
      .sort((a, b) => (b.analisis?.score ?? 0) - (a.analisis?.score ?? 0));
  }, [propiedades, filtros]);

  const oportunidades = filtradas.filter((p) => p.analisis?.alerta === "Oportunidad Única").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard de Oportunidades</h1>
          <p className="mt-1 text-sm text-slate-400">Inteligencia inmobiliaria en tiempo real · Mar del Plata</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800">
            <Filter className="h-4 w-4" /> Filtros
          </button>
          <button onClick={fetchPropiedades} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualizar
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-xs text-slate-500">Propiedades</p><p className="mt-1 text-2xl font-bold text-white">{filtradas.length}</p></div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"><p className="text-xs text-emerald-400/80 flex items-center gap-1"><Sparkles className="h-3 w-3" />Oportunidades</p><p className="mt-1 text-2xl font-bold text-emerald-400">{oportunidades}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-xs text-slate-500">Precio promedio</p><p className="mt-1 text-2xl font-bold text-white">{filtradas.length ? `USD ${Math.round(filtradas.reduce((s, p) => s + p.precio, 0) / filtradas.length).toLocaleString("es-AR")}` : "—"}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-xs text-slate-500">Score IA promedio</p><p className="mt-1 text-2xl font-bold text-sky-400">{filtradas.length ? (filtradas.reduce((s, p) => s + (p.analisis?.score ?? 0), 0) / filtradas.length).toFixed(1) : "—"}</p></div>
      </div>

      {showFilters && (
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Barrio</label>
              <select value={filtros.barrio} onChange={(e) => setFiltros((f) => ({ ...f, barrio: e.target.value as BarrioMDP | "todos" }))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                {BARRIOS.map((b) => <option key={b} value={b}>{b === "todos" ? "Todos los barrios" : b}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Tipo de alquiler</label>
              <select value={filtros.tipoAlquiler} onChange={(e) => setFiltros((f) => ({ ...f, tipoAlquiler: e.target.value as TipoAlquiler | "todos" }))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                {TIPOS.map((t) => <option key={t} value={t}>{t === "todos" ? "Todos" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Precio máx. (USD)</label>
              <input type="number" value={filtros.precioMax} onChange={(e) => setFiltros((f) => ({ ...f, precioMax: Number(e.target.value) || 500000 }))} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Score IA mínimo</label>
              <input type="range" min={0} max={10} step={1} value={filtros.scoreMin} onChange={(e) => setFiltros((f) => ({ ...f, scoreMin: Number(e.target.value) }))} className="w-full accent-sky-500" />
              <p className="mt-1 text-xs text-slate-500 text-center">≥ {filtros.scoreMin}</p>
            </div>
            <div className="flex items-end">
              <button onClick={() => setFiltros(FILTROS_INICIALES)} className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">Limpiar filtros</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 h-[320px] lg:h-[640px] rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-sm text-slate-400">Mapa Mapbox</p>
            <p className="text-xs text-slate-500 mt-1">Configurá NEXT_PUBLIC_MAPBOX_TOKEN en Vercel</p>
            <p className="text-xs text-sky-400 mt-2">{filtradas.length} propiedades en vista</p>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2"><Search className="h-4 w-4 text-sky-400" />Oportunidades ({filtradas.length})</h2>
          {loading ? (
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm text-rose-300">{error}</div>
          ) : filtradas.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-sm text-slate-400">No hay propiedades que coincidan con los filtros.</div>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[640px] pr-1">
              {filtradas.map((p) => (
                <OpportunityCard key={p.id} propiedad={p} isSelected={selectedId === p.id} onSelect={setSelectedId} />
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-3"><PriceAnalytics /></div>
      </div>
    </div>
  );
}
