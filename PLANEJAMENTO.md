# Planejamento Técnico — Landing Page Suite360 Films

> Documento vivo. Gerado na FASE 00 (Análise, Arquitetura e Planejamento).
> Base: `Playbook_Estrategico_Landing_Page_Suite360_Films_v1_0.pdf`.
> Companion: [CHECKLIST.md](./CHECKLIST.md) — usar para acompanhar a execução etapa por etapa.

---

## 1. Diagnóstico do projeto atual

- Diretório do projeto (`Suite360/`) está **vazio de código**: contém apenas o PDF do playbook estratégico. Não é repositório git ainda.
- Não há `package.json`, dependências, configuração de build, lint ou testes instaladas.
- Não há design system, identidade visual (logo, paleta de cores, tipografia oficial) nem ativos reais (fotos do display NFC, prints do relatório, depoimentos) fornecidos até o momento.
- Conclusão: **projeto greenfield**. Não há dívida técnica, conflito de dependências ou legado a considerar — a arquitetura pode ser definida do zero, otimizada diretamente para os objetivos do playbook (conversão via WhatsApp, performance mobile, SEO leve).
- Ponto de atenção: identidade visual (cores de marca, logo em SVG, fontes oficiais) e ativos reais **ainda não existem** — ver seção 14 (Riscos).

---

## 2. Stack recomendada

| Camada            | Escolha                                             | Justificativa                                                                                                                                                                                                                               |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | **Next.js 14+ (App Router) + TypeScript**           | SSR/SSG nativo → SEO e performance de primeira dobra; otimização de imagem (`next/image`) e fonte (`next/font`) embutidas; deploy trivial (Vercel) com Core Web Vitals monitoráveis; TypeScript reduz bugs no state machine do diagnóstico. |
| Estilo            | **Tailwind CSS**                                    | Utility-first acelera a implementação de um design system consistente (espaçamento, tipografia, cores) sem CSS solto; purga classes não usadas → bundle pequeno; fácil de manter tokens de design centralizados no `tailwind.config`.       |
| Animação          | **Framer Motion (`motion`)**                        | Padrão de mercado para reveal on scroll, transições de etapa do diagnóstico e micro-interações; suporta `whileInView`, `AnimatePresence` (transição entre steps) com custo de bundle aceitável para uma landing page.                       |
| Ícones            | **lucide-react**                                    | Leve, tree-shakeable, cobre os ícones necessários (check, whatsapp genérico, seta, etc.) sem precisar de biblioteca de UI completa.                                                                                                         |
| Formulário/Wizard | **State nativo do React (`useReducer`)**            | O diagnóstico tem só 5 etapas e campos simples (segmento, porte, cidade, nome). Não justifica `react-hook-form`/`zod` — validação simples inline é suficiente e mantém a stack enxuta.                                                      |
| Analytics         | **GA4 via `next/script` + Google Tag Manager**      | Padrão pedido no playbook; Next facilita carregar scripts de forma performática (`strategy="afterInteractive"`).                                                                                                                            |
| Hospedagem/Deploy | **Vercel** (recomendado, a confirmar com o cliente) | Integração nativa com Next.js, preview deployments por etapa/PR — útil já que o projeto será validado fase a fase.                                                                                                                          |

**Não incluir**: bibliotecas de UI prontas (Chakra, MUI, shadcn completo), CMS, backend/API própria, banco de dados. A página é estática/client-side com envio direto para WhatsApp — não há necessidade de servidor de aplicação além do próprio Next.

**Decisão em aberto**: confirmar com o usuário se Next.js é aceitável ou se preferem algo ainda mais simples (Vite + React, ou HTML/CSS/JS puro). Dado os requisitos de SEO, Open Graph, otimização de imagem e Core Web Vitals citados no playbook, Next.js é a recomendação — mas é uma escolha revertível na FASE 01 se o usuário preferir outra rota.

---

## 3. Arquitetura proposta

- **Single-page application server-rendered**: uma única rota (`/`) com todas as seções empilhadas verticalmente, navegação por scroll/âncora. Sem necessidade de roteamento adicional nesta fase.
- **Renderização**: SSG (Static Site Generation) — conteúdo não muda por request, favorece performance e SEO. Sem necessidade de dados dinâmicos de servidor.
- **Client Components isolados**: apenas os componentes que precisam de interatividade (Diagnostic Wizard, WhatsApp floating button, animações de scroll) são `"use client"`. O restante (seções estáticas de conteúdo) permanece Server Component para reduzir JS enviado ao cliente.
- **Máquina de estados do diagnóstico**: `useReducer` com estados `idle → step1 → step2 → step3 → step4 → confirmação → concluído`, permitindo avançar, voltar e validar cada etapa antes de progredir.
- **Geração da mensagem do WhatsApp**: função pura (`lib/whatsapp.ts`) que recebe os dados coletados e retorna a URL `https://wa.me/<numero>?text=<mensagem-encodada>`. Isolada para ser fácil de testar e ajustar o texto sem tocar em componentes de UI.
- **Camada de analytics**: wrapper fino (`lib/analytics.ts`) com função `trackEvent(name, params)` que abstrai `window.gtag`/`dataLayer.push`, para que os componentes não conheçam detalhes de GA4/GTM diretamente (facilita trocar de ferramenta no futuro).
- **Conteúdo centralizado**: textos, listas de segmentos, perguntas do FAQ, etc. ficam em `lib/content.ts` (ou arquivos `.ts` por seção) em vez de hardcoded dentro do JSX — facilita revisão de copy sem mexer em lógica/layout.

---

## 4. Estrutura de pastas

```
suite360-landing/
├─ app/
│  ├─ layout.tsx              # <html>, fontes, metadata base, GTM script
│  ├─ page.tsx                # monta as seções na ordem da jornada
│  ├─ globals.css             # reset + diretivas Tailwind + tokens CSS custom
│  ├─ opengraph-image.tsx     # (fase de SEO) imagem OG gerada/estática
│  └─ favicon.ico
│
├─ components/
│  ├─ layout/
│  │  ├─ Header.tsx
│  │  └─ Footer.tsx
│  ├─ sections/
│  │  ├─ Hero.tsx
│  │  ├─ ProblemSection.tsx
│  │  ├─ DiagnosticSection.tsx        # envolve o Wizard
│  │  ├─ MethodologySection.tsx       # "como analisamos sua empresa"
│  │  ├─ ProcessTimeline.tsx          # "o que acontece depois"
│  │  ├─ SolutionSection.tsx          # otimização completa
│  │  ├─ NfcShowcase.tsx
│  │  ├─ ReportShowcase.tsx
│  │  ├─ PlaybookManual.tsx           # manual de boas práticas
│  │  ├─ SocialProofSection.tsx       # depoimentos/cases/antes-depois (estrutura vazia até termos conteúdo real)
│  │  ├─ FAQSection.tsx
│  │  └─ FinalCTA.tsx
│  ├─ diagnostic/
│  │  ├─ DiagnosticWizard.tsx         # state machine + orquestração
│  │  ├─ ProgressBar.tsx
│  │  ├─ steps/
│  │  │  ├─ StepSegment.tsx
│  │  │  ├─ StepSize.tsx
│  │  │  ├─ StepCity.tsx
│  │  │  ├─ StepCompanyName.tsx
│  │  │  └─ StepConfirmation.tsx
│  │  └─ diagnosticReducer.ts
│  └─ ui/
│     ├─ CTAButton.tsx
│     ├─ SectionHeading.tsx
│     ├─ Container.tsx
│     ├─ Card.tsx
│     ├─ TrustIndicator.tsx
│     ├─ WhatsAppFloatingButton.tsx
│     └─ ScrollReveal.tsx             # wrapper de animação de entrada
│
├─ lib/
│  ├─ content.ts               # textos/listas centralizados (copy do playbook)
│  ├─ whatsapp.ts               # builder da mensagem + link
│  ├─ analytics.ts              # trackEvent() abstraindo GA4/GTM
│  ├─ types.ts                  # tipos do diagnóstico, segmentos, etc.
│  └─ constants.ts              # nomes de eventos, segmentos, portes, etc.
│
├─ public/
│  ├─ images/                   # ativos reais (a receber)
│  └─ icons/
│
├─ next.config.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
├─ PLANEJAMENTO.md
└─ CHECKLIST.md
```

---

## 5. Componentes

Ajustes em relação à lista sugerida no prompt original:

- **Mantidos como sugeridos**: `Header`, `Hero`, `CTAButton`, `TrustIndicator`, `ProblemSection`, `ProgressBar`, `FAQ`, `FinalCTA`, `WhatsAppButton` (renomeado `WhatsAppFloatingButton` para deixar claro que é o botão fixo mobile), `Footer`.
- **`Diagnostic` → dividido em `DiagnosticSection` (apresentação/copy) + `DiagnosticWizard` (lógica/estado) + `steps/*`**: separa conteúdo de marketing da máquina de estados, facilita testar o wizard isoladamente e reaproveitar o padrão de step em outros formulários futuros.
- **`DiagnosticStep` → um componente por etapa (`StepSegment`, `StepSize`, ...)** em vez de um componente genérico parametrizado: as etapas têm inputs diferentes (cards de seleção vs. campo de texto), então um componente único acabaria cheio de condicionais. Trade-off consciente: mais arquivos, porém cada um mais simples e sem lógica ramificada.
- **`MethodologySection` e `ProcessTimeline`**: mantidos separados pois representam blocos de conteúdo distintos no playbook (seção 3 do PDF: "como analisamos" vs "o que acontece depois").
- **`SolutionSection`, `NfcShowcase`, `ReportShowcase`, `PlaybookManual`**: mantidos como seções isoladas — cada uma tem mídia própria (mockups/fotos) e pode evoluir independentemente quando os ativos reais chegarem.
- **`Testimonial` e `CaseStudy` → consolidados em `SocialProofSection`** com sub-blocos internos (`TestimonialCard`, `CaseStudyCard` como componentes menores dentro do arquivo ou pasta `social-proof/`), já que ambos dependem 100% de conteúdo real ainda não fornecido — evita criar 4 arquivos vazios/especulativos antes de saber o formato exato do conteúdo.
- **Novo: `Container` e `SectionHeading`**: não estavam na lista sugerida, mas são necessários para consistência de largura máxima/padding e de padrão título+subtítulo em todas as seções — evita duplicar classes Tailwind em cada seção.
- **Novo: `ScrollReveal`**: wrapper fino sobre Framer Motion (`whileInView`) para padronizar a animação de entrada em todas as seções sem repetir a mesma configuração de `variants` em cada componente.

Princípio geral: componentes de seção = 1 por bloco de conteúdo do playbook (não fragmentar mais que isso); componentes de `ui/` = apenas o que é genuinamente reutilizado em 2+ lugares.

---

## 6. Design System

> **Pendência explícita**: não há logo, paleta de marca ou tipografia oficial da Suite360 Films definida em nenhum material recebido. A proposta abaixo é um ponto de partida **neutro e premium**, a validar/ajustar quando a identidade visual for fornecida.

### Cores

- Base neutra: quase-preto (`#0A0A0B`) para texto/fundo escuro e off-white (`#FAFAF9`) para fundo claro — alto contraste, sensação "cara" pedida no playbook.
- Um único **accent color** (a definir com o cliente — placeholder: azul petróleo ou dourado escuro, compatível com "Films"/tecnologia) usado com moderação: CTAs, ícones de destaque, estados ativos do diagnóstico.
- Escala de cinzas intermediária para bordas discretas e texto secundário (`#71717A`, `#E4E4E7`, etc.).
- Sem gradientes chamativos nem glow — conforme restrição do briefing.

### Tipografia

- Uma família **sans-serif forte** para headlines (peso 600–700) e a mesma família ou uma complementar para corpo de texto (peso 400–500) — via `next/font` (self-hosted, sem FOUC).
- Escala tipográfica modular (ex.: 14/16/18/24/32/48/64px) definida no `tailwind.config`, não em valores soltos por componente.

### Espaçamento e grid

- Sistema de espaçamento em múltiplos de 4px (padrão Tailwind).
- `Container` com `max-width` (~1200px) e padding lateral responsivo (16px mobile → 24/32px desktop).
- Muito espaço em branco entre seções (padding vertical generoso, ex. 80–120px desktop / 48–64px mobile).

### Componentes visuais

- Cards com bordas discretas (`1px solid` em cinza claro) em vez de sombras pesadas; sombra sutil apenas em hover/foco.
- Botões: um estilo primário (accent color, alto contraste) e um secundário (outline/ghost) — ambos com estado de foco visível (acessibilidade).
- Ícones: linha fina, consistente com `lucide-react`.

### Tokens técnicos

- Definidos centralmente em `tailwind.config.ts` (`theme.extend.colors`, `theme.extend.fontSize`, `theme.extend.spacing`) — nunca cores/tamanhos "mágicos" direto no JSX.

---

## 7. Fluxo do diagnóstico

Máquina de estados com 5 etapas + estado de conclusão, espelhando a seção 6 do PDF:

| Etapa | Pergunta                       | Tipo de input                                                                                        | Validação                        |
| ----- | ------------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1     | Qual o segmento da empresa?    | Cards selecionáveis (Barbearia, Pet Shop, Perfumaria, Restaurante, Clínica, Loja, Escritório, Outro) | Obrigatório selecionar 1         |
| 2     | Qual o porte da empresa?       | Cards selecionáveis (Pequena, Média, Grande)                                                         | Obrigatório selecionar 1         |
| 3     | Em qual cidade a empresa está? | Campo de texto simples                                                                               | Não vazio (mínimo de caracteres) |
| 4     | Qual o nome da empresa?        | Campo de texto simples                                                                               | Não vazio                        |
| 5     | Confirmação                    | Resumo dos dados + CTA "Consultar meu diagnóstico gratuito"                                          | —                                |

Regras de UX:

- Barra de progresso real ("Etapa X de 5") sempre visível durante o wizard.
- Botão "Voltar" disponível a partir da etapa 2, sem perder os dados já preenchidos (estado mantido no `useReducer`, não resetado ao voltar).
- Transição entre etapas via `AnimatePresence` (Framer Motion) — curta (200–300ms), sem reload de página.
- Ao concluir, os dados (segmento, porte, cidade, nome) alimentam o `lib/whatsapp.ts` para montar a mensagem final e abrir o link `wa.me`.
- Diagnóstico deve ser acessível: navegável por teclado, cada etapa anunciada corretamente para leitores de tela (ex. `aria-live` na barra de progresso), labels associadas aos inputs.
- Estado "vazio"/erro: se o usuário tentar avançar sem preencher, mostrar feedback inline (não bloquear silenciosamente).

---

## 8. Estratégia de conversão

- Dois caminhos paralelos e não-competitivos, conforme playbook: **WhatsApp imediato** (botão fixo mobile + CTA secundário no Hero) para quem já decidiu, e **Diagnóstico interativo** para quem precisa de um motivo para conversar.
- CTAs contextuais por seção (textos variando conforme o playbook: "Quero meu diagnóstico gratuito", "Quero descobrir como minha empresa aparece no Google", "Falar com um especialista", "Quero entender as oportunidades do meu perfil") em vez de repetir sempre o mesmo texto — todos centralizados em `lib/content.ts` para facilitar teste A/B.
- Estrutura preparada (não implementada nesta fase) para os testes A/B prioritários do playbook: variações de headline de CTA, ordem diagnóstico-vs-explicação, hero com/sem prova visual, botão WhatsApp fixo vs. contextual. Isso implica manter os textos de CTA e a ordem de seções fáceis de trocar via config, não hardcoded em múltiplos lugares.
- FAQ cobrindo as 4 objeções do playbook, posicionado antes do CTA final para reduzir fricção de última hora.
- Nenhuma promessa de "primeiro lugar no Google" em nenhum texto — todo copy relacionado a resultado usa linguagem de relevância/completude/confiança, conforme regra do briefing.

