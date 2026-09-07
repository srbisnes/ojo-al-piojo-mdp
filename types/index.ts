export type BarrioMDP =
  | "Güemes"
  | "Playa Grande"
  | "Chauvin"
  | "Centro"
  | "La Perla"
  | "Los Troncos"
  | "Punta Mogotes"
  | "Stella Maris"
  | "Constitución";

export type TipoAlquiler = "temporario" | "tradicional" | "mixto";

export type AlertaIA = "Oportunidad Única" | "Precio de Mercado" | "Sobreprecio";

export interface Propiedad {
  id: string;
  titulo: string;
  precio: number;
  superficie: number;
  barrio: BarrioMDP;
  tipoAlquiler: TipoAlquiler;
  dormitorios: number;
  banos: number;
  lat: number;
  lng: number;
  imagen?: string;
  descripcion: string;
  precioM2: number;
  fechaPublicacion: string;
}

export interface AnalisisIA {
  score: number;
  resumen: string;
  rentabilidadEstimada: number;
  rentabilidadTemporaria: number;
  rentabilidadTradicional: number;
  alerta: AlertaIA;
  factores: string[];
}

export interface PropiedadConAnalisis extends Propiedad {
  analisis?: AnalisisIA;
}

export interface ClienteCRM {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  presupuestoMin: number;
  presupuestoMax: number;
  barriosPreferidos: BarrioMDP[];
  tipoBusqueda: TipoAlquiler | "inversion";
  notas: string;
  estado: "nuevo" | "contactado" | "interesado" | "cerrado";
  fechaAlta: string;
  propiedadEmparejadaId?: string;
}

export interface PrecioZona {
  barrio: BarrioMDP;
  precioM2Promedio: number;
  variacionAnual: number;
  demanda: "alta" | "media" | "baja";
}

export interface FiltrosDashboard {
  barrio: BarrioMDP | "todos";
  precioMin: number;
  precioMax: number;
  scoreMin: number;
  tipoAlquiler: TipoAlquiler | "todos";
}
