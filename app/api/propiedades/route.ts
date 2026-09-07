import { NextResponse } from "next/server";

const PROPIEDADES = [
  { id: "mdp-001", titulo: "Depto 2 amb frente al mar - Güemes", precio: 145000, superficie: 68, barrio: "Güemes", tipoAlquiler: "mixto", dormitorios: 1, banos: 1, lat: -38.0012, lng: -57.5418, precioM2: 2132, descripcion: "Excelente ubicación en Güemes", fechaPublicacion: "2026-02-15" },
  { id: "mdp-002", titulo: "Casa 3 dorm con jardín - Playa Grande", precio: 285000, superficie: 145, barrio: "Playa Grande", tipoAlquiler: "temporario", dormitorios: 3, banos: 2, lat: -38.0185, lng: -57.5342, precioM2: 1966, descripcion: "Casa cerca de Playa Grande", fechaPublicacion: "2026-01-28" },
  { id: "mdp-003", titulo: "Monoambiente reciclado - Chauvin", precio: 78000, superficie: 42, barrio: "Chauvin", tipoAlquiler: "tradicional", dormitorios: 0, banos: 1, lat: -37.9921, lng: -57.5589, precioM2: 1857, descripcion: "Unidad reciclada en barrio emergente", fechaPublicacion: "2026-03-01" },
  { id: "mdp-004", titulo: "Penthouse 4 amb - Los Troncos", precio: 420000, superficie: 180, barrio: "Los Troncos", tipoAlquiler: "temporario", dormitorios: 3, banos: 3, lat: -38.0098, lng: -57.5485, precioM2: 2333, descripcion: "Unidad premium con vista al mar", fechaPublicacion: "2026-02-05" },
  { id: "mdp-005", titulo: "Depto 2 amb céntrico - Centro", precio: 95000, superficie: 55, barrio: "Centro", tipoAlquiler: "tradicional", dormitorios: 1, banos: 1, lat: -37.9995, lng: -57.5462, precioM2: 1727, descripcion: "Ubicación céntrica", fechaPublicacion: "2026-01-12" },
  { id: "mdp-006", titulo: "Duplex 3 amb - La Perla", precio: 175000, superficie: 95, barrio: "La Perla", tipoAlquiler: "mixto", dormitorios: 2, banos: 2, lat: -38.0045, lng: -57.5368, precioM2: 1842, descripcion: "Duplex a pasos de la playa", fechaPublicacion: "2026-02-20" },
  { id: "mdp-007", titulo: "Casa chalet 4 dorm - Punta Mogotes", precio: 310000, superficie: 210, barrio: "Punta Mogotes", tipoAlquiler: "temporario", dormitorios: 4, banos: 3, lat: -38.0285, lng: -57.5280, precioM2: 1476, descripcion: "Chalet cerca del faro", fechaPublicacion: "2026-01-08" },
  { id: "mdp-008", titulo: "Studio premium - Stella Maris", precio: 112000, superficie: 48, barrio: "Stella Maris", tipoAlquiler: "mixto", dormitorios: 0, banos: 1, lat: -38.0120, lng: -57.5510, precioM2: 2333, descripcion: "Studio moderno con amenities", fechaPublicacion: "2026-03-05" },
];

function analizar(p: (typeof PROPIEDADES)[0]) {
  const promedios: Record<string, number> = {
    Güemes: 1850, "Playa Grande": 2100, Chauvin: 1420, Centro: 1280,
    "La Perla": 1650, "Los Troncos": 1980, "Punta Mogotes": 1750, "Stella Maris": 1900,
  };
  const promedio = promedios[p.barrio] ?? 1600;
  const ratio = p.precioM2 / promedio;
  let alerta: "Oportunidad Única" | "Precio de Mercado" | "Sobreprecio" = "Precio de Mercado";
  let score = 6;
  if (ratio < 0.88) {
    alerta = "Oportunidad Única";
    score = Math.min(10, Math.round(8 + (0.88 - ratio) * 10));
  } else if (ratio > 1.15) {
    alerta = "Sobreprecio";
    score = Math.max(2, Math.round(5 - (ratio - 1.15) * 8));
  }
  const rent =
    p.tipoAlquiler === "temporario" ? 22 : p.tipoAlquiler === "mixto" ? 14 : 7.5;
  return {
    score,
    resumen:
      alerta === "Oportunidad Única"
        ? `Precio por debajo del promedio de ${p.barrio}. Buen potencial de plusvalía y rendimiento en temporada alta.`
        : `Valor alineado con el mercado de ${p.barrio}. Opción sólida según perfil de alquiler.`,
    rentabilidadEstimada: rent,
    rentabilidadTemporaria: 22,
    rentabilidadTradicional: 7.5,
    alerta,
    factores: [p.barrio, p.tipoAlquiler, `Ratio ${(ratio * 100).toFixed(0)}%`],
  };
}

export async function GET() {
  const data = PROPIEDADES.map((p) => ({ ...p, analisis: analizar(p) }));
  return NextResponse.json({
    data,
    meta: { total: data.length, ciudad: "Mar del Plata", actualizado: new Date().toISOString() },
  });
}
