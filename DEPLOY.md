# Deploy — Suite360 Films

Guia curto para colocar esta landing page em produção. Para o histórico completo de decisões técnicas, ver `PLANEJAMENTO.md`; para o que falta antes do lançamento, ver a seção **GO-LIVE** em `CHECKLIST.md`.

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` (desenvolvimento) ou configure as mesmas variáveis diretamente no painel do provedor de hospedagem (produção):

| Variável                      | Obrigatória?          | Formato                                                 | Efeito se ausente/inválida                                                                                           |
| ----------------------------- | --------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | Sim, antes do go-live | `https://www.seudominio.com`                            | Cai em `http://localhost:3000` (canonical/OG errados em produção — nunca quebra o site, mas não deve ir ao ar assim) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Não (opcional)        | Só dígitos, código do país + DDD (ex.: `5541999999999`) | Todos os CTAs de WhatsApp ficam ausentes/desabilitados com segurança — nenhum link falso                             |
| `NEXT_PUBLIC_GTM_ID`          | Não (opcional)        | `GTM-XXXXXXX`                                           | Nenhum script de analytics carrega, nenhum banner de consentimento aparece                                           |

Todas são variáveis públicas (`NEXT_PUBLIC_*`) — nenhuma delas é um segredo. Nunca adicione uma chave/token privado com esse prefixo.

## 3. Build

```bash
npm run build
```

Rode a partir de um estado limpo (sem `.next/` local) antes de qualquer deploy real, para garantir que o build não depende de nada não commitado.

## 4. Deploy (Vercel)

O projeto é Next.js padrão (App Router), sem `vercel.json` — a configuração nativa da Vercel é suficiente:

1. Importar o repositório no painel da Vercel (ou via `vercel` CLI, se preferir).
2. Configurar as 3 variáveis de ambiente da seção 2 no painel do projeto (Production, e Preview se desejar testar antes).
3. Deploy.

Nenhum passo manual de build/start adicional é necessário — a Vercel detecta `next build`/`next start` automaticamente.

## 5. Validar domínio

- Confirmar que `NEXT_PUBLIC_SITE_URL` aponta para o domínio real e usa `https://`.
- Verificar `/sitemap.xml` e `/robots.txt` no domínio real (devem referenciar o próprio domínio, nunca `localhost`).
- Verificar a tag `<link rel="canonical">` no HTML da home.

## 6. Validar WhatsApp

Com `NEXT_PUBLIC_WHATSAPP_NUMBER` configurado:

- O botão flutuante deve aparecer e abrir uma conversa real no número correto.
- Os CTAs secundários de WhatsApp (Hero, CTA Final) devem aparecer.
- O botão final do diagnóstico deve abrir uma conversa com a mensagem preenchida automaticamente.

Nunca teste com um número real de cliente/terceiro sem autorização — use um número próprio para a validação.

## 7. Validar GTM

Com `NEXT_PUBLIC_GTM_ID` configurado:

- O banner de consentimento deve aparecer no primeiro acesso.
- "Rejeitar" não deve carregar nenhum script do Google Tag Manager.
- "Aceitar" deve carregar o script (verificável nas ferramentas de rede do navegador, procurando por `googletagmanager.com`) e os eventos devem aparecer no modo de pré-visualização do GTM.
- Eventos disponíveis: `cta_click`, `whatsapp_click`, `diagnostic_start`, `diagnostic_step_complete`, `diagnostic_complete`. Sugestão de Key Events no GA4 (configurar na plataforma, não no código): `diagnostic_complete`, `whatsapp_click`.

## 8. QA final

- Percorrer a jornada completa (Hero → Diagnóstico → WhatsApp → FAQ → CTA Final) no domínio real.
- Confirmar ausência de erros no console do navegador.
- Testar em pelo menos um dispositivo mobile real (não apenas emulador).