---

## 9. WhatsApp (planejamento, sem implementação definitiva)

- Função pura `buildWhatsAppMessage(data: DiagnosticData): string` em `lib/whatsapp.ts`, que interpola nome, segmento e cidade no template:
  `"Olá! Vim pela página da Suite360 e quero receber meu Diagnóstico Gratuito do Perfil da Empresa no Google. Minha empresa é [NOME], do segmento [SEGMENTO], em [CIDADE]."`
- Função `buildWhatsAppLink(message: string, phoneNumber: string): string` retornando `https://wa.me/<numero>?text=<encodeURIComponent(message)>`.
- **Número de WhatsApp real ainda não fornecido** — usar placeholder configurável via variável de ambiente (`NEXT_PUBLIC_WHATSAPP_NUMBER`) para trocar facilmente sem redeploy de código.
- Dois pontos de disparo: (1) botão de WhatsApp direto (sem dados do diagnóstico, mensagem genérica) e (2) CTA final do diagnóstico (mensagem com dados coletados).
- Cada clique dispara evento de analytics antes/junto da navegação (ver seção 12).
- Abrir em nova aba (`target="_blank"`) para não perder o estado da landing page.

---

## 10. SEO + Acessibilidade

**SEO**

- `metadata` do Next.js (`app/layout.tsx` / `page.tsx`): `title`, `description`, `openGraph` (título, descrição, imagem), `twitter card`.
- Heading semântico único (`h1` no Hero = headline aprovada), `h2` para título de cada seção, sem pular níveis.
- `alt` text descritivo em todas as imagens reais (mockups, fotos do NFC, relatório) — nunca `alt=""` em imagem informativa.
- `sitemap.xml` e `robots.txt` básicos (Next gera facilmente via `app/sitemap.ts` / `app/robots.ts`), mesmo sendo página de tráfego pago — custo baixo, benefício de indexação orgânica futura.
- Não inflar a página com texto apenas para SEO, conforme restrição do briefing.

**Acessibilidade**

- Contraste mínimo AA (WCAG) entre texto e fundo, validado nas cores do design system.
- Todos os elementos interativos com estado de `:focus-visible` claro (não remover outline sem substituir).
- Diagnóstico e formulário: labels associadas via `htmlFor`/`id`, mensagens de erro associadas via `aria-describedby`.
- Navegação 100% por teclado (Tab/Shift+Tab/Enter/Espaço) incluindo o wizard do diagnóstico.
- Respeitar `prefers-reduced-motion` — desativar/reduzir animações para usuários que pedirem isso no SO.

**LGPD (ponto adicional, Brasil)**: como a página coletará dados (nome da empresa, cidade, segmento) e usará GA4/GTM, será necessário um **aviso de privacidade/consentimento de cookies** simples no rodapé — não estava explícito no playbook, mas é uma obrigação legal no Brasil. Sinalizado também na seção de riscos.

---

## 11. Performance

- Imagens: `next/image` com formatos AVIF/WebP automáticos, `sizes` corretos por breakpoint, `loading="lazy"` abaixo da primeira dobra (padrão do Next para imagens fora da viewport inicial).
- Fontes: `next/font` (self-hosted, `display: swap`), carregando só os pesos realmente usados.
- JS mínimo: seções de conteúdo estático como Server Components (zero JS enviado); só Diagnostic Wizard, WhatsApp floating button e wrappers de animação são client-side.
- Framer Motion: usar apenas as features necessárias (evitar importar a lib inteira sem necessidade — `motion/react` com imports pontuais).
- Sem parallax pesado, sem vídeo autoplay pesado — conforme restrição do briefing.
- Meta de referência: Core Web Vitals "Good" (LCP < 2.5s, CLS < 0.1, INP < 200ms) em mobile 4G simulado — a validar com Lighthouse/PageSpeed Insights antes do go-live.

---

## 12. Analytics

Abstração única `trackEvent(eventName, params?)` em `lib/analytics.ts`, usada por todos os componentes — nenhum componente chama `window.gtag`/`dataLayer` diretamente.

Eventos planejados (nomes em `snake_case`, consistentes com convenção do GA4):

| Evento                       | Disparado quando                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `whatsapp_click`             | Clique em qualquer botão de WhatsApp (direto ou floating), com parâmetro `source` (`hero`, `floating`, `final_cta`, etc.) |
| `diagnostic_start`           | Usuário inicia a etapa 1 do diagnóstico                                                                                   |
| `diagnostic_step_advance`    | Avanço de cada etapa, com parâmetro `step_number`                                                                         |
| `diagnostic_complete`        | Usuário chega à etapa de confirmação                                                                                      |
| `diagnostic_whatsapp_submit` | CTA final do diagnóstico abre o WhatsApp com dados preenchidos                                                            |

- Integração via Google Tag Manager (container único carregado no `layout.tsx`), com GA4 configurado dentro do GTM (não hardcoded como gtag.js direto), para facilitar ajustes futuros sem novo deploy.
- UTMs nos anúncios: apenas capturados e propagados (ex. anexados como parâmetros extras no evento ou guardados em `sessionStorage` para incluir no diagnóstico), não é responsabilidade da landing gerenciar campanhas.
- **IDs reais do GA4/GTM ainda não fornecidos** — usar variáveis de ambiente (`NEXT_PUBLIC_GTM_ID`) como placeholder.

---

## 13. Dependências

Lista mínima planejada (a instalar na FASE 01, nenhuma instalada agora):

| Pacote                                      | Tipo          | Motivo                            |
| ------------------------------------------- | ------------- | --------------------------------- |
| `next`                                      | dependency    | Framework                         |
| `react`, `react-dom`                        | dependency    | Base do Next                      |
| `typescript`, `@types/react`, `@types/node` | devDependency | Tipagem                           |
| `tailwindcss`, `postcss`, `autoprefixer`    | devDependency | Estilo                            |
| `motion` (Framer Motion)                    | dependency    | Animações                         |
| `lucide-react`                              | dependency    | Ícones                            |
| `eslint`, `eslint-config-next`              | devDependency | Lint padrão Next                  |
| `prettier` + `prettier-plugin-tailwindcss`  | devDependency | Formatação consistente de classes |

Explicitamente **fora do escopo** por ora: bibliotecas de formulário (`react-hook-form`, `zod`), UI kits prontos, CMS headless, bibliotecas de carrossel/slider (avaliar apenas se a seção de provas sociais precisar, e só quando houver conteúdo real suficiente para justificar).

---

## 14. Riscos e pontos de atenção

Itens que precisam de decisão/insumo do usuário antes ou durante as próximas fases:

1. **Identidade visual ausente**: sem logo, paleta de cores oficial ou tipografia da marca. A proposta da seção 6 é um placeholder premium neutro — precisa validação ou substituição.
2. **Ativos reais inexistentes**: fotos do display NFC, páginas do relatório em PDF, depoimentos, logos de clientes/parceiros — nenhum foi fornecido. As seções correspondentes (`NfcShowcase`, `ReportShowcase`, `SocialProofSection`) serão construídas com **estrutura pronta para receber conteúdo**, usando placeholders visuais neutros (nunca dados fictícios apresentados como reais, conforme regra de ouro do playbook).
3. **Número de WhatsApp e horário de atendimento**: não informado — necessário antes de ativar o botão em produção.
4. **IDs de GA4/GTM**: não informados — necessário antes do go-live para medir campanhas.
5. **LGPD/consentimento de cookies**: não mencionado no playbook, mas legalmente necessário no Brasil ao usar GA4/GTM e coletar dados no formulário — recomendo incluir um aviso simples de privacidade/cookies no rodapé; a confirmar com o usuário se há política de privacidade já redigida ou se deve ser criada.
6. **Hospedagem/domínio**: Vercel é a recomendação técnica, mas depende de onde o domínio da Suite360 Films será apontado — a confirmar.
7. **Confirmação da stack**: Next.js é a recomendação, mas é uma decisão reversível — validar antes da FASE 01, pois trocar depois custa retrabalho.

---

## 14.1 Decisões técnicas tomadas na FASE 01

Registro de decisões/ajustes feitos durante a implementação, sem alterar as decisões estratégicas já validadas:

- **Node.js não estava instalado na máquina** — instalado Node.js LTS 24.19.0 via `winget` (confirmado com o usuário antes de instalar).
- **Versões efetivas da stack**: Next.js `16.3.4` (App Router) e React `19.2.8` — satisfazem a recomendação "Next.js 14+" do planejamento original.
- **Tailwind CSS v4** (não v3): o `create-next-app` atual já usa Tailwind v4, que **não usa mais `tailwind.config.ts`** — a configuração de tokens (cores, radius, fonte) agora é feita via diretiva `@theme` diretamente em `app/globals.css`. O conteúdo estratégico da seção 6 (Design System) não muda, apenas o arquivo onde os tokens vivem.
- **Tokens de cor implementados como placeholder**: variáveis `--s360-*` em `:root` (background, foreground, surface, border, muted, accent) mapeadas para o namespace do Tailwind via `@theme inline`, exatamente como descrito na seção 6 — aguardando identidade visual oficial para substituição dos valores.
- **Modo escuro automático removido**: o template padrão do Next.js vinha com um `@media (prefers-color-scheme: dark)` alternando cores. Como o playbook não pede dark mode e a referência estética (Framer-like) costuma comprometer-se com um único visual premium, essa alternância automática foi removida nesta fase. Pode ser revisitada depois, se solicitado.
- **Fonte**: mantido apenas **Geist Sans** (via `next/font/google`) como fonte-base provisória — variável, self-hosted, sem FOUC. A fonte `Geist Mono` que vinha por padrão no template foi removida por não haver necessidade de texto monoespaçado na landing (alinhado com "evitar fontes desnecessárias", seção 5).
- **Nome do pacote**: `package.json` usa `"suite360-landing"` (o nome da pasta do projeto, `Suite360`, tem maiúscula e viola as regras de nome de pacote npm — não afeta a pasta em si, apenas o campo interno `name`).
- **Estrutura de diretórios**: pastas `components/{layout,sections,diagnostic/steps,ui}`, `lib/` e `public/{images,icons}` criadas vazias (com `.gitkeep`) — nenhum componente de produto foi criado ainda, conforme escopo da FASE 01.
- **AGENTS.md / CLAUDE.md**: mantidos como o `create-next-app` gerou. `AGENTS.md` é regenerado automaticamente pelo próprio Next.js (`next dev`) e avisa sobre mudanças de API na versão 16 relevantes para agentes de código; `CLAUDE.md` apenas referencia esse arquivo (`@AGENTS.md`). Não são conteúdo do produto.
- **Repositório git**: o diretório ainda não é um repositório git. Não foi inicializado nesta fase por não estar no escopo pedido — recomenda-se fazer isso antes de acumular mais trabalho, mas fica como decisão do usuário.

## 14.2 Decisões técnicas tomadas na FASE 02

- **Conjunto de componentes revisado**: o esboço original da seção 5 (`CTAButton`, `SectionHeading`, `TrustIndicator`) foi substituído por uma base de primitivos mais genérica e reutilizável, seguindo o pedido explícito da FASE 02: `Button`, `Card`, `Input`, `Label`, `Badge`, `Divider`, `Progress`, `IconButton`, `Container`, `Section`, `ScrollReveal`. Essa base cobre os mesmos casos de uso futuros (CTA = `Button` variant="primary", indicador de confiança = `Badge`, título de seção = tipografia `h2` direto) com menos componentes especializados. `SectionHeading` e `TrustIndicator` específicos podem ainda surgir nas fases de conteúdo (04+) se a composição direta não for suficiente — decisão adiada para quando houver copy real para validar o padrão.
- **Tokens de cor expandidos e renomeados**: `--s360-muted` (FASE 01, era texto cinza) foi separado em `--s360-muted` (fundo sutil, `#F4F4F5`) e `--s360-muted-foreground` (texto secundário, `#71717A`) para não confundir "cor de fundo" com "cor de texto". `--s360-surface` foi consolidado em `--s360-card`/`--s360-card-foreground`. Novos tokens: `--s360-primary`/`--s360-primary-foreground` (cor de ação principal, mesmo valor placeholder que era `accent` na FASE 01) e `--s360-accent`/`--s360-accent-foreground` passou a ser um tom de destaque suave (`#E9F1F0`), papel distinto de `primary`. Adicionado `--s360-danger`/`--s360-danger-foreground` para estados de erro de formulário (não previsto explicitamente no planejamento original, necessário para o `Input` acessível).
- **Tipografia via `--text-*` do Tailwind v4**: a hierarquia (display/h1/h2/h3/h4/body/small/caption/label) foi implementada como tokens `--text-{nome}` + `--text-{nome}--line-height` (+ `--letter-spacing` onde relevante) em `app/globals.css`, gerando utilitários Tailwind nativos (`text-h1`, `text-body`, etc.) — validado inspecionando o CSS de build (`font-size:clamp(...);line-height:...;letter-spacing:...`). `display`/`h1`/`h2`/`h3` usam `clamp()` para escalar entre mobile e desktop sem quebrar o layout em telas pequenas.
- **Sombras semânticas**: `shadow-subtle`/`shadow-medium`/`shadow-elevated` como tokens próprios (em vez de sobrescrever a escala padrão `shadow-sm/md/lg` do Tailwind), para deixar o uso intencional e evitar a tentação de usar sombras pesadas por padrão.
- **`lib/cn.ts`**: utilitário próprio de merge de classNames (equivalente simplificado a `clsx`) em vez de instalar `clsx`/`tailwind-merge` — os componentes controlam suas próprias variantes e não precisam resolver conflitos de classes Tailwind sobrepostas, então uma função de ~3 linhas resolveu sem dependência nova.
- **`lib/motion.ts`**: variantes de animação (`fadeIn`, `fadeUp`, `scaleIn`) centralizadas para reuso pelo `ScrollReveal` e por futuras seções, em vez de duplicar objetos de variante em cada componente.
- **`Button` é polimórfico** (renderiza `<button>` ou `<a>` conforme a prop `href`) para já suportar CTAs que serão links (ex. `wa.me/...` na FASE 09) sem precisar de um componente separado.
- **Escopo deliberadamente não implementado nesta fase**: `Textarea` (nenhum campo do diagnóstico planejado precisa de texto longo) e estado `loading` no `Button` (nenhum fluxo assíncrono existe ainda que precise dele) — ambos citados como opcionais/"se fizer sentido" na instrução da fase; adiados até haver um caso de uso real.
- **Verificação visual**: Playwright + Chromium instalados via `npx` (cache global do usuário, **não** viraram dependência do projeto) para tirar screenshots reais da página `/dev/design-system` em desktop e mobile, em modo dev e em build de produção. Um aviso de hydration mismatch (`caret-color: transparent` injetado nos `<input>`) apareceu apenas em modo dev, causado pela interação do navegador automatizado/dev overlay com os inputs — confirmado ausente no build de produção (`next start`), portanto não é um defeito do código.

