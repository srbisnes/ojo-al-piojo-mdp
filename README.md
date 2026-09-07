# Ojo al Piojo · Inteligencia Inmobiliaria Mar del Plata

Plataforma MVP de inteligencia inmobiliaria enfocada 100% en **Mar del Plata (Argentina)**.

Permite a inversores e inmobiliarias:

- Visualizar propiedades en un mapa interactivo centrado en MDP
- Clasificar oportunidades mediante IA (score, alerta, ROI estimado)
- Comparar rentabilidad **Alquiler Temporario (verano)** vs **Tradicional 36 meses**
- Gestionar prospectos en un CRM integrado

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** (dark theme SaaS)
- **react-map-gl** + Mapbox
- **Recharts** para analytics
- **lucide-react** iconos
- Serverless API Routes en Vercel
- IA: Anthropic Claude (preferido) o OpenAI (fallback) + algoritmo local

## Arranque rápido

```bash
cd ojo-al-piojo-mdp
npm install
cp .env.example .env.local
# Editar .env.local con NEXT_PUBLIC_MAPBOX_TOKEN y opcionalmente ANTHROPIC_API_KEY
npm run dev
```

## Deploy en Vercel

1. Repo: https://github.com/srbisnes/ojo-al-piojo-mdp
2. Importar en Vercel y agregar env vars
3. Deploy

Hecho con ❤️ para inversores en Mar del Plata.
