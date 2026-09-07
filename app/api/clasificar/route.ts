import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { precio, superficie, barrio, tipoAlquiler } = body;
    if (!precio || !superficie || !barrio) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Intentar Anthropic si hay key
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 500,
            messages: [{
              role: "user",
              content: `Analizá esta propiedad de Mar del Plata y respondé SOLO JSON: {"score":1-10,"resumen":"2 oraciones","rentabilidadEstimada":n,"rentabilidadTemporaria":n,"rentabilidadTradicional":n,"alerta":"Oportunidad Única"|"Precio de Mercado"|"Sobreprecio","factores":[...]}. Datos: USD ${precio}, ${superficie}m2, ${barrio}, ${tipoAlquiler}. Temporario MDP ~18-28% ROI, tradicional ~6-9%.`,
            }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data.content?.[0]?.text ?? "";
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            return NextResponse.json({ data: JSON.parse(match[0]), source: "anthropic" });
          }
        }
      } catch (e) {
        console.error("Anthropic fallback", e);
      }
    }

    // Fallback local
    const precioM2 = precio / superficie;
    const promedios: Record<string, number> = {
      Güemes: 1850, "Playa Grande": 2100, Chauvin: 1420, Centro: 1280,
      "La Perla": 1650, "Los Troncos": 1980, "Punta Mogotes": 1750, "Stella Maris": 1900,
    };
    const promedio = promedios[barrio] ?? 1600;
    const ratio = precioM2 / promedio;
    let alerta = "Precio de Mercado";
    let score = 6;
    if (ratio < 0.88) { alerta = "Oportunidad Única"; score = Math.min(10, 9); }
    else if (ratio > 1.15) { alerta = "Sobreprecio"; score = 3; }
    const rent = tipoAlquiler === "temporario" ? 22 : tipoAlquiler === "mixto" ? 14 : 7.5;

    return NextResponse.json({
      data: {
        score,
        resumen: `Análisis de ${barrio}: ${alerta}. ROI estimado ${rent}% anual considerando estacionalidad de MDP.`,
        rentabilidadEstimada: rent,
        rentabilidadTemporaria: 22,
        rentabilidadTradicional: 7.5,
        alerta,
        factores: [barrio, tipoAlquiler, `USD ${Math.round(precioM2)}/m²`],
      },
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