## 14.3 Decisões técnicas tomadas na FASE 03

- **`WhatsAppFloatingButton` removido do escopo desta fase**: a instrução da FASE 03 passou a excluir explicitamente qualquer integração com WhatsApp (diferente do escopo original desta fase no roadmap da seção 15). Adiado para a FASE 09 (ou FASE 04, se fizer sentido antecipar a UI do botão quando o Hero existir) — atualizado em CHECKLIST.md.
- **Header sem navegação e sem CTA**: como nenhuma seção da landing existe ainda e WhatsApp está fora do escopo, um CTA no Header apontaria para lugar nenhum — em vez de usar um `href="#"` de fachada, o Header ficou apenas com a marca. CTA contextual entra quando houver uma seção real para apontar (FASE 04+).
- **Header sticky**: `position: sticky` no topo, fundo sólido (sem glassmorphism/blur) igual ao da página, com borda inferior discreta. Custo zero de JS/performance; mantém a marca visível durante o scroll de uma página que ficará longa nas próximas fases.
- **`Logo` extraído como componente próprio** (`components/layout/Logo.tsx`), usado por `Header` e `Footer`. Wordmark tipográfico ("Suite360" + "Films" em peso/tamanho menor) — trocar pelo logo real da marca não vai exigir tocar em `Header`/`Footer`.
- **Footer sem dados institucionais/links legais inventados**: `legalLinks` e `institutionalDetails` existem como arrays tipados vazios dentro de `Footer.tsx` — a seção correspondente só renderiza quando (e se) houver conteúdo real (CNPJ, endereço, páginas de Privacidade/Termos). Optamos por **não** renderizar links `href="#"` de fachada nem texto "em breve" para dado legal, para não parecer um site quebrado/incompleto para um visitante real.
- **Copyright no Footer**: `© {ano atual} Suite360 Films. Todos os direitos reservados.` — ano calculado em build (`new Date().getFullYear()`), não é dado inventado, é um padrão de mercado neutro.
- **`lib/site.ts` + `NEXT_PUBLIC_SITE_URL`**: URL do site centralizada (usada em `metadataBase`, Open Graph, `robots.ts`, `sitemap.ts`), com fallback para `http://localhost:3000`. Domínio real ainda não definido (risco já listado na seção 14, item 6) — trocar exige apenas configurar a variável de ambiente, sem mudar código. Criado `.env.example` documentando a variável (valor de exemplo neutro, `https://www.example.com`, não um domínio real supostamente da Suite360). Ajustado `.gitignore` (`!.env.example`) para que esse arquivo de exemplo continue versionável mesmo com o padrão `.env*` ignorado.
- **Imagem Open Graph gerada por código** (`app/opengraph-image.tsx`, via `next/og`/`ImageResponse`): como não existe nenhum asset de design real, a imagem usa só a marca tipográfica e a frase de posicionamento já aprovada no playbook ("presença e desempenho local no Google") — nada inventado, nenhuma métrica ou cliente fictício.
- **`robots.ts` bloqueia `/dev/`**: a página de demonstração do design system (FASE 02) é explicitamente excluída da indexação, reforçando o `robots: { index: false }` que já existia na própria página.
- **`app/page.tsx` e `app/dev/design-system/page.tsx` perderam sua tag `<main>` própria**: o `RootLayout` agora fornece o único `<main>` da aplicação (envolvendo `<Header>`/`<Footer>`); as páginas passaram a renderizar `<div>`, evitando dois landmarks `<main>` na mesma árvore (erro de estrutura semântica/acessibilidade).
- **Aviso de privacidade/cookies (LGPD) não implementado**: segue como pendência explícita (não é um "esquecimento") — depende de decisão do usuário sobre política de privacidade, listada na seção 14, item 5.

## 14.4 Decisões técnicas tomadas na FASE 04

- **`ScrollReveal` estendido (não substituído)**: adicionados os props `trigger` (`"viewport"` padrão | `"mount"`) e `delay`. O Hero usa `trigger="mount"` porque já está visível no carregamento (não faz sentido depender de `IntersectionObserver` para conteúdo acima da dobra); a `ProblemSection` continua usando o padrão `"viewport"`. Para viabilizar o `delay` por instância, a `transition` saiu de dentro de cada variant em `lib/motion.ts` e passou a ser aplicada explicitamente pelo `ScrollReveal` (`transition={{ ...defaultTransition, delay }}`) — mudança retrocompatível, nenhum uso existente (página `/dev/design-system`) foi afetado.
- **Composição visual do Hero ("HeroVisual")**: diagrama abstrato próprio (três anéis concêntricos + ícone central `ScanSearch` + 5 "satélites") representando as dimensões analisadas do Perfil da Empresa no Google (Localização, Avaliações, Fotos, Categorias, Respostas) — deliberadamente **não** é um mockup/screenshot de nenhuma interface real (nem do Google, nem de dashboard). Essas mesmas 5 dimensões são retomadas como itens de atenção na `ProblemSection`, criando uma continuidade narrativa proposital entre Hero → Problema → (futura) Metodologia/Diagnóstico.
- **Bug de overflow horizontal encontrado e corrigido**: os "satélites" do `HeroVisual` são posicionados por porcentagem (`top`/`left`), mas o pill com ícone+texto tem largura fixa — em containers estreitos (mobile, ~360-430px), os pills nas posições extremas (10%/90%) ultrapassavam a borda da viewport. Corrigido renderizando **apenas o ícone** (chip circular pequeno) abaixo do breakpoint `sm` e o pill completo com label a partir de `sm:` — verificado sem overflow via script de QA (`document.documentElement.scrollWidth` vs `clientWidth`) nos três breakpoints testados (390/820/1440px).
- **CTA secundário do Hero ("Falar com um especialista") implementado como `<button disabled>`**, não como link: como o número real de WhatsApp não existe, um `href="#"` ou link fake geraria uma interação enganosa. `disabled` nativo remove o elemento da ordem de tabulação (não fica um botão "morto" focável) e uma legenda discreta ("disponível em breve") comunica o estado sem inventar nada. Ativar de verdade fica para a FASE 09.
- **Header ganhou CTA** ("Diagnóstico gratuito" → `#diagnostico`, abreviado para "Diagnóstico" abaixo de `sm:` por espaço) — decisão prevista desde a FASE 03 (Header já era `sticky`, aguardando um CTA real para apontar).
- **Ancoragem `#diagnostico`**: usada no CTA principal do Hero e no CTA do Header, mas nenhum elemento com `id="diagnostico"` existe ainda — o link fica inerte (não gera erro, apenas não rola para lugar nenhum) até a FASE 05 criar a seção do Diagnóstico com esse id. Nenhum código extra será necessário nessa hora.
- **Verificação visual — metodologia**: capturas "full-page" do Playwright sem scroll real mostravam o Hero incompleto (elementos com `trigger="mount"` ainda em transição) e a `ProblemSection` totalmente em branco (itens `trigger="viewport"` nunca entraram em "view" sem scroll real, já que a captura full-page do Chromium não dispara `IntersectionObserver` como um scroll de usuário). Corrigido usando um script Playwright que rola a página de verdade antes de capturar — nenhuma mudança de código foi necessária, era um artefato do método de captura, não um bug do site (confirmado comparando com uma captura de viewport único após rolar manualmente até a seção).
- **`playwright` instalado apenas com `npm install --no-save`** para os scripts de QA desta fase (não entrou em `package.json`/`package-lock.json`, confirmado por grep após a instalação) e desinstalado ao final.
- **`.next` corrompido pelo OneDrive**: durante o build, um `EPERM: operation not permitted, unlink` bloqueou a geração — causado por um lock transitório do OneDrive (o projeto vive em `OneDrive\Desktop\Suite360`) sobre um artefato antigo em `.next/static/`. Resolvido apagando `.next` e reconstruindo do zero. Não é um problema do código; fica registrado como fricção conhecida do ambiente (considerar excluir `.next/` da sincronização do OneDrive se o problema se repetir).

## 14.5 Decisões técnicas tomadas na FASE 05

- **Arquitetura de componentes simplificada em relação à sugestão original**: `CityStep`/`CompanyStep` foram unificados em um único `TextFieldStep.tsx` parametrizado (pergunta/label/placeholder/autocomplete via props) — as duas etapas eram, na prática, "uma pergunta + um input", idênticas em estrutura. `ProgressBar` não virou arquivo próprio: é usada uma única vez, então a barra (`Progress` da FASE 02 + texto "Etapa X de 5") ficou inline no `DiagnosticWizard`. Novo componente não previsto originalmente: `OptionCard.tsx`, extraído porque `SegmentStep` e `SizeStep` precisavam do mesmo cartão selecionável.
- **Validação centralizada fora do reducer**: `validateStep(step, data)` é uma função pura exportada por `diagnosticReducer.ts`, mas chamada pelo `DiagnosticWizard` (não pelo próprio reducer) antes de despachar `NEXT`. Isso mantém o reducer livre de efeitos colaterais e permite decidir, com o mesmo resultado da validação, se um evento de analytics deve ser disparado — sem duplicar a lógica de validação em dois lugares.
- **Seleção de Segmento/Porte via "toggle button" (`aria-pressed`)**, não `role="radio"`/roving-tabindex: mais simples de implementar corretamente e já totalmente acessível por teclado (Tab + Enter/Espaço nativos de um `<button>`), que é exatamente o que a FASE 05 pede. O padrão ARIA de radiogroup completo (com navegação por setas) foi considerado e descartado por complexidade não solicitada.
- **Foco gerenciado de forma centralizada**: um único `titleRef` no `DiagnosticWizard` é passado como prop para a etapa ativa, que o anexa ao seu próprio `<h3 tabIndex={-1}>`. Um `useEffect` com guarda de "primeira renderização" move o foco para lá a cada mudança de etapa — mas não no carregamento inicial da seção (evitaria "roubar" o foco de quem apenas rolou a página até o Diagnóstico). Escolhido em vez de autofocar o campo de texto diretamente nas etapas de input, para manter o mesmo comportamento em todos os tipos de etapa (inclusive as baseadas em cards, sem um "campo" natural para focar).
- **Transição sem `mode="wait"` no `AnimatePresence`**: etapas de saída e entrada animam em paralelo (curto, ~180ms) em vez de sequenciadas — além de mais rápido, evita uma condição de corrida em que o `titleRef` da nova etapa só existiria depois do término da animação de saída da etapa anterior.
- **Altura do container animada via `layout` do Framer Motion (`mode="popLayout"`)**: a primeira versão usava uma `min-height` fixa igual para todas as etapas, calibrada pela etapa mais alta (Segmento) — isso deixava um vão vazio grande nas etapas mais curtas (Cidade, Empresa, Porte), violando a instrução de "não criar espaços vazios absurdos". Corrigido: o container agora anima suavemente para a altura real de cada etapa. Desativado (`layout={false}`) quando `prefers-reduced-motion` está ativo — nesse caso a altura muda instantaneamente, sem tween.
- **CTA final ("Consultar meu diagnóstico gratuito") continua clicável e com aparência normal** (não `disabled`, ao contrário do CTA secundário do Hero) — a instrução desta fase pediu explicitamente que "o fluxo ainda esteja visualmente completo". O clique não finge enviar nada: `buildDiagnosticMessage` é exercitada (log em modo dev via `trackEvent`) e uma nota honesta aparece — "a integração com WhatsApp será ativada em breve" — sem alegar que qualquer dado foi recebido/armazenado (não há backend nesta fase) e sem gerar nenhuma URL `wa.me`.
- **`lib/whatsapp.ts` contém apenas `buildDiagnosticMessage`/`resolveSegmentLabel`** — nenhuma função de link (`wa.me`) foi criada, por instrução explícita da fase. Isso fica para a FASE 09, quando o número real existir.
- **`lib/analytics.ts` (`trackEvent`) é um no-op fora de desenvolvimento** (`console.debug` apenas quando `NODE_ENV !== "production"`) — chamado nos 4 pontos já mapeados em PLANEJAMENTO.md, seção 12 (`diagnostic_start`, `diagnostic_step_advance`, `diagnostic_complete`, `diagnostic_whatsapp_submit`). Nenhum GA4/GTM conectado ainda (FASE 11).
- **`scroll-behavior: smooth` adicionado em `app/globals.css`**: agora que existem âncoras reais (`#diagnostico`), o salto de scroll dos CTAs do Hero/Header fica suave. A regra de `prefers-reduced-motion` já existente (que força `scroll-behavior: auto`) cobre a acessibilidade automaticamente. `scroll-mt-20` foi adicionado à seção do Diagnóstico para compensar o Header `sticky`.
- **`ProblemSection` não foi alterada**: sua frase final ("A pergunta natural é: como está o Perfil da sua empresa agora?") já preparava a entrada do Diagnóstico sem precisar de nenhum ajuste — avaliado e decidido que nenhuma mudança era necessária, conforme a própria instrução da fase permitia.
- **Verificação funcional automatizada**: 28 checks via script Playwright (instalado outra vez apenas com `npm install --no-save`, removido ao final) cobrindo fluxo normal, fluxo "Outro", voltar/preservar dados, editar a partir da confirmação, validações, navegação por teclado, foco entre etapas, `prefers-reduced-motion`, ausência de overflow horizontal (390/820/1440px) e ausência de erros de console — todos passaram.

---

## 14.6 Decisões técnicas tomadas na FASE 06

- **`ProcessTimeline` renomeado para `ProcessSection`**: mantém o padrão de nomenclatura `*Section` já usado por `Hero`, `ProblemSection`, `DiagnosticSection` e `MethodologySection` — todas as seções de nível superior seguem o mesmo sufixo, facilitando localizar o arquivo pelo nome da seção.
- **9 critérios agrupados em 4 blocos temáticos** (Estrutura do perfil / Conteúdo / Reputação / Presença local), em vez de 9 cards individuais e iguais — dá hierarquia (grupo > critério) e evita a "grade genérica" explicitamente vetada pela instrução. Cada grupo é um `Card` com ícone + título + descrição curta + os critérios como `Badge` (reuso do componente da FASE 02, em vez de criar um novo estilo de chip).
- **Nenhum componente interno novo para os itens de metodologia/processo** (`MethodologyItem`/`ProcessStep` sugeridos na instrução não foram extraídos): os dados são arrays tipados mapeados inline dentro de cada seção — simples o suficiente para não justificar um componente próprio, seguindo a orientação explícita da fase ("se forem usados apenas uma vez e forem simples, podem permanecer dentro das respectivas seções").
- **Timeline do Processo mantida vertical em todos os breakpoints** (não muda para layout horizontal no desktop): uma linha conectora horizontal entre 5 círculos discretos é estruturalmente mais frágil de acertar de forma responsiva: manter vertical em todas as larguras, apenas aumentando espaçamento/tamanho de fonte no desktop (`sm:` breakpoints), e usar `<ol>` semântico (com `list-none` apenas para remover o marcador visual padrão) para que a ordem seja transmitida nativamente a leitores de tela, não apenas pela linha visual (`aria-hidden`) — atende a exigência explícita da instrução (seção 18).
- **Etapa 05 do Processo destacada visualmente** (círculo preenchido com `bg-primary`, ao contrário dos círculos das etapas 1-4): prepara a entrada narrativa da futura seção de Solução/Otimização sem construir nada dela ainda, conforme pedido.
- **Transição Diagnóstico → Metodologia feita só na copy de abertura da `MethodologySection`** ("Os dados que você informou são o ponto de partida. Nossa análise vai além disso...") — o `DiagnosticSection`/`DiagnosticWizard` não foram tocados, preservando o comportamento já testado na FASE 05.
- **Alternância de fundo mantida**: Hero (padrão) → Problema (`muted`) → Diagnóstico (padrão) → Metodologia (`muted`) → Processo (padrão), continuando o ritmo alternado já estabelecido nas fases anteriores.
- **Achado de QA (não é bug do site)**: um script de verificação que rolava a página muito rápido (passos de 300px a cada 80ms) fez o `ScrollReveal` da `ProcessSection` não disparar a tempo em uma captura "full-page", deixando a seção com `opacity:0` (e por isso invisível, mas ainda ocupando espaço) nesse screenshot específico. Confirmado como artefato de teste — não um defeito do componente — ao repetir com scroll mais lento (passos de 200px a cada 150ms): a seção renderizou com `opacity:1` e altura real (`getBoundingClientRect`). Mesma categoria de artefato já documentado na FASE 04 (seção 14.4).

