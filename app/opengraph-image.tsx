import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Suite360 Films — presença e desempenho local no Google.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagem de compartilhamento gerada por codigo. FASE 13: usa a logo
 * oficial (public/brand/suite360-logo.png, ja corrigida — ver
 * components/layout/Logo.tsx) via data URI, embutida com `fs.readFileSync`
 * (precisa do runtime Node.js, nao Edge — padrao do App Router para
 * `opengraph-image.tsx` quando nao declarado `runtime = "edge"`).
 * Paleta atualizada para a identidade oficial (preto/branco/cinza + azul
 * eletrico); espelha manualmente os tokens de app/globals.css, pois
 * `ImageResponse` roda em runtime isolado (Satori), sem acesso ao CSS da
 * aplicacao — atualizar aqui sempre que os tokens mudarem (PLANEJAMENTO.md,
 * secao 14.10).
 */
export default function Image() {
  const logoBuffer = readFileSync(
    join(process.cwd(), "public/brand/suite360-logo.png"),
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        background: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) exige <img>, nao suporta next/image */}
      <img src={logoSrc} width={420} height={144} alt="" />
      <span style={{ fontSize: 30, fontWeight: 400, color: "#52525b" }}>
        Presença e desempenho local no Google
      </span>
      <div
        style={{
          width: 64,
          height: 4,
          borderRadius: 2,
          background: "#0066ff",
        }}
      />
    </div>,
    { ...size },
  );
}
