"use client";

import { useMemo, useState } from "react";
import { Users, Plus, Search, Link2, Mail, Phone, MapPin, DollarSign, CheckCircle2, Clock, XCircle, UserPlus } from "lucide-react";
import { clsx } from "clsx";
import type { ClienteCRM } from "@/types";

const CLIENTES_INICIALES: ClienteCRM[] = [
  { id: "cli-001", nombre: "Martín Rodríguez", email: "martin.r@email.com", telefono: "+54 223 555-1234", presupuestoMin: 100000, presupuestoMax: 180000, barriosPreferidos: ["Güemes", "La Perla"], tipoBusqueda: "temporario", notas: "Busca inversión temporada verano", estado: "interesado", fechaAlta: "2026-02-10" },
  { id: "cli-002", nombre: "Valeria Fernández", email: "valeria.f@email.com", telefono: "+54 223 555-5678", presupuestoMin: 200000, presupuestoMax: 350000, barriosPreferidos: ["Playa Grande", "Los Troncos"], tipoBusqueda: "inversion", notas: "Inversora experimentada", estado: "contactado", fechaAlta: "2026-01-22" },
  { id: "cli-003", nombre: "Carlos Méndez", email: "carlos.m@email.com", telefono: "+54 11 555-9012", presupuestoMin: 70000, presupuestoMax: 110000, barriosPreferidos: ["Chauvin", "Centro"], tipoBusqueda: "tradicional", notas: "Primera inversión", estado: "nuevo", fechaAlta: "2026-03-01" },
  { id: "cli-004", nombre: "Lucía Gómez", email: "lucia.g@email.com", telefono: "+54 223 555-3456", presupuestoMin: 250000, presupuestoMax: 450000, barriosPreferidos: ["Los Troncos", "Punta Mogotes", "Playa Grande"], tipoBusqueda: "temporario", notas: "Busca premium", estado: "interesado", fechaAlta: "2026-02-28", propiedadEmparejadaId: "mdp-004" },
  { id: "cli-005", nombre: "Diego Alvarez", email: "diego.a@email.com", telefono: "+54 223 555-7890", presupuestoMin: 90000, presupuestoMax: 140000, barriosPreferidos: ["Güemes", "Stella Maris"], tipoBusqueda: "mixto", notas: "Flexible temporario/tradicional", estado: "nuevo", fechaAlta: "2026-03-04" },
];

const estadoConfig = {
  nuevo: { label: "Nuevo", icon: UserPlus, className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  contactado: { label: "Contactado", icon: Clock, className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  interesado: { label: "Interesado", icon: CheckCircle2, className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  cerrado: { label: "Cerrado", icon: XCircle, className: "bg-slate-500/15 text-slate-400 border-slate-500/30" },
};

export default function CRMPage() {
  const [clientes, setClientes] = useState<ClienteCRM[]>(CLIENTES_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [toast, setToast] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    return clientes.filter((c) => {
      const matchSearch = c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || c.email.toLowerCase().includes(busqueda.toLowerCase()) || c.barriosPreferidos.some((b) => b.toLowerCase().includes(busqueda.toLowerCase()));
      const matchEstado = filtroEstado === "todos" || c.estado === filtroEstado;
      return matchSearch && matchEstado;
    });
  }, [clientes, busqueda, filtroEstado]);

  const handleEmparejar = (clienteId: string) => {
    setClientes((prev) => prev.map((c) => c.id === clienteId ? { ...c, estado: "interesado" as const, propiedadEmparejadaId: c.propiedadEmparejadaId ?? "mdp-001" } : c));
    setToast("Prospecto emparejado con oportunidad disponible");
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => ({
    total: clientes.length,
    nuevos: clientes.filter((c) => c.estado === "nuevo").length,
    interesados: clientes.filter((c) => c.estado === "interesado").length,
    emparejados: clientes.filter((c) => c.propiedadEmparejadaId).length,
  }), [clientes]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2"><Users className="h-6 w-6 text-sky-400" />CRM de Prospectos</h1>
          <p className="mt-1 text-sm text-slate-400">Gestión de clientes e inversores interesados en Mar del Plata</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400"><Plus className="h-4 w-4" />Nuevo prospecto</button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-xs text-slate-500">Total prospectos</p><p className="mt-1 text-2xl font-bold text-white">{stats.total}</p></div>
        <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4"><p className="text-xs text-sky-400">Nuevos</p><p className="mt-1 text-2xl font-bold text-sky-400">{stats.nuevos}</p></div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4"><p className="text-xs text-emerald-400">Interesados</p><p className="mt-1 text-2xl font-bold text-emerald-400">{stats.interesados}</p></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><p className="text-xs text-slate-500">Emparejados</p><p className="mt-1 text-2xl font-bold text-white">{stats.emparejados}</p></div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Buscar por nombre, email o barrio..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none" />
        </div>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none">
          <option value="todos">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="interesado">Interesado</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-4 py-3 font-medium text-slate-400">Cliente</th>
                <th className="px-4 py-3 font-medium text-slate-400">Presupuesto</th>
                <th className="px-4 py-3 font-medium text-slate-400">Zonas preferidas</th>
                <th className="px-4 py-3 font-medium text-slate-400">Tipo búsqueda</th>
                <th className="px-4 py-3 font-medium text-slate-400">Estado</th>
                <th className="px-4 py-3 font-medium text-slate-400 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtrados.map((cliente) => {
                const est = estadoConfig[cliente.estado];
                const Icon = est.icon;
                return (
                  <tr key={cliente.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-white">{cliente.nombre}</p>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{cliente.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{cliente.telefono}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-slate-300">
                        <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                        <span>{cliente.presupuestoMin.toLocaleString("es-AR")} – {cliente.presupuestoMax.toLocaleString("es-AR")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {cliente.barriosPreferidos.map((b) => (
                          <span key={b} className="inline-flex items-center gap-0.5 rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"><MapPin className="h-2.5 w-2.5" />{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><span className="capitalize text-slate-300">{cliente.tipoBusqueda}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={clsx("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium", est.className)}>
                        <Icon className="h-3 w-3" />{est.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {cliente.propiedadEmparejadaId ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Link2 className="h-3.5 w-3.5" />Emparejado</span>
                      ) : (
                        <button onClick={() => handleEmparejar(cliente.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400 hover:bg-sky-500/20">
                          <Link2 className="h-3.5 w-3.5" />Emparejar con Oportunidad
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && <div className="py-16 text-center text-sm text-slate-500">No se encontraron prospectos con esos criterios.</div>}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 shadow-xl backdrop-blur-sm">{toast}</div>
      )}
    </div>
  );
}