## 14.7 Decisões técnicas tomadas na FASE 07

- **Hierarquia visual por contraste de tratamento, não por tamanho apenas**: Otimização e NFC (elementos 1 e 2) recebem composição editorial "aberta" (duas colunas, sem borda de card); Relatório e Manual (elementos 3 e 4) ficam em `Card` compactos lado a lado. O contraste entre "editorial aberto" e "card fechado" comunica a hierarquia pedida na instrução (seção 10) sem precisar variar tamanho de fonte ou repetir o mesmo padrão quatro vezes.
- **`METHODOLOGY_AREAS` extraído para `lib/constants.ts`**: os 4 rótulos de área usados em `MethodologySection` (FASE 06) passaram a vir de uma constante compartilhada, reaproveitada como chips na Otimização completa — reforça literalmente a mensagem "executamos melhorias nas mesmas frentes que analisamos" (instrução, seção 2) e evita duas listas de strings dessincronizáveis. Refatoração mecânica em `MethodologySection.tsx` (troca de literais por `METHODOLOGY_AREAS[i]`), sem alterar o HTML renderizado.
- **`OptimizationPreview` (diagrama "antes/depois") deliberadamente sem estrelas ou contagem de fotos**: a primeira ideia incluía um mini-widget de avaliação (ex. estrelas parcialmente preenchidas) para sugerir "mais reputação depois" — descartada porque qualquer contagem específica preenchida (ainda que sem número exibido) pode ser lida como uma métrica implícita ("4 de 5 estrelas"), o que a instrução proíbe explicitamente. A versão final usa apenas barras de completude de informação (largura/quantidade variável), um idioma de "skeleton loader" que ninguém interpreta como um dado real.
- **Avisos de honestidade como texto visível na interface**, não apenas como comentário no código: tanto `NfcShowcase` quanto `ReportShowcase` exibem uma legenda (`text-caption`) explicando que a imagem é conceitual e será substituída — atende literalmente à instrução "documentar o placeholder" (seção 5) da forma mais transparente possível (visível para qualquer visitante, não só para quem lê o código).
- **`ManualShowcase` não foi extraído como componente próprio**: ao contrário de NFC e Relatório (que têm um diagrama customizado de várias camadas), o Manual usa apenas um ícone (`BookOpen`) em um círculo — visual simples o bastante para ficar inline dentro de `SolutionSection.tsx`, seguindo a orientação explícita da fase de evitar abstração excessiva quando o elemento é simples e usado uma única vez.
- **Bug de espaçamento corrigido**: o grid dos cards de Relatório e Manual usava a altura padrão do CSS Grid (`stretch`), esticando o card do Manual (mais curto) até a mesma altura do card do Relatório (mais alto, por causa do mockup visual), deixando um vão vazio sem função embaixo do texto do Manual. Corrigido com `items-start` no grid, permitindo que cada card assuma a própria altura de conteúdo.
- **Nenhuma seção anterior foi alterada além do refactor mecânico em `MethodologySection.tsx`**: `ProcessSection.tsx` permanece exatamente como estava (a transição Processo → Solução foi resolvida só pela copy de abertura da nova seção, seguindo a mesma abordagem já usada na transição Diagnóstico → Metodologia na FASE 06).

## 14.8 Decisões técnicas tomadas na FASE 08

- **`components/ui/Accordion.tsx` (`AccordionItem`) criado como primitivo reutilizável**, não como parte interna de `FAQSection.tsx` — segue o padrão já estabelecido de componentes genéricos em `components/ui/` (mesmo raciocínio de `Progress`, `Badge`, etc.), caso um accordion seja útil em outro lugar no futuro.
- **Cada `AccordionItem` guarda seu próprio estado (`useState` local)**, sem Context nem estado compartilhado entre itens — todos os itens podem ficar abertos ao mesmo tempo (padrão ARIA "Accordion (Multiple)", mais simples que coordenar um único item aberto por vez, e não havia exigência de comportamento exclusivo na instrução).
- **Animação de altura via CSS Grid (`grid-template-rows: 0fr → 1fr`)**, sem medir pixels via JavaScript (sem `ResizeObserver`/`getBoundingClientRect`) — mais simples e, por ser uma `transition` CSS comum, já é automaticamente coberta pela regra global de `prefers-reduced-motion` existente em `globals.css` (que reduz a duração de qualquer `transition` para ~0), sem precisar de lógica extra no componente.
- **Padrão ARIA**: `<h3><button aria-expanded aria-controls>` + painel com `role="region"` e `aria-labelledby` — o `role="region"` é usado propositalmente aqui (só 4 perguntas; a própria especificação ARIA APG desaconselha esse papel quando há muitos itens, por virarem landmarks demais para quem usa leitor de tela).
- **Seção de Provas Sociais deliberadamente sem nenhum elemento visual custom** (nem diagrama, nem ícones nos chips) — ao contrário de Otimização/NFC/Relatório (FASE 07), aqui a ausência de qualquer ilustração é a escolha certa: like a instrução pede, "prefira honestidade a visual impressionante", e não há nada real para ilustrar ainda. O bloco é puramente tipográfico (título + parágrafo + chips de categoria em `Badge variant="outline"`, a variante mais discreta do componente).
- **Headline da seção de provas usa quase literalmente a sugestão da instrução** ("Trabalho que pode ser visto, não apenas prometido.") — mantida por já ser direta, honesta e sem hype, sem necessidade de reescrever.
- **Resposta sobre mensalidade segue a redação sugerida na instrução quase palavra por palavra** ("O diagnóstico não cria nenhum compromisso...") — deliberado: a instrução foi explícita em avisar que, sem informação suficiente no briefing, não se deve afirmar "não existe mensalidade", e a frase sugerida já resolve isso com precisão.
- **Verificação de honestidade automatizada**: script de QA varreu o `innerText` da página inteira por uma lista de termos/símbolos proibidos (%, R$, "garantido", "ranking", "cliente atendido", nomes fictícios de empresa, "lorem ipsum" etc.) — nenhuma ocorrência indevida encontrada. A única ocorrência da palavra "estrelas" no texto é a frase que explicitamente afirma a ausência delas ("Sem estrelas, notas ou depoimentos genéricos").
- **Bugs encontrados durante o próprio script de QA** (não no site): um `id` gerado por `useId()` do React contém `:` (ex. `:r5:`), inválido como seletor CSS `#id` sem escape — corrigido usando seletor de atributo (`[id="..."]`); e uma checagem de visibilidade do painel rodava antes da transição de 200ms terminar, dando falso negativo — corrigido com uma pequena espera antes da checagem. Nenhum dos dois era um defeito real do `AccordionItem`.

## 14.9 Decisões técnicas tomadas na FASE 09

- **`TrackedCtaLink` e `WhatsAppLinkButton` criados para contornar uma restrição real do React Server Components**: Server Components não podem passar funções (closures) como prop para um Client Component — só dados serializáveis (strings, números, objetos simples). Como `Hero`, `Header`, `FinalCTASection` e `DiagnosticSection` são Server Components e precisavam disparar `trackEvent(...)` no clique de um CTA, a solução foi criar dois pequenos Client Components que recebem apenas `eventName`/`eventParams` (serializáveis) como props e constroem o `onClick` **internamente**, no seu próprio módulo cliente. Isso evitou transformar Hero/Header/FinalCTASection inteiros em Client Components só por causa de um clique — exatamente o que a instrução da fase pede ("não transforme a seção inteira em Client Component se não for necessário").
- **`WhatsAppLinkButton` é o único lugar que decide "link real vs. botão desabilitado"**: usado por `Hero`, `ConfirmationStep`, `FinalCTASection` e (de forma independente, sem props) pelo `WhatsAppFloatingButton`. Nenhum desses lugares monta a URL `wa.me` manualmente — todos chamam `buildWhatsAppUrl` (via este componente ou diretamente, no caso do floating button).
- **Normalização do número deliberadamente genérica**: `normalizeWhatsAppNumber` só extrai dígitos e valida um comprimento plausível (10–15, o máximo permitido pelo padrão internacional E.164) — não assume formato brasileiro específico (DDD de 2 dígitos, nono dígito, etc.), conforme a instrução pediu explicitamente para não inventar regras comerciais além do necessário.
- **`ConfirmationStep` perdeu o estado `submitted` (FASE 05)**: antes, o clique no CTA final revelava uma mensagem "será ativado em breve" via `useState`, mesmo sem nenhuma ação real acontecer. Agora, com `WhatsAppLinkButton` centralizando a decisão, o botão é um link real quando configurado (o clique JÁ é a ação — abrir a conversa) ou um botão desabilitado com uma legenda sempre visível quando não — mais simples e mais honesto (não pretende ter "recebido" nada que não foi de fato enviado a lugar nenhum).
- **Eventos de analytics consolidados**: em vez de um nome de evento por botão, dois eventos genéricos com parâmetro `source` — `cta_click` (para os CTAs que apontam para `#diagnostico`: hero, header, CTA final) e `whatsapp_click` (para os CTAs de WhatsApp que não fazem parte do funil do diagnóstico: hero secundário, CTA final secundário, floating). `diagnostic_whatsapp_submit` (FASE 05) continua separado por marcar especificamente a conclusão do funil do diagnóstico — o evento mais valioso de medir isoladamente.
- **Botão flutuante usa `MessageCircle` (lucide) genérico**, não uma logo do WhatsApp — a biblioteca de ícones já usada no projeto não inclui marcas registradas, e não havia motivo para importar um asset externo só para isso (instrução da fase permitia essa alternativa).
- **Única lógica de visibilidade condicional implementada no floating button: esconder perto do Footer** (via um `IntersectionObserver` observando a tag `<footer>`). A instrução também sugeria esconder dentro da seção de Diagnóstico, mas isso foi deliberadamente **não implementado**: o ganho é pequeno (o Diagnóstico já tem seu próprio CTA grande e centralizado, baixo risco real de sobreposição) e adicionaria um segundo observer/estado — a instrução pedia para só implementar esse tipo de lógica "se puder fazê-la de forma simples e robusta", e uma única responsabilidade (Footer) manteve o componente simples.
- **Verificação com número de QA**: durante os testes, a variável `NEXT_PUBLIC_WHATSAPP_NUMBER` foi definida temporariamente **apenas no ambiente do terminal** (nunca em `.env.local` nem em nenhum arquivo do projeto) com um valor obviamente fictício (`5500000000000`, uma sequência de zeros), usada para validar geração de URL, encoding de caracteres especiais (`Café São José & Filhos`) e o caso "Outro". Confirmado por busca no repositório inteiro que esse número não ficou gravado em nenhum arquivo, e o build final foi refeito sem a variável definida, restaurando o estado real (sem WhatsApp configurado) antes de finalizar a fase.
- **Header e Footer revisados, não redesenhados**: o Header trocou `Button` por `TrackedCtaLink` (mesmo visual, só ganhou tracking) e continua apontando para `#diagnostico`, como a instrução pediu explicitamente. O Footer não precisou de nenhuma mudança.

## 14.10 Decisões técnicas tomadas na FASE 10 (auditoria)

> Fase de auditoria, não de reconstrução — a maior parte do site (ritmo, design system, Diagnóstico, FAQ) foi revisada e considerada correta sem nenhuma mudança. Documentadas aqui apenas as decisões que geraram alteração real.

- **Robustez de conteúdo animado sem JavaScript/JS lento**: o Framer Motion renderiza os estados `initial`/`whileInView` como `style` inline no HTML do servidor (ex. `opacity:0`) — conteúdo animado por `ScrollReveal` fica invisível até a hidratação rodar. Em vez de reconstruir a arquitetura de animação, três mudanças pontuais e de baixo custo resolvem os dois cenários reais de risco: (1) `ScrollReveal` agora sempre aplica a classe estável `.motion-reveal` (além da classe recebida via prop), e `app/layout.tsx` injeta um `<noscript><style>.motion-reveal{opacity:1!important;transform:none!important}</style></noscript>` — cobre 100% dos visitantes sem JavaScript, em qualquer seção da página; (2) o `<h1>` do Hero (candidato a LCP) perdeu o wrapper `ScrollReveal` e é renderizado direto, sem depender de hidratação para aparecer; (3) o limiar padrão de `amount` do `ScrollReveal` caiu de `0.3` para `0.15`, tornando o `whileInView` menos sensível a variações de viewport curto. Não foi criada nenhuma solução de "reveal via CSS puro" mais ampla — o custo/benefício de reescrever todo o sistema de animação não se justificava frente a esses três ajustes cobrirem os riscos reais apontados pela instrução.
- **`/dev/design-system` em produção**: a rota já tinha `robots: noindex`, mas isso não impede acesso direto via URL. Solução escolhida — a mais simples e segura das opções avaliadas — foi um `if (process.env.NODE_ENV === "production") notFound();` no topo do Server Component. `next dev` sempre roda com `NODE_ENV=development`, então o ambiente local não é afetado; em produção a rota passa a responder 404 real.
- **Página 404 customizada** (`app/not-found.tsx`): substitui a página genérica do Next.js por uma versão mínima com a mesma linguagem visual do restante do site (eyebrow + h1 + texto + CTA de volta à Home), reaproveitando `Container` e `TrackedCtaLink`. `noindex` explícito nos metadados. Header/Footer vêm automaticamente do `RootLayout`.
- **JSON-LD avaliado e implementado de forma mínima**: a instrução pedia para avaliar se existe algum schema "realmente seguro" de implementar, sem inventar dados. Decisão: apenas `WebSite` (`name` + `url`, ambos já conhecidos e reais). `Organization` foi avaliado e **rejeitado explicitamente** — exigiria endereço, telefone, logo e/ou redes sociais, e nenhum desses dados existe ainda; implementar `Organization` com qualquer um desses campos ausente/inventado violaria a regra de honestidade da fase. Nenhum schema foi adicionado "só por SEO".
- **Meta description revisada**: passou a mencionar explicitamente "Perfil da Empresa no Google" (nomenclatura usada no resto do site) em vez de "presença e desempenho local", que era mais genérico.
- **Auditoria de contraste (WCAG AA) encontrou 2 problemas reais**, ambos confirmados pelo Lighthouse/axe (`color-contrast`, score 0) e não por inspeção subjetiva:
  1. `--s360-muted-foreground` (`#71717a`) sobre `--s360-muted` (`#f4f4f5`) media ~4.39:1 — abaixo do mínimo de 4.5:1 para texto normal. Afetava o parágrafo introdutório de `ProblemSection` (e, em tese, qualquer texto secundário sobre uma seção com fundo `muted`). Corrigido escurecendo o token para `#64646d` (~5.3:1 sobre `--s360-muted`, ainda mais sobre `--s360-background`/`--s360-card`) — mudança no token, não um patch isolado, para cobrir consistentemente todo uso de `text-muted-foreground` sobre fundo `muted` na página.
  2. O texto secundário do Hero ("Falar com um especialista: disponível em breve") usava `text-muted-foreground/70`, um modificador de opacidade arbitrário que reduzia o contraste para ~3:1. Removido — `text-muted-foreground` sozinho já é suficientemente discreto e passa AA. Confirmado que esse era o único uso de opacidade reduzida em texto no projeto (as demais ocorrências de `/NN` em classes são bordas decorativas, não texto).
     Após as duas correções, Lighthouse confirma Acessibilidade 100 e zero audits binários com falha.
- **Lighthouse em produção**: executado com sucesso via `CHROME_PATH` apontando para o Microsoft Edge do sistema (só o Chromium do Playwright estava disponível, e não é aceito como "navegador completo" pelo Lighthouse). Resultado final: Performance 96–100, Acessibilidade 100, Best Practices 100, SEO 100, CLS 0, TBT ≤ 80ms. A pontuação de Performance variou entre execuções (96–100, LCP entre 0.6s–2.7s) — investigado e atribuído a processos concorrentes na máquina local (instâncias de Edge não finalizadas por um erro cosmético de limpeza do próprio Lighthouse/`chrome-launcher`, `EPERM` ao remover diretório temporário), não a uma regressão de código: nenhuma mudança desta fase (troca de token de cor, remoção de wrapper de animação) explica uma variação de segundos no LCP. Não foi feita nenhuma alteração de código só para perseguir esse número, conforme a instrução pediu explicitamente.
- **Demais insights do Lighthouse (não acionados)**: `unused-javascript` e `legacy-javascript-insight` apontam para os próprios chunks de framework do Next.js/React (runtime e polyfills), não para código do projeto; `render-blocking-insight`/`network-dependency-tree-insight` apontam para a única folha de CSS da página, necessária e pequena. Nenhum desses é um defeito introduzido pelo projeto — são características esperadas de qualquer app Next.js deste tamanho — e a instrução pediu explicitamente para não alterar código artificialmente atrás de score; documentados aqui, não corrigidos.
- **Dependências e código morto**: `package.json` reavaliado por completo — nenhuma dependência não utilizada encontrada, nenhum código morto/TODO esquecido nos diretórios `components/`/`lib/`. Nenhuma remoção feita.
- **Playwright e Lighthouse usados apenas como ferramentas de QA temporárias** (`npm install --no-save`), removidas ao final da fase; confirmado por busca direta em `package.json`/`package-lock.json` que nenhum dos dois deixou rastro.

## 14.11 Decisões técnicas tomadas na FASE 11 (analytics, eventos, consentimento, LGPD)

- **Taxonomia final de eventos** — 5 eventos, tipados em `lib/analytics.ts` via `EventParamsMap` (nenhum `trackEvent("string-solta", {...})` possível, o TypeScript recusa nomes/propriedades fora da tabela):
  | Evento                                                                                                                                                                                                                                                                                                                                              | Propriedades                                                                | Quando dispara                                                                                |
  | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
  | `cta_click`                                                                                                                                                                                                                                                                                                                                         | `source` (header/hero/final_cta/not_found), `destination` (diagnostic/home) | Clique em um CTA que leva ao diagnóstico ou à Home                                            |
  | `whatsapp_click`                                                                                                                                                                                                                                                                                                                                    | `source` (hero/final_cta/floating/diagnostic)                               | Clique em qualquer botão de WhatsApp — significa "abriu a conversa", nunca "mensagem enviada" |
  | `diagnostic_start`                                                                                                                                                                                                                                                                                                                                  | —                                                                           | 1ª interação efetiva com o diagnóstico (nunca no mount/viewport)                              |
  | `diagnostic_step_complete`                                                                                                                                                                                                                                                                                                                          | `step` (segment/size/city/company)                                          | Cada etapa validada com sucesso                                                               |
  | `diagnostic_complete`                                                                                                                                                                                                                                                                                                                               | —                                                                           | Chegada à confirmação com dados válidos (1x por experiência)                                  |
  | Isso **substitui** o plano original da seção 12 (`diagnostic_step_advance` com `step_number`, e `diagnostic_whatsapp_submit` separado) — consolidação pedida explicitamente pela instrução da FASE 11 (poucos eventos + propriedades, e o WhatsApp pós-diagnóstico é só mais uma origem de `whatsapp_click`, comparável a hero/final_cta/floating). |
- **Correção de vazamento de dados (achado real, não hipotético)**: `ConfirmationStep` (FASE 09) enviava `segment` e `city` como propriedades do evento de clique no WhatsApp final. Isso violava diretamente a regra da FASE 11 de nunca enviar dados de negócio/pessoais ao analytics. Corrigido: o evento agora é só `whatsapp_click({ source: "diagnostic" })`, sem nenhum dado do formulário. Confirmado por captura de `window.dataLayer` em QA que nenhum evento, em nenhum ponto do fluxo, carrega segmento/cidade/nome da empresa/mensagem/número de telefone.
- **`diagnostic_start` reescrito para dispensar `useEffect` de mount**: antes (FASE 05), disparava em um `useEffect(() => {...}, [])` — ou seja, no instante em que o `DiagnosticWizard` hidrata, nunca por causa de interação real. Isso violava a instrução ("evitar disparar simplesmente porque a seção entrou na viewport" — o mount é uma versão ainda mais cedo do mesmo problema). Agora dispara dentro dos handlers `onSelect`/`onChange` das etapas (1ª seleção de segmento, 1ª mudança de porte/cidade/empresa), guardado por `useRef` para nunca duplicar. Efeito colateral positivo: elimina qualquer risco de disparo duplicado em desenvolvimento por causa do double-invoke de efeitos do React Strict Mode, já que não depende mais de um efeito de mount.
- **`diagnostic_step_complete` fica com o "step" que acabou de ser preenchido** (segment/size/city/company), nunca "confirmation" — a chegada à confirmação já é inteiramente coberta pelo `diagnostic_complete` separado, então não haveria uma segunda etapa "depois" da confirmação para o `step_complete` representar. `diagnostic_complete` é guardado por `useRef` (`hasCompletedRef`) para não contar de novo se o visitante editar uma resposta e voltar à confirmação — mas `diagnostic_step_complete` **pode** disparar de novo para uma etapa reeditada (ex.: editar o segmento faz o visitante repassar por size/city/company de novo) — isso é intencional: é uma nova conclusão real daquela etapa, não uma duplicata da mesma ação.
- **`diagnostic_step_back` avaliado e não implementado**: a instrução permitia pular se não agregasse informação de UX nova. Como o funil já é reconstruível a partir da ausência dos eventos de avanço seguintes (quem parou em `diagnostic_step_complete(step="size")` sem nunca chegar a `step="city"` abandonou ali), um evento de "voltar" não acrescentaria uma pergunta nova que os dados já não respondem.
- **`page_view` manual não implementado**: GA4, quando configurado dentro do container GTM, já mede pageviews automaticamente (Enhanced Measurement). Como este é um site de uma página só (sem navegação client-side entre rotas), implementar um evento manual só duplicaria essa medição — exatamente o que a instrução pediu para evitar.
- **UTMs**: nenhuma captura/atribuição própria foi construída (sem `sessionStorage`, sem anexar UTMs a cada evento manualmente). O GTM/GA4 já lê `utm_source`/`utm_medium`/`utm_campaign`/`utm_content`/`utm_term` da URL de entrada nativamente para atribuição — construir um mecanismo próprio seria exatamente o "sistema de atribuição sem necessidade" que a instrução pediu para evitar. Isso também **supersede** a ideia original da seção 12 (que cogitava replicar UTMs via `sessionStorage`).
- **GTM como estratégia única** (não GA4 direto): a instrução pediu explicitamente para não forçar as duas integrações simultaneamente. GTM foi escolhido por já estar previsto desde a seção 2 do planejamento original e por permitir configurar GA4 (e, futuramente, outras tags) de dentro do container sem novo deploy — `@next/third-parties/google`'s `<GoogleTagManager>` é o mecanismo oficial do Next.js para isso (evita `<script>` manual frágil).
- **Por que `lib/analytics.ts` não importa `sendGTMEvent` de `@next/third-parties/google`**: esse pacote marca seus módulos como Client Component (`"use client"`). `lib/analytics.ts` também é usado por `app/layout.tsx` (Server Component) para decidir, via `isAnalyticsConfigured()`/`getGtmId()`, se renderiza `<AnalyticsProvider>`. Importar um módulo `"use client"` ali acoplaria esse limite sem necessidade. `window.dataLayer.push(...)` é o mesmo contrato público que `sendGTMEvent` usa por baixo (documentado pelo próprio Google Tag Manager) — replicá-lo em 2 linhas mantém `lib/analytics.ts` isomorfo (seguro em Server e Client Components).
- **Arquitetura de consentimento**: avaliado o comportamento real do site (instrução, seção 17) — sem `NEXT_PUBLIC_GTM_ID`, nenhum cookie não essencial é usado, então nenhum banner aparece (`AnalyticsProvider` retorna `null`). Com o ID configurado, o `GoogleTagManager` só é montado depois que o `ConsentBanner` recebe "Aceitar" — "Rejeitar" nunca carrega o script. A escolha fica em `localStorage` (`lib/consent.ts`), nunca dados do diagnóstico. Aceitar/Rejeitar têm o mesmo peso visual (mesmo tamanho, mesma linha) — sem dark pattern.
- **`AnalyticsProvider` usa `useSyncExternalStore`, não `useEffect` + `setState`**: a primeira versão lia `localStorage` num `useEffect` que chamava `setState` diretamente no corpo — o lint do projeto (`react-hooks/set-state-in-effect`) rejeitou esse padrão por gerar rerenders em cascata desnecessários. Reescrito com `useSyncExternalStore` (a API do React para exatamente este caso: ler um valor externo ao React, como `localStorage`, sem mismatch de hidratação e sem efeito extra) — `getServerSnapshot` sempre retorna `null` (o servidor nunca conhece a escolha, que só existe no navegador), e `lib/consent.ts` expõe um `subscribeConsent` mínimo (um `Set` de listeners) para que o clique em Aceitar/Rejeitar notifique o hook imediatamente. Efeito colateral aceito e documentado: como o servidor sempre renderiza a partir de `consent = null`, um visitante que JÁ aceitou em uma visita anterior pode ver o banner por uma fração de segundo até a hidratação confirmar a escolha real do `localStorage` — inerente a qualquer mecanismo de consentimento baseado em armazenamento só do navegador (sem cookie lido pelo servidor), e não valia a complexidade adicional de resolver.
- **Google Consent Mode avaliado e não implementado**: depende de quais tags/categorias existirão dentro do container GTM real, que ainda não existe. Implementar uma configuração de Consent Mode agora seria uma simulação incompleta (a própria instrução pediu para evitar isso) — registrado como decisão externa futura, junto com a criação do container.
- **Política de Privacidade não inventada**: o Footer já tinha, desde a FASE 03, um array `legalLinks` vazio que renderiza automaticamente a navegação de links legais assim que for preenchido — o mecanismo pedido pela instrução ("preparar a possibilidade de link futuro") já existia, nenhuma mudança de código foi necessária nesta fase.
- **Sugestão de Key Events para configuração futura no GA4** (não implementado via código, é configuração de plataforma): `diagnostic_complete` e `whatsapp_click` são os dois eventos mais próximos de uma conversão real.
- **QA de performance**: a primeira leitura pós-implementação mostrou Performance caindo para 82–89 (vindo de 96–100 na FASE 10) com TBT elevado (330–440ms). Antes de aceitar isso como regressão, foi feito um teste controlado: rebuild completo SEM `<AnalyticsProvider />` no layout — o resultado foi igualmente ruim (Performance 82, TBT 390ms), provando que o componente novo não é a causa. A máquina local tinha processos pesados concorrentes no momento (sincronização do OneDrive, múltiplas janelas de navegador, editor, outros aplicativos, todos disputando os mesmos 8 núcleos lógicos) — a mesma classe de ruído já observada na FASE 10. Acessibilidade/Best Practices/SEO permaneceram 100 em todas as execuções (métricas binárias, robustas a ruído de CPU), reforçando que o problema é de ambiente, não de código. Nenhuma alteração de código foi feita para perseguir o número, conforme a instrução pediu explicitamente.

## 14.12 Decisões técnicas tomadas na FASE 12 (produção, deploy, substituição de ativos)

- **`lib/env.ts` criado — validação de configuração pública, não framework de validação**: a instrução pediu para avaliar se fazia sentido uma pequena camada de validação (URL do site, GTM ID) sem construir algo complexo. Duas funções puras: `isValidSiteUrl` (o valor precisa ser uma URL `http`/`https` de verdade) e `isValidGtmId` (formato `GTM-XXXXXXX`). O número de WhatsApp já tinha sua própria validação (`normalizeWhatsAppNumber`, FASE 09) e não foi duplicado aqui.
  - **Achado real, não hipotético**: antes desta fase, `lib/site.ts` fazia só `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"` — um valor PRESENTE mas mal formatado (ex.: `"suite360.com"`, sem protocolo) passaria direto, e `new URL(siteUrl)` em `app/layout.tsx` (`metadataBase`) lançaria uma exceção, derrubando a aplicação inteira. Confirmado via QA: build e página funcionam normalmente agora com um valor inválido, caindo no mesmo fallback seguro de "ausente" (`http://localhost:3000`), e um aviso aparece no log do servidor (nunca no cliente) apontando o problema.
  - Mesma lógica para `NEXT_PUBLIC_GTM_ID` em `lib/analytics.ts`: um ID mal digitado agora é tratado como "não configurado" (sem banner, sem script) em vez de gerar um `<script src="...id=ID_INVALIDO">` quebrado silenciosamente.
- **`.env.example`**: `NEXT_PUBLIC_SITE_URL` deixou de vir preenchido com `https://www.example.com` — ficou vazio, no mesmo padrão dos outros dois. Não porque `example.com` fosse enganoso (é o domínio reservado padrão para documentação), mas para eliminar qualquer risco de alguém copiar o arquivo para `.env.local` e esquecer de trocar o valor.
- **`package.json`: `engines.node` adicionado como `>=20.9.0`** — não um número arbitrário nem a versão exata da máquina de desenvolvimento (`24.19.0`, que seria excessivamente específica e arriscaria incompatibilidade com a versão disponível no ambiente de deploy real). É exatamente o mínimo que o próprio `next` (`node_modules/next/package.json`) já declara precisar. Nenhum `.nvmrc` foi criado (pinaria uma única versão de desenvolvedor local, sem benefício adicional sobre o `engines`).
- **Auditoria de segurança**: `npm audit` retornou 0 vulnerabilidades. Nenhuma ação necessária.
- **Copy de produção revisada (instrução, seções 46/47/48)** — 3 frases visíveis ao visitante que expunham "roteiro de lançamento" interno, todas reescritas sem inventar nenhuma prova/ativo no lugar:
  1. `NfcShowcase`: "fotos reais do produto serão adicionadas em breve" → "Representação conceitual do display de avaliações." (descreve o que a imagem é, sem prometer substituição futura).
  2. `ReportShowcase`: "as páginas reais serão adicionadas conforme o material for finalizado" → "Modelo ilustrativo do relatório de entrega." (mesma lógica).
  3. `SocialProofSection`: o parágrafo dizia explicitamente "à medida que os primeiros trabalhos forem concluídos e autorizados... este espaço vai reunir evidências reais" — a frase mais próxima do exemplo literal citado pela instrução ("adicionaremos provas quando tivermos"). Reescrita para descrever o PADRÃO de evidência que a Suite360 usa (perfil otimizado, relatório, display em uso — em vez de estrelas/depoimentos genéricos), sem prometer uma entrega futura. Mesma honestidade (nenhuma prova fictícia é mostrada), mas sem soar como site inacabado.
- **CTA de WhatsApp sem número configurado — Hero e CTA Final passam a OMITIR o botão secundário**, em vez de mostrá-lo desabilitado com "disponível em breve" (a instrução cita essa frase quase literalmente como exemplo a reconsiderar). Justificativa: nesses dois pontos, o WhatsApp é uma alternativa — o CTA principal (`#diagnostico`) continua sendo um caminho de conversão completo e funcional sozinho, então omitir a alternativa não configurada é mais honesto e limpo do que expor um botão morto com legenda de "em construção".
  - **`ConfirmationStep` é diferente e manteve o botão desabilitado**: ali, o WhatsApp é o ÚNICO CTA daquela etapa (fim do funil do diagnóstico) — omiti-lo deixaria o visitante sem nenhuma ação possível depois de preencher todo o diagnóstico, pior do que um botão desabilitado explicado. A legenda foi só suavizada: "O envio direto pelo WhatsApp será ativado em breve..." → "Atendimento pelo WhatsApp indisponível no momento." (tom de status operacional — como uma loja dizendo "fechado agora" —, não uma confissão de que o site está incompleto).
- **Identidade visual: nenhuma mudança de código, apenas mapeamento dos pontos de substituição futura** (a instrução foi explícita: "se a identidade oficial ainda não existir, não mudar nada"). Confirmado por busca no projeto inteiro que cores hardcoded em hexadecimal só existem em 3 arquivos, todos espelhando os mesmos tokens provisórios de `app/globals.css` por necessidade técnica (não por descuido):
  - `app/globals.css` — fonte única dos tokens (`--s360-primary`, `--s360-accent`, `--s360-background`, `--s360-foreground`, `--s360-muted-foreground`, etc.). Trocar aqui primeiro.
  - `app/layout.tsx` — `viewport.themeColor: "#fafaf9"` (a cor da barra do navegador mobile não pode referenciar uma custom property CSS, precisa do valor literal).
  - `app/opengraph-image.tsx` — `ImageResponse` roda em runtime isolado (Satori), sem acesso ao CSS da aplicação; as 3 cores usadas ali (`#fafaf9`/`#0a0a0b`/`#71717a`) precisam ser copiadas manualmente sempre que os tokens mudarem.
  - `components/layout/Logo.tsx` — troca do texto tipográfico "Suite360 Films" por um `<Image>` com a logo real; Header/Footer não precisam de nenhuma mudança (só renderizam `<Logo />`).
  - `app/favicon.ico` — **confirmado ser o favicon padrão do `create-next-app`** (25.931 bytes, o triângulo genérico do Next.js), não uma marca provisória da Suite360. É um placeholder puramente técnico (categoria "Técnicos: devem desaparecer antes do lançamento", instrução seção 45) — precisa ser substituído por um favicon derivado da logo real antes do lançamento; nenhum favicon novo foi gerado artificialmente nesta fase.
- **NFC e Relatório: formato recomendado para os ativos reais** (documentação, nenhuma foto/arquivo inventado):
  - Display NFC: 2–4 fotos reais do produto físico (frente, em uso/aproximação do celular, detalhe), proporção próxima de 4:3 ou 1:1, fundo neutro, boa iluminação; formato JPEG/WebP; troca isolada em `NfcShowcase.tsx` via `next/image` (`alt` descritivo obrigatório, ex.: "Display NFC da Suite360 sobre o balcão de uma loja").
  - Relatório: 2–3 imagens — capa/página de abertura, uma página representativa da análise, um trecho que mostre a metodologia ou a entrega — sem nenhuma informação confidencial de cliente real (nome, número, dado de negócio) visível nas capturas; troca isolada em `ReportShowcase.tsx`.
  - **Regra de privacidade dos ativos** (instrução, seção 16): quando esses materiais chegarem, nenhuma foto/print deve expor telefone, e-mail, endereço ou qualquer dado de cliente sem autorização explícita — vale também para a futura seção de provas sociais.
- **Deploy target: Vercel, sem `vercel.json`** — o projeto é Next.js padrão (App Router, sem rotas/customizações que exijam configuração especial de build/rewrite/headers), então a configuração nativa da Vercel já é suficiente. Criar um `vercel.json` vazio ou redundante não traria benefício, só mais um arquivo para manter sincronizado.
- **`DEPLOY.md` criado** — guia curto (instalar, configurar envs, build, deploy, validar domínio/WhatsApp/GTM, QA final), como pedido pela instrução ("não escrever dezenas de páginas").
- **QA de produção com configuração inválida (não apenas ausente)**: além do já validado na FASE 11 (ausente vs. configurado corretamente), esta fase testou explicitamente `NEXT_PUBLIC_GTM_ID="not-a-valid-id"` e `NEXT_PUBLIC_SITE_URL="not-a-valid-url"` simultaneamente — build e página continuam funcionando (200, sem exceção de JS), o GTM inválido é tratado como não configurado (sem banner, sem script) e o canonical cai no fallback `localhost` em vez de propagar a string inválida. Isso teria quebrado a aplicação antes desta fase (ver achado do `lib/env.ts` acima).
- **Performance**: mesma variação por ruído de máquina local já documentada na FASE 11 (Performance 86, Acessibilidade/Best Practices/SEO 100, zero audits binários com falha) — não investigado de novo em profundidade, pois a causa já havia sido isolada (processos concorrentes, não código). Nenhuma alteração de código feita para perseguir o número.

## 14.13 Direção visual "dark theme" (fora do fluxo de FASEs — instrução direta do usuário)

> Diferente das seções anteriores, esta não corresponde a uma "FASE" numerada formalmente pelo usuário — foi um pedido direto, fora do fluxo de instruções longas, para adotar uma estética inspirada em framer.com. Documentado aqui para manter o histórico de decisões consistente com o resto do projeto.

- **Escopo confirmado com o usuário antes de implementar**: como framer.com tem uma estética bem específica (dark theme quase preto, tipografia grande/pesada, cards de borda fina sem sombra, halo/glow colorido), e a mudança afetaria a base inteira do design system (nao so um ajuste pontual), perguntei ao usuário qual das 3 direções ele quer antes de tocar em qualquer arquivo: (1) dark theme completo, (2) manter tema claro só adotando a linguagem visual, ou (3) só elementos pontuais. Resposta: **dark theme completo**.
- **Referência visual obtida via screenshot real** (`https://www.framer.com/`), não só descrição — permitiu identificar os elementos concretos a replicar: fundo quase preto uniforme, texto claro, títulos grandes e pesados com tracking apertado, cards com contorno fino (sem sombra visível), halo/glow colorido ao redor de elementos-chave (não em todo lugar), paleta quase monocromática com um único acento vibrante.
- **A arquitetura de tokens semânticos (FASE 01/02) permitiu uma conversão quase inteiramente via `app/globals.css`**: antes de editar, uma varredura confirmou que nenhum componente usa cor hardcoded (hex literal) ou classe de paleta padrão do Tailwind (`bg-gray-500`, `text-red-400` etc.) — todo componente usa só tokens semânticos (`bg-background`, `text-muted-foreground`, `border-border` etc.). Isso significa que redefinir os valores brutos dos tokens em um único arquivo repintou o site inteiro corretamente, sem precisar editar a maioria dos componentes.
- **Paleta escura definida com contraste verificado matematicamente antes de aplicar** (fórmula de luminância relativa do WCAG — mesma usada reativamente na FASE 10, aplicada aqui de forma proativa para não repetir o mesmo ciclo de erro):
  - `--s360-background: #0a0a0b` / `--s360-foreground: #fafaf9` — basicamente uma inversão do par usado no tema claro.
  - `--s360-muted-foreground: #a1a1aa` — verificado ~7.7:1 sobre `--s360-background` e ~6.9:1 sobre `--s360-muted`, ambos acima do mínimo AA (4.5:1).
  - `--s360-primary` precisou clarear de `#0f4c4c` (teal escuro, ilegível sobre fundo quase preto) para `#2dd4bf` (teal vibrante) — com `--s360-primary-foreground` invertendo de branco para quase-preto (`#0a0a0b`), já que agora o texto fica sobre uma cor CLARA, não escura. Verificado ~10.6:1 entre os dois.
  - `--s360-accent`/`--s360-accent-foreground` e `--s360-danger` também recalculados com o mesmo processo (contrastes de ~11.9:1 a ~14.4:1, todos com folga confortável acima do mínimo).
  - Confirmado depois via Lighthouse em produção: Acessibilidade 100, zero audits binários com falha — bate com os cálculos manuais.
- **Sombras redefinidas para o registro visual do tema escuro**: sombra preta convencional não aparece sobre um fundo já quase preto. `--shadow-subtle`/`--shadow-medium`/`--shadow-elevated` continuam existindo (com valores ajustados), mas o `Card` base deixou de aplicar sombra por padrão (`shadow-subtle` removido de `components/ui/Card.tsx`) — a separação de superfície agora vem do contorno fino (`border-border`), como no Framer.
- **Novo token `--shadow-glow`, usado com moderação**: em vez de reaproveitar "elevated" para todo efeito de destaque (o que faria o banner de consentimento, por exemplo, ganhar um halo colorido sem sentido, já que não é um elemento de marca), foi criado um nível novo e explícito. Aplicado só nos 3 elementos mais "hero" da página, os candidatos naturais a esse tratamento: botão flutuante do WhatsApp, display NFC (`NfcShowcase`) e o ícone central do `HeroVisual` — todos já `bg-primary`, então o halo teal combina com o próprio elemento. Cards comuns, popups (`ConsentBanner`) e o restante do site continuam com sombra neutra ou só contorno.
- **Tipografia**: escala de títulos (`--text-display`/`h1`/`h2`/`h3`/`h4`) aumentada para a presença tipográfica grande e confiante do Framer; texto de corpo (`body`/`small`/`caption`/`label`) mantido no tamanho original — aumentar parágrafos não contribui para a estética "hero" e prejudicaria a leitura de blocos de texto mais longos. Nenhum texto/copy foi alterado, só o tamanho de renderização.
- **`app/opengraph-image.tsx` e `viewport.themeColor` (`app/layout.tsx`) atualizados manualmente** para espelhar a nova paleta — são os 2 pontos que não recebem os tokens do CSS automaticamente (`ImageResponse` roda em runtime isolado; `themeColor` é lido pelo navegador antes do CSS carregar), mesma categoria de "pontos de sincronização manual" já mapeada na seção 14.12.
- **QA visual real**: screenshots de página inteira (desktop 1440px e mobile 390px) com scroll incremental real (não full-page sem scroll, pelo motivo já documentado na FASE 10 — o `IntersectionObserver` do `ScrollReveal` precisa de scroll de verdade), mais capturas dirigidas dos estados de formulário (foco, erro, desabilitado) e do fluxo do diagnóstico até a confirmação. Nenhum problema de legibilidade, overflow ou contraste encontrado.
- **Lighthouse em produção, estado sem integrações configuradas**: Performance 96, Acessibilidade 100, Best Practices 100, SEO 100, CLS 0, TBT 100ms — sem regressão em relação à FASE 12.
- **A identidade continua sendo provisória** — o dark theme é uma direção de estilo aprovada pelo usuário, não a identidade visual oficial da Suite360 Films (logo, paleta de marca definitiva). As mesmas pendências de "GO-LIVE" (`CHECKLIST.md`) continuam valendo: quando a marca oficial for definida, os tokens em `app/globals.css` (agora no registro escuro) são o único lugar a atualizar.

## 14.14 Retorno ao tema claro, redesenhado com o padrão de acabamento do framer.com (fora do fluxo de FASEs)

> Também fora do fluxo de "FASEs" numeradas — instrução direta do usuário revertendo a direção "dark theme" da seção 14.13, mas mantendo o framer.com como referência de qualidade/composição/tipografia/movimento (não de cor).

- **Reversão para fundo claro, sem perder o ganho de qualidade da iteração anterior**: a arquitetura de tokens semânticos (nenhuma cor hardcoded em componente nenhum, confirmado na FASE 13) permitiu que a reversão fosse, de novo, quase inteiramente feita em `app/globals.css`. A escala tipográfica grande/expressiva e a arquitetura de motion (`ScrollReveal`/`lib/motion.ts`) já atendiam ao brief desta instrução quase integralmente e foram mantidas sem alteração.
- **Paleta clara redesenhada, com contraste verificado antes de aplicar** (mesma disciplina da seção 14.13): `--s360-background: #fbfbfa` / `--s360-foreground: #0f0f10` (grafite profundo, não preto puro); `--s360-muted-foreground: #64646d` verificado em ~5.9:1 sobre o fundo e ~5.3:1 sobre `--s360-muted` — reaproveita o mesmo valor já validado na FASE 10, agora sobre um fundo ligeiramente diferente. `--s360-primary`/`--s360-accent`/`--s360-danger` voltaram aos valores da paleta clara original (teal escuro com texto claro) — a instrução pediu explicitamente para reaproveitar "as cores da identidade atual", não trocar o matiz. Confirmado depois via Lighthouse: Acessibilidade 100, zero audits binários com falha.
- **Sombras redesenhadas para o tema claro**: diferente do tema escuro (onde sombra preta convencional desaparece), aqui sombras suaves e de raio grande funcionam bem e foram a escolha explícita da instrução ("sombras muito suaves, evitando aparência genérica de dashboard") — `--shadow-subtle/medium/elevated` recalculados com opacidade baixa e blur grande. `--shadow-glow` deixou de ser um halo neon (adequado ao tema escuro) e virou uma sombra ambiente suave tingida de teal — a instrução pediu explicitamente para evitar "excesso de efeitos luminosos"; mantido nos mesmos 3 elementos "hero" (WhatsApp flutuante, `NfcShowcase`, ícone central do `HeroVisual`).
- **`Card` voltou a ter sombra sutil por padrão** (removida na FASE 13 porque sombra preta não aparece sobre fundo escuro) — combinada com o contorno fino, não no lugar dele.
- **Raio dos cards grandes aumentado de `1.5rem` para `1.75rem`** (24px → 28px, topo da faixa "16-28px" pedida) — só afeta o componente `Card` (usado por Relatório/Manual na Solução e pelo resumo do diagnóstico); `OptionCard` (etapas de Segmento/Porte) tem raio próprio, não foi alterado.
- **Largura máxima do container aumentada de `75rem` (1200px) para `87.5rem` (1400px)** — dentro da faixa "1280-1440px" pedida; como `Container` já referenciava a variável CSS diretamente, nenhum componente precisou mudar.
- **Espaçamento vertical das seções aumentado** (`py-16/20/28` → `py-20/28/36`, em `components/ui/Section.tsx`) — ritmo mais "amplo", pedido explicitamente.
- **Header ganhou fundo translúcido + `backdrop-blur` permanente**, em vez de alternar com um estado de scroll via JavaScript — visualmente equivalente ao pedido ("ao rolar, pode ganhar fundo translúcido, blur moderado e borda inferior sutil"), mas resolvido inteiramente em CSS, sem transformar o `Header` (hoje Server Component) em Client Component nem adicionar nenhum listener de scroll — decisão deliberada para não aumentar o JavaScript do cliente sem necessidade real, como a instrução pediu.
- **CTA final ganhou um bloco de fundo invertido (`Section variant="inverted"`)**, como "encerramento visual forte" pedido explicitamente ("fundo contrastante ou superfície diferenciada"). Implementado com uma classe utilitária (`.s360-invert`) que redefine as variáveis brutas de token **localmente**, dentro daquele escopo do DOM — qualquer classe semântica (`bg-background`, `text-foreground`, `border-border`, `bg-card`...) usada por qualquer componente filho passa a resolver para os valores escuros automaticamente, sem que `FinalCTASection` ou os botões dentro dela precisassem de nenhuma classe condicional. Reaproveita os mesmos valores escuros já calculados/verificados na seção 14.13.
- **Showcases (`OptimizationPreview`, `ReportShowcase`) ganharam um pequeno "chrome" de janela** (3 pontos, como os controles de uma janela de aplicativo) — reforça a leitura de "interface real" pedida ("apresente... demonstrações dentro de frames elegantes"), sem simular nenhuma tela ou produto específico. `HeroVisual` e `NfcShowcase` tiveram a escala aumentada moderadamente (elementos visuais maiores, "poucos objetos pequenos competindo pela atenção").
- **`Button` ganhou uma leve elevação no hover** (`-translate-y-0.5` + `shadow-medium`, nas variantes primary/secondary/outline) e a duração das transições de cor subiu de 150ms para 200ms em `Button`/`IconButton`/`Input`/`OptionCard` — dentro da janela "200-500ms" pedida. `rounded-2xl` (valor padrão do Tailwind, fora da escala de tokens do projeto) encontrado em `NfcShowcase.tsx` foi corrigido para `rounded-xl` (nosso token) — inconsistência pré-existente, não introduzida por esta instrução, mas cabia corrigir junto ("evite... valores arbitrários desnecessários").
- **Bento grid avaliado e não aplicado nas grades de conteúdo equivalente** (Metodologia: 4 áreas; Processo: 5 etapas) — a instrução pediu tamanhos variados "quando isso melhorar a composição"; como todos os itens dessas grades têm o mesmo peso de conteúdo, um tamanho assimétrico seria arbitrário, não editorial. A seção de Solução já tinha exatamente esse padrão (Otimização/NFC grandes e abertos, Relatório/Manual compactos) desde a FASE 07 e foi mantida como está.
- **`app/opengraph-image.tsx` e `viewport.themeColor`** atualizados de volta para os valores claros, mesma disciplina de sincronização manual já documentada.
- **QA visual real em 3 larguras** (1440/820/390px, com scroll incremental de verdade) mais estados de formulário (foco/erro/desabilitado), banner de consentimento e botão flutuante do WhatsApp (configuração temporária, nunca commitada) — nenhum problema de legibilidade, overflow ou contraste encontrado. Lighthouse em produção: Performance 94, Acessibilidade 100, Best Practices 100, SEO 100, CLS 0 — sem regressão.
- **Nenhuma dependência nova instalada** — toda a reformulação usa Tailwind v4, Motion e os componentes que já existiam.

## 14.15 FASE 13 — Identidade visual oficial (logo real + paleta preto/branco/azul)

- **Skills de design usadas proativamente**: por pedido explícito do usuário ("use as skills que instalamos"), as skills `redesign-existing-projects` e `design-taste-frontend` foram carregadas antes de tocar em qualquer arquivo, servindo de checklist de qualidade/anti-"cara de IA" (contraste de botão, hover/focus consistentes, um único accent, sombras tingidas em vez de pretas puras, radius consistente, `transform`/`opacity` para motion, `prefers-reduced-motion` obrigatório). A instrução de negócio (FASE 13, muito detalhada) permaneceu a fonte de verdade sempre que as duas convergiam ou conflitavam — ex.: a skill recomenda reduzir "eyebrows" (rótulos pequenos em maiúsculas acima de títulos) a no máximo 1 a cada 3 seções, mas isso alteraria copy/rótulos existentes, o que a própria FASE 13 proíbe explicitamente ("não alterar copy"); mantidos como estão.
- **Bloqueio real no início**: o arquivo `public/brand/suite360-logo.png` citado na instrução não existia no projeto. Perguntei ao usuário antes de inventar/simular qualquer coisa; ele forneceu o arquivo real (`logo suite.png`, na raiz) durante a conversa.
- **Análise técnica do arquivo revelou um defeito de exportação real**: o PNG (875x875, RGBA) tinha uma área retangular OPACA BRANCA muito maior que o desenho "Suite" em si — invisível sobre fundo branco, mas apareceria como uma caixa se o arquivo fosse usado sobre qualquer outro fundo. Confirmado via decodificação manual dos pixels (não só inspeção visual) e via composição de teste sobre fundo escuro. Corrigido de forma mínima e não-destrutiva com `sharp` (já uma dependência transitiva do Next.js — nenhuma dependência nova instalada): pixels quase-brancos (`R,G,B > 235`) tornados transparentes, depois cortado para o conteúdo real. Nenhum pixel do desenho ("Suite" + o traço decorativo) foi redesenhado, recolorido ou teve sua proporção alterada — só a área de fundo defeituosa foi removida.
- **Teste conclusivo: a logo NÃO funciona sobre fundo escuro** — as bordas antialiased do arquivo foram desenhadas para se fundir com branco; sobre um fundo escuro de teste, as letras aparecem como contorno claro (oco), não preenchidas. Confirma exatamente o cenário previsto pela instrução (seção 49): "se não houver versão adequada para determinado fundo, não usar filtro CSS para falsificar uma variante oficial." Decisão: a logo (`components/layout/Logo.tsx`, via `next/image`) é usada apenas em superfícies claras (Header, Footer); o bloco escuro do CTA final não exibe logo nenhuma (nunca exibiu). Registrado como pendência real de asset (variante oficial para fundo escuro).
- **A marca fornecida contém só o texto "Suite"** (sem "360"/"Films") — usada exatamente como entregue, sem completar o nome com texto adicional ao lado (isso seria alterar a marca, proibido explicitamente). O nome completo "Suite360 Films" continua em toda copy visível, metadata, JSON-LD e no `alt` da imagem — só o logotipo visual mostra a forma reduzida fornecida. Divergência sinalizada como pendência para o cliente resolver (não para o código).
- **Favicon genérico removido, sem inventar substituto** (instrução, seção 50): testado redimensionar a logo real para 32x32/64x64 — o texto "Suite" fica ilegível nesse tamanho, e o traço decorativo isolado não é um monograma desenhado como ícone independente. `app/favicon.ico` (o triângulo padrão do `create-next-app`) foi excluído. Isso fazia o navegador continuar pedindo `/favicon.ico` por convenção e gerar um 404 real no console (pego pelo próprio Lighthouse, categoria Best Practices) — resolvido declarando `icons: { icon: "data:," }` em `app/layout.tsx` (um data URI vazio, técnica padrão para dizer "não há favicon" sem inventar um símbolo). Best Practices voltou a 100 depois disso.
- **Paleta nova definida com contraste verificado matematicamente antes de aplicar** (mesma disciplina proativa da FASE 10/13-dark-theme): `--s360-primary: #0066ff` sobre `--s360-primary-foreground: #ffffff` mede ~4.84:1. Achado real durante o cálculo: o azul elétrico puro usado como TEXTO sobre `--s360-accent` (`#eaf2ff`, o tom "azul bem clarinho" pedido para superfícies de destaque) mede só ~4.29:1 — abaixo do mínimo AA (4.5:1). Corrigido criando `--s360-accent-foreground: #0052cc` (um azul mais escuro, ainda claramente "azul elétrico", só usado para texto sobre essa superfície clara) — mede ~6.06:1. Confirmado depois via Lighthouse: Acessibilidade 100, zero audits binários com falha, nas duas rodadas (antes e depois do ajuste do favicon).
- **`--shadow-glow` (halo neon teal, criado na direção "dark theme" anterior) foi removido por completo** — a instrução desta fase proíbe explicitamente "glow azul" e "glow exagerado". Os 3 elementos que usavam esse efeito (botão flutuante do WhatsApp, `NfcShowcase`, ícone central do `HeroVisual`) passaram a usar `shadow-elevated`, uma sombra neutra (tingida de grafite, não de cor), mais forte que `shadow-subtle`/`shadow-medium` mas sem nenhum tom de cor.
- **Botões: feedback por mudança de cor, não por elevação** — a versão anterior (FASE 14) dava aos botões um `translateY(-2px)` + sombra no hover, pensado para cards. A instrução desta fase diferencia explicitamente: cards recebem elevação, botões recebem "mudança de background... o botão precisa parecer preciso, não fofinho". Revertido: hover agora só troca a cor de fundo (`--s360-primary-hover: #005ce6`, calculado a partir do valor sugerido pela instrução, não de uma opacidade genérica `/90`), e `active:scale-[0.98]` dá a resposta tátil ao clique (pedida explicitamente na seção 20/21).
- **Escala de raio recalibrada por categoria de elemento** (instrução, seção 24: botões 10-14px, cards 16-24px, showcases grandes 24-32px): `--s360-radius-lg` mudou de `1.75rem` (28px, herdado da iteração "dark theme") para `1.25rem` (20px) — essa é a faixa que o `Card` genérico (usado por Relatório/Manual na Solução, resumo do diagnóstico) deveria usar. `--s360-radius-xl` (28px) ficou reservado só para showcases grandes (`NfcShowcase`). De passagem, uma inconsistência pré-existente foi corrigida: `NfcShowcase.tsx` usava `rounded-2xl`, um valor padrão do Tailwind fora da escala de tokens do projeto (não redefinido no `@theme`) — trocado para `rounded-xl` (nosso token real).
- **HeroVisual ganhou 2 indicadores orbitando** os anéis externos (rotação de 100-140 segundos por volta — imperceptível como "giro", só sugere atividade/profundidade contínua). Precisou virar Client Component só por causa dessa animação contínua via Motion; `useReducedMotion()` desliga a rotação por completo quando o visitante prefere menos movimento (testado explicitamente: o `transform` do elemento não muda entre duas leituras separadas por 800ms sob `prefers-reduced-motion: reduce`).
- **Hero ganhou um único efeito de fundo** (instrução, seção 15: no máximo 1-2 recursos, nunca vários ao mesmo tempo): um halo azul extremamente sutil (5% de opacidade, `blur-3xl`), posicionado atrás do `HeroVisual`. Puramente CSS (`bg-primary/[0.05]` + `blur-3xl`), sem custo de JS.
- **Achado real, não relacionado à identidade visual, durante a QA funcional**: rodando a suíte de QA contra o servidor de desenvolvimento (necessário para revisar `/dev/design-system`, bloqueado em produção desde a FASE 10), a página carregava com `scrollY = 2156` — rolada automaticamente até o Diagnóstico, sem nenhuma navegação por hash. Causa raiz: o guard `isFirstRender` (um `useRef(true)` booleano) em `DiagnosticWizard.tsx`, usado para não mover o foco para o heading da etapa no carregamento inicial, é corrompido pelo double-invoke de efeitos do React Strict Mode em desenvolvimento — o efeito roda, marca "já rodou", e o Strict Mode o executa de novo imediatamente; na segunda execução o guard já estava "gasto" e `titleRef.current?.focus()` disparava no mount, rolando a página inteira até o diagnóstico. Corrigido trocando o booleano por uma comparação de valores (`lastFocusedStepIndexRef.current !== state.stepIndex`), imune a quantas vezes o efeito reexecuta com o mesmo `stepIndex`. Bug **só acontecia em desenvolvimento** (Strict Mode não roda em produção) — não afetava visitantes reais, mas foi corrigido porque apareceu durante a QA desta fase e deixá-lo sem correção depois de identificado seria pior do que não tê-lo notado.
- **`Card` recebeu de volta uma sombra sutil por padrão** (fazia sentido não ter sombra na direção "dark theme" anterior, já que sombra preta não aparece sobre fundo escuro; sobre fundo claro, "sombra mínima" ainda é diferente de "sem sombra nenhuma" — a instrução pede "sombras muito suaves", não ausência de sombra).
- **QA completa**: 25 checks automatizados (overflow em 320/360/390/820/1440px, landmarks, heading hierarchy, logo com `alt`, fluxo completo do diagnóstico com voltar/editar/validação, FAQ, WhatsApp sem configuração, `prefers-reduced-motion`) + 6 checks no cenário configurado (WhatsApp + GTM temporários, nunca commitados — banner de consentimento, script GTM só após "Aceitar", eventos de analytics, botão flutuante, CTA secundário do Hero). Lighthouse final em produção: Performance 96, Acessibilidade 100, Best Practices 100, SEO 100 — zero regressão.
- **Arquivo fonte mantido na raiz**: `logo suite.png` (o arquivo original fornecido pelo usuário, antes da correção de transparência) não foi apagado — só o `public/brand/suite360-logo.png` (a versão corrigida, realmente usada pelo site) foi criado. Fica a critério do usuário remover o arquivo original ou mantê-lo como referência.

## 14.16 Número real de WhatsApp configurado (fora do fluxo de fases)

- **Número fornecido pelo usuário**: `41991111965`. Sem código de país, formato compatível com DDD 41 (Brasil) + celular com o nono dígito — assumido Brasil (`55` adicionado na frente, resultando em `5541991111965`), assumção sinalizada de volta ao usuário para confirmação em vez de aplicada silenciosamente.
- **Configurado em `.env.local`** (arquivo local, cai na regra `.env*` do `.gitignore`, nunca commitado) — não em `.env.example` (que deve continuar vazio) nem em nenhum arquivo versionado.
- **Testado de ponta a ponta com o número real**: CTA secundário do Hero, botão flutuante e botão final da Confirmação do diagnóstico — todos geram links `wa.me` corretos, com as mensagens já existentes (`buildSpecialistMessage`/`buildDiagnosticMessage`), sem nenhum dado do formulário (empresa/cidade/segmento) vazando para analytics (só para a mensagem do WhatsApp em si, que é o comportamento esperado e já documentado desde a FASE 09).
- **Pendência real remanescente**: este número só está ativo no ambiente local (`.env.local`). Para a landing publicada em produção funcionar com o WhatsApp real, a mesma variável (`NEXT_PUBLIC_WHATSAPP_NUMBER=5541991111965`) precisa ser configurada manualmente no painel do provedor de hospedagem (Vercel) no momento do deploy — ver `DEPLOY.md`, seção 2.

---

## 14.17 Reformulação visual profunda, radar do Hero e painel de otimização (fora do fluxo de fases)

> Sequência longa de instruções diretas do usuário, fora da numeração de FASEs, cobrindo: estrutura de depoimentos, redesign visual profundo (dark-by-default), campo "Estado" no diagnóstico, três iterações do elemento gráfico do Hero (órbitas → radar → radar refinado), e a reformulação do painel comparativo "antes/depois" da Solução. Consolidado numa única seção por serem, na prática, uma mesma linha de trabalho contínua.

**Estrutura de depoimentos (`TestimonialWheel`)**
- `lib/types.ts` ganhou o tipo `Testimonial`; `components/sections/TestimonialWheel.tsx` foi criado retornando `null` quando `testimonials.length === 0` — mesmo padrão já usado em `Footer.tsx` para links legais. `app/page.tsx` declara `const testimonials: Testimonial[] = []` (vazio no estado final). Testado com dados de exemplo com rótulos deliberadamente genéricos ("O depoimento do cliente aparecerá aqui quando for enviado"), depois revertido para vazio — nenhum depoimento fictício chegou a ficar no estado entregue.

**Dark-by-default (causa raiz do "site ainda parece branco")**
- Até este ponto, o fundo escuro só existia dentro de uma classe local `.s360-invert`, aplicada manualmente a 2 das 9 seções. Os tokens `:root` (usados por padrão em toda parte) eram claros — por isso a maior parte da página lia como branca mesmo depois de várias rodadas de ajuste de cor. Corrigido invertendo a base em `app/globals.css`: os tokens `:root` passaram a **ser** os valores escuros; a classe `.s360-invert` foi removida (não existe mais "seção que vira escura", a página inteira é escura por padrão, com 3 variantes de `Section` — `base`/`alt`/`elevated` — alternando tons de preto em vez de claro/escuro).
- Container ampliado (`max-w-[85rem]`/1360px, padding 24–48px) e escala tipográfica revisada (`clamp()` em todos os títulos) — resolvendo as queixas de "conteúdo pequeno, muito espaço vazio".
- Ícones técnicos próprios criados para substituir Lucide-em-círculo: `components/sections/ProblemIcons.tsx` (5 marcas para os pontos de atenção), `components/sections/MethodologyIcons.tsx` (4 marcas com microanimação no hover, orquestradas via `MethodologyCard.tsx` para isolar a interatividade do Motion num Client Component).
- `components/sections/OptimizationPreview.tsx` recebeu a primeira passada de "janela de análise" (moldura com barra superior, painéis antes/depois com barras conceituais) — depois totalmente reformulada de novo (ver mais abaixo).

**Campo "Estado" no diagnóstico** (única mudança funcional autorizada numa das instruções)
- `lib/types.ts`: tipo `UF` (26 estados + DF) e campo `estado: UF | null` em `DiagnosticData`; `DIAGNOSTIC_STEP_IDS` ganhou a etapa `"state"` entre `"size"` e `"city"`.
- `lib/constants.ts`: `STATE_OPTIONS` (sigla + nome completo) e `resolveStateLabel`.
- Novo `components/ui/Select.tsx` (select nativo estilizado) e `components/diagnostic/StateStep.tsx`.
- `diagnosticReducer.ts`: ação `SELECT_STATE` — trocar o Estado **limpa a Cidade** já preenchida (evita cidade de um estado errado sobrevivendo à troca).
- `ConfirmationStep.tsx` mostra Estado e Cidade como linhas separadas, usando `STEP_ORDER.indexOf(...)` para os índices de "Editar" (robusto à reordenação, em vez de números mágicos).
- `lib/whatsapp.ts`: mensagem passou a incluir `Cidade - Estado` (nome completo).
- Diagnóstico agora tem 6 etapas (era 5) — refletido automaticamente na barra de progresso.

**Elemento gráfico do Hero — três iterações**
1. **Radar tecnológico** (substituiu o "sistema solar" original de órbitas): núcleo central, ondas expansivas, feixe de varredura giratório (`conic-gradient`), 5 "sinais" fixos (Localização/Avaliações/Respostas/Fotos/Categorias — as mesmas 5 dimensões da `ProblemSection`, nunca renomeadas). Estrutura modular criada em `components/sections/radar/` (`radarConfig.ts`, `RadarPins.tsx`) para os pins de localização revelados progressivamente pela varredura — **essa camada de pins foi revertida a pedido do usuário** na iteração seguinte (a pasta `radar/` e `HeroBackground.tsx` foram removidos; o radar voltou à versão sem pins, mas manteve núcleo/ondas/sinais).
2. **Refinamento**: feixe giratório removido por completo (só as ondas pulsantes permanecem, reforçadas — borda mais grossa, glow próprio); núcleo do radar passou a ter um "G" (letra genérica em branco, não o símbolo colorido oficial — por isso não depende de nenhum ativo externo); fundo do Hero deixou de ser preto uniforme, ganhando gradiente diagonal verde-azulado/teal com duas extremidades mais claras.
3. **Ajuste fino de cor + bug real de empilhamento CSS**: o usuário pediu a faixa escura diagonal (não vertical), tom mais azulado (menos verde) e uma borda no "G". Ao implementar, um teste automatizado revelou que o **texto do H1 estava sendo pintado por trás do fundo do Hero, com brilho zero em qualquer ponto** — não era um problema de contraste, era uma regra real de empilhamento CSS: conteúdo `position: static` (o `Container`, que nunca tinha `position` definida) pinta **antes** de irmãos posicionados (`position: absolute`, os divs de gradiente/grid), independente da ordem no DOM. Corrigido dando `position: relative` ao `Container` só dentro de `Hero.tsx` (via `className`, sem tocar no componente `Container` compartilhado) — isso faz a ordem do DOM valer normalmente entre os dois. Confirmado por amostragem de pixel (biblioteca `sharp`) antes/depois da correção.
- **Pendência real**: o "G" do núcleo continua sendo um placeholder de letra genérica — nenhum ativo oficial do símbolo colorido do Google foi fornecido ao projeto. Se for necessário o símbolo oficial (não só a letra), adicionar em `public/brand/google-g.svg`.

**Painel "Otimização completa" (`OptimizationPreview.tsx`) — reformulação completa**
- O diagrama "2 retângulos + seta" foi substituído por uma "janela de análise" com: barra superior com indicador de status animado; dois painéis (Antes/Depois) com 7 módulos cada (cabeçalho, localização, categoria, avaliações, fotos, respostas, completude), usando só estados textuais qualitativos ("Incompleto"/"Pendente" → "Estruturado"/"Configurado"/"Otimizado" — nunca números ou porcentagens inventadas); núcleo central de "transformação" com ícone próprio; linhas de conexão animadas entre os painéis; sequência de revelação de ~3s ao entrar na viewport (uma vez só).
- Novo `components/sections/OptimizationShowcase.tsx`: componente Client que junta o título/etiquetas (textos idênticos aos de antes) com o painel, só para compartilhar o estado de hover — passar o mouse numa das 4 etiquetas de metodologia (Estrutura do perfil/Conteúdo/Reputação/Presença local) destaca os módulos correspondentes nos dois painéis, sem alterar as etiquetas em si.
- **Bug real corrigido durante o QA**: um `useEffect` com `setState` síncrono (usado para pular a animação com `prefers-reduced-motion`) foi acusado pelo lint (`react-hooks/set-state-in-effect`, risco de cascata de renders); resolvido computando o "gate" de animação como `startedInView || reduced` direto no render, sem efeito. Duas partes do componente ainda usavam o padrão antigo de omitir elementos condicionalmente com base em `reduced` (mesma classe de bug de hidratação já documentada nas seções anteriores) — corrigidas para sempre renderizar os mesmos elementos, variando só o `animate`.

**Git/GitHub**
- Git e GitHub CLI não estavam instalados na máquina — instalados via `winget` a pedido do usuário. Repositório local inicializado (`git init`), identidade configurada, dois commits feitos localmente cobrindo todo o trabalho desde o início do projeto.
- **Pendência real**: o *push* para `https://github.com/EricAugusto93/Site360-filmes.git` não pôde ser concluído — precisa de `gh auth login` (login interativo via navegador), que só o usuário pode fazer na própria máquina. Os commits estão seguros localmente, aguardando autenticação para serem enviados.

---

## 15. Roadmap das próximas etapas

> Cada etapa é validada com o usuário antes de iniciar a seguinte (ver [CHECKLIST.md](./CHECKLIST.md)).

### FASE 01 — Setup do projeto

- **Objetivo**: preparar o esqueleto técnico funcional.
- **Implementar**: inicialização do Next.js + TypeScript, Tailwind configurado com os tokens da seção 6, ESLint/Prettier, estrutura de pastas da seção 4, `layout.tsx` básico, página em branco rodando localmente.
- **Arquivos/componentes**: `package.json`, `next.config.ts`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`.
- **Critério de aceite**: `npm run dev` sobe a aplicação sem erros; lint/build passam; estrutura de pastas da seção 4 criada (mesmo com arquivos vazios/stub onde ainda não há conteúdo).

### FASE 02 — Design system e componentes de UI base

- **Objetivo**: construir os blocos visuais reutilizáveis antes de montar seções de conteúdo.
- **Implementar**: `Container`, `SectionHeading`, `CTAButton` (primário/secundário), `Card`, `TrustIndicator`, `ScrollReveal`, tokens de cor/tipografia validados visualmente em uma página de teste.
- **Arquivos/componentes**: `components/ui/*`.
- **Critério de aceite**: componentes renderizam corretamente em mobile/desktop, estados de foco/hover visíveis, sem warnings de acessibilidade básica.

### FASE 03 — Layout global e SEO base

- **Objetivo**: header, footer, botão flutuante de WhatsApp e metadata.
- **Implementar**: `Header`, `Footer`, `WhatsAppFloatingButton` (com link placeholder), metadata (`title`, `description`, OG), `robots.ts`/`sitemap.ts`.
- **Arquivos/componentes**: `components/layout/*`, `components/ui/WhatsAppFloatingButton.tsx`, `app/layout.tsx` (metadata), `app/robots.ts`, `app/sitemap.ts`.
- **Critério de aceite**: botão de WhatsApp fixo não cobre conteúdo em mobile; meta tags visíveis no `view-source`; header/footer responsivos.

### FASE 04 — Hero + Problema

- **Objetivo**: primeira dobra e seção de dor, primeiras impressões da jornada.
- **Implementar**: `Hero.tsx` (headline aprovada, subheadline, CTA principal/secundário, prova visual discreta, indicador de confiança) e `ProblemSection.tsx`.
- **Arquivos/componentes**: `components/sections/Hero.tsx`, `components/sections/ProblemSection.tsx`.
- **Critério de aceite**: headline exata do playbook presente como `h1`; CTAs disparam evento de analytics (mock/console por ora); reveal on scroll funcionando na seção de problema.

### FASE 05 — Diagnóstico Google 360 (núcleo da conversão)

- **Objetivo**: implementar o wizard interativo completo.
- **Implementar**: `DiagnosticSection`, `DiagnosticWizard`, `diagnosticReducer`, `ProgressBar`, os 5 `steps/*`, integração com `lib/whatsapp.ts`.
- **Arquivos/componentes**: `components/diagnostic/*`, `lib/whatsapp.ts`, `lib/types.ts`.
- **Critério de aceite**: fluxo completo funcional (avançar/voltar/validar/concluir) em mobile e desktop; barra de progresso reflete etapa real; ao concluir, gera corretamente o link do WhatsApp com os dados preenchidos; acessível via teclado.

### FASE 06 — Metodologia e Processo

- **Objetivo**: construir autoridade/confiança (seções 4 e 5 do playbook).
- **Implementar**: `MethodologySection` ("como analisamos sua empresa"), `ProcessTimeline` ("o que acontece depois do diagnóstico").
- **Arquivos/componentes**: `components/sections/MethodologySection.tsx`, `components/sections/ProcessTimeline.tsx`.
- **Critério de aceite**: conteúdo reflete os critérios do playbook sem revelar "fórmula secreta"; timeline legível em mobile (empilhada) e desktop (horizontal ou vertical, a definir na implementação).

### FASE 07 — Solução (Otimização + NFC + Relatório + Manual)

- **Objetivo**: apresentar a oferta completa.
- **Implementar**: `SolutionSection`, `NfcShowcase`, `ReportShowcase`, `PlaybookManual`, com estrutura pronta para receber fotos/mockups reais (placeholders neutros até lá).
- **Arquivos/componentes**: `components/sections/SolutionSection.tsx`, `NfcShowcase.tsx`, `ReportShowcase.tsx`, `PlaybookManual.tsx`.
- **Critério de aceite**: seções renderizam com placeholders claramente temporários (sem dado inventado apresentado como real); fácil trocar placeholder por imagem real depois (via `public/images/`).

### FASE 08 — Provas sociais e FAQ

- **Objetivo**: reduzir objeções finais antes da conversão.
- **Implementar**: `SocialProofSection` (estrutura vazia/pronta, sem inventar depoimentos), `FAQSection` com as 4 objeções do playbook.
- **Arquivos/componentes**: `components/sections/SocialProofSection.tsx`, `components/sections/FAQSection.tsx`.
- **Critério de aceite**: FAQ cobre as 4 objeções com o tom definido no playbook; social proof não exibe nenhum número/depoimento fictício.

### FASE 09 — CTA final e integração real do WhatsApp

- **Objetivo**: fechar a jornada e ativar o número real (quando fornecido).
- **Implementar**: `FinalCTA.tsx`, conferir todos os pontos de disparo do WhatsApp, trocar placeholder pelo número real via variável de ambiente.
- **Arquivos/componentes**: `components/sections/FinalCTA.tsx`, `.env.local`.
- **Critério de aceite**: todos os CTAs (Hero, floating, diagnóstico, final) abrem o WhatsApp corretamente com a mensagem certa para cada contexto.

### FASE 10 — Auditoria de SEO, acessibilidade e performance

- **Objetivo**: validar contra os critérios definidos nas seções 10/11 deste documento.
- **Implementar**: ajustes finais de `alt`, contraste, foco, lazy loading, compressão de imagem; rodar Lighthouse/axe.
- **Arquivos/componentes**: ajustes pontuais em todos os componentes conforme relatório de auditoria.
- **Critério de aceite**: Lighthouse mobile com Performance/Acessibilidade/SEO ≥ 90; zero erros críticos no axe DevTools.

### FASE 11 — Analytics/Tracking real

- **Objetivo**: conectar GA4/GTM reais (quando IDs forem fornecidos) e validar disparo de todos os eventos da seção 12.
- **Implementar**: substituir placeholders de `NEXT_PUBLIC_GTM_ID`, validar eventos no GTM Preview/GA4 DebugView.
- **Arquivos/componentes**: `lib/analytics.ts`, `app/layout.tsx`.
- **Critério de aceite**: todos os 5 eventos da seção 12 disparam corretamente e aparecem no GA4 DebugView.

### FASE 12 — QA final, testes A/B (setup) e deploy

- **Objetivo**: preparar para tráfego pago real.
- **Implementar**: revisão cross-device/cross-browser, checklist final da seção 10 do playbook (item "CHECKLIST PARA O WEB DESIGNER"), configuração inicial de teste A/B (ex. via feature flag simples ou variantes de conteúdo), deploy em produção.
- **Arquivos/componentes**: revisão geral; configuração de deploy (Vercel).
- **Critério de aceite**: checklist do playbook 100% atendido; página publicada e acessível no domínio de produção; UTMs testadas end-to-end.
