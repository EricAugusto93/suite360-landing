# Checklist de Execução — Landing Page Suite360 Films

> Marcar `[x]` conforme cada item é concluído e validado. Ver detalhes/justificativas em [PLANEJAMENTO.md](./PLANEJAMENTO.md).
> Regra do projeto: cada fase é validada com o usuário antes de iniciar a próxima.

---

## FASE 00 — Análise, Arquitetura e Planejamento

- [x] Análise do ambiente atual (diretório vazio, sem código prévio)
- [x] Leitura e interpretação do playbook estratégico (PDF)
- [x] Definição da stack recomendada
- [x] Arquitetura da aplicação definida
- [x] Estrutura de pastas proposta
- [x] Componentização planejada
- [x] Design system planejado (com pendências sinalizadas)
- [x] Fluxo do diagnóstico planejado
- [x] Estratégia de WhatsApp planejada (sem implementação)
- [x] Estratégia de SEO/acessibilidade planejada
- [x] Estratégia de performance planejada
- [x] Estratégia de analytics planejada
- [x] Dependências necessárias listadas
- [x] Riscos e pendências documentados
- [x] Roadmap das próximas fases criado
- [x] `PLANEJAMENTO.md` e `CHECKLIST.md` criados
- [ ] **Validação do usuário para iniciar a FASE 01**

---

## FASE 01 — Setup do projeto

- [x] Inicializar projeto Next.js + TypeScript (Next.js 16.3.4, React 19.2.8)
- [x] Configurar Tailwind CSS (v4, tokens via `@theme` em `app/globals.css`)
- [x] Configurar ESLint + Prettier (+ plugin Tailwind)
- [x] Instalar Framer Motion (`motion`) e `lucide-react`
- [x] Criar estrutura de pastas (`components/`, `lib/`, `public/`)
- [x] `app/layout.tsx` e `app/page.tsx` básicos
- [x] Configurar fonte (Geist Sans via `next/font/google`)
- [x] Configurar metadata inicial (title/description)
- [x] Confirmar `npm run dev` funcionando sem erros (testado via HTTP, conteúdo renderizado)
- [x] Confirmar `npm run build` sem erros
- [x] Lint sem erros (`npm run lint`)
- [x] TypeScript sem erros (`npm run type-check`)
- [x] Formatação aplicada (`npm run format`)
- [ ] Validação do usuário

---

## FASE 02 — Design system e componentes de UI base

> Conjunto de componentes revisado em relação ao esboço original da FASE 00 (ver PLANEJAMENTO.md, seção 14.1).

- [x] Definir tokens de cor semânticos (background/foreground/muted/muted-foreground/border/primary/primary-foreground/accent/accent-foreground/card/card-foreground/danger) — placeholder até identidade visual real
- [x] Definir escala tipográfica (display/h1/h2/h3/h4/body/small/caption/label) com line-height e letter-spacing, fluida via `clamp()`
- [x] Definir níveis de sombra (`shadow-subtle`/`shadow-medium`/`shadow-elevated`)
- [x] Confirmar border radius (sm/md/lg/xl, já criados na FASE 01)
- [x] Componente `Container`
- [x] Componente `Section` (ritmo vertical + variante de fundo)
- [x] Componente `Button` (primary/secondary/ghost/outline, 3 tamanhos, suporta `href`)
- [x] Componente `Card`
- [x] Componente `Input` (estado de erro, aria-invalid/aria-describedby)
- [x] Componente `Label`
- [x] Componente `Badge`
- [x] Componente `Divider`
- [x] Componente `Progress`
- [x] Componente `IconButton` (`aria-label` obrigatório)
- [x] Componente `ScrollReveal` (wrapper de animação, respeita `prefers-reduced-motion`)
- [x] Base de animações (`lib/motion.ts`: fade, fade-up, scale)
- [x] Utilitário `lib/cn.ts` (merge de classNames, sem dependência externa)
- [x] Página de demonstração dev-only (`app/dev/design-system`, `noindex`)
- [x] Teste visual dos componentes em mobile e desktop (screenshots via Playwright, dev e produção)
- [x] Lint sem erros, TypeScript sem erros, build funcionando
- [ ] Validação do usuário

---

## FASE 03 — Layout global e SEO base

> `WhatsAppFloatingButton` foi removido do escopo desta fase por instrução explícita (integração com WhatsApp fica para fase futura). Ver PLANEJAMENTO.md, seção 14.3.

- [x] Componente `Header` (marca tipográfica provisória, sem navegação/CTA ainda — nada para linkar nesta fase)
- [x] Componente `Footer` (estrutura pronta para links legais e dados institucionais, ambos vazios até existir conteúdo real)
- [x] Componente `Logo` compartilhado (Header/Footer), isolado para troca futura por logo real
- [x] Layout global (`app/layout.tsx`): Header + `<main>` + Footer, `<main>` único por página
- [x] Metadata: title, description, Open Graph, Twitter card (`summary_large_image`), robots, canonical
- [x] `viewport`/`themeColor` explícitos
- [x] `app/opengraph-image.tsx` (imagem OG gerada por código, sem asset de design real)
- [x] `app/robots.ts` e `app/sitemap.ts`
- [x] `lib/site.ts` + `.env.example` (`NEXT_PUBLIC_SITE_URL`, domínio ainda pendente)
- [ ] `WhatsAppFloatingButton` — **fora do escopo desta fase**, adiado
- [ ] Aviso de privacidade/cookies no rodapé (LGPD) — pendente de decisão do usuário, não implementado
- [x] Estrutura semântica revisada (um único `<main>`, `<header>`/`<footer>` corretos, sem `<div>` no lugar de tags semânticas)
- [x] Verificação visual desktop e mobile (Header/Footer, home e página de dev)
- [x] Lint, type-check, format check e build sem erros
- [ ] Validação do usuário

---

## FASE 04 — Hero + Problema

- [x] `Hero.tsx`: headline aprovada (texto intacto), subheadline nova, CTA principal (`#diagnostico`) + CTA secundário tratado (desabilitado, sem WhatsApp inventado)
- [x] `HeroVisual.tsx`: composição conceitual abstrata (aneis + 5 "satélites"), sem dado/métrica inventada, sem imitar UI do Google
- [x] Indicador de confiança discreto no Hero (linha de texto com ícones, não badges grandes)
- [x] `ProblemSection.tsx` com headline "Seu perfil pode estar afastando clientes sem você perceber."
- [x] Lista editorial de 5 problemas (não grid de cards) — mesmas 5 dimensões do HeroVisual
- [x] Transição narrativa para o Diagnóstico (pergunta implícita, sem formulário fake)
- [x] Header revisado: CTA "Diagnóstico gratuito" → `#diagnostico`, mantido minimalista
- [x] `ScrollReveal` estendido com `trigger="mount"` e `delay` (entrada em sequência no Hero) — mudança compatível com uso existente
- [x] Animações de entrada/reveal (mount para Hero, viewport para Problema), respeitando `prefers-reduced-motion`
- [x] Testar responsividade mobile (390px)/tablet (820px)/desktop (1440px) — bug de overflow horizontal no `HeroVisual` mobile encontrado e corrigido (ver PLANEJAMENTO.md, seção 14.4)
- [x] Lint, type-check, format check e build sem erros
- [ ] Validação do usuário

---

## FASE 05 — Diagnóstico Google 360 (núcleo de conversão)

> `StepCity`/`StepCompanyName` unificados em `TextFieldStep` (parametrizado); `ProgressBar` não virou arquivo próprio (inline no `DiagnosticWizard`, uso único). Ver PLANEJAMENTO.md, seção 14.5.

- [x] `diagnosticReducer` (máquina de estados das 5 etapas + validação centralizada)
- [x] Barra de progresso real ("Etapa X de 5") reaproveitando o `Progress` da FASE 02
- [x] `SegmentStep` (8 cards de segmento + campo condicional "Outro")
- [x] `SizeStep` (Pequena/Média/Grande)
- [x] `TextFieldStep` (Cidade e Empresa, mesmo componente parametrizado)
- [x] `ConfirmationStep` (resumo editável + CTA final tratado sem WhatsApp inventado)
- [x] `OptionCard` (cartão selecionável compartilhado por Segmento/Porte)
- [x] `id="diagnostico"` funcionando — CTAs do Hero e do Header chegam corretamente
- [x] Navegação avançar/voltar/editar sem perder dados (testado)
- [x] Validação de campos obrigatórios com feedback inline (mensagens humanas, testado)
- [x] Transições animadas entre etapas + altura do container animada (`layout`) para não deixar espaço vazio nem pular violentamente
- [x] Foco movido para o heading da nova etapa a cada transição (exceto no carregamento inicial)
- [x] `lib/whatsapp.ts`: `buildDiagnosticMessage` (builder da mensagem) — **sem** gerar link `wa.me` ainda, por decisão explícita desta fase
- [x] `lib/analytics.ts`: `trackEvent` preparado (no-op fora de dev) nos pontos `diagnostic_start` / `diagnostic_step_advance` / `diagnostic_complete` / `diagnostic_whatsapp_submit`
- [x] Testar fluxo completo em mobile (390px)/tablet (820px)/desktop (1440px)
- [x] Testar navegação 100% por teclado (Tab, Enter/Espaço, foco entre etapas)
- [x] Testar `prefers-reduced-motion`
- [x] Testar fluxo "Outro", voltar/preservar dados, editar a partir da confirmação
- [x] Lint, type-check, format check e build sem erros; sem overflow horizontal; sem erros de console
- [ ] Validação do usuário

---

## FASE 06 — Metodologia e Processo

> Componente renomeado: `ProcessTimeline` → `ProcessSection` (mantém padrão de nomenclatura `*Section` das demais seções). Ver PLANEJAMENTO.md, seção 14.6.

- [x] `MethodologySection` ("Como analisamos sua empresa") — 9 critérios do briefing agrupados em 4 blocos temáticos, não 9 cards iguais
- [x] `ProcessSection` ("O que acontece depois do diagnóstico") — timeline vertical conectada, 5 etapas preservadas (recebemos → analisamos → apontamos → conversamos → otimização se fizer sentido)
- [x] Revisar copy para não revelar "fórmula secreta" — nenhuma metodologia proprietária/score/algoritmo inventado
- [x] Comunicar ausência de compromisso automático na seção de Processo (linguagem direta, sem jargão de funil de vendas)
- [x] Transição Diagnóstico → Metodologia (copy de abertura reconhece os dados já informados) sem alterar o funcionamento do diagnóstico
- [x] Preparação narrativa para a futura seção de Solução (etapa 05 do Processo destacada visualmente)
- [x] Server Components (nenhum `"use client"` novo; só o `ScrollReveal` já existente anima)
- [x] Heading hierarchy verificada (1 H1, 4 H2 — nenhum H3 inflado nos itens internos)
- [x] Testar responsividade mobile (390px)/tablet (820px)/desktop (1440px)
- [x] Revisão do fluxo completo da página (Hero → Problema → Diagnóstico → Metodologia → Processo) — narrativa contínua, sem sensação de "seções soltas"
- [x] Lint, type-check, format check e build sem erros; sem overflow horizontal; sem erros de console; `prefers-reduced-motion` respeitado
- [ ] Validação do usuário

---

## FASE 07 — Solução (Otimização + NFC + Relatório + Manual)

> "Manual de boas práticas" ficou inline em `SolutionSection.tsx` (sem `ManualShowcase.tsx` próprio) — visual simples o suficiente para não justificar um arquivo dedicado. Ver PLANEJAMENTO.md, seção 14.7.

- [x] `SolutionSection` — otimização completa posicionada como execução estratégica, não edição de cadastro
- [x] `OptimizationPreview` (diagrama conceitual "antes/depois" sem métricas, sem nota, sem estrelas)
- [x] `NfcShowcase` — placeholder estilizado (ícone + forma), claramente não fotográfico, com legenda de honestidade
- [x] `ReportShowcase` — páginas empilhadas abstratas com linhas esqueléticas, nenhum número/posição/gráfico
- [x] Manual de boas práticas — autonomia comunicada explicitamente ("sem depender de nós para tudo")
- [x] Hierarquia visual entre os 4 elementos (Otimização/NFC editorial grande; Relatório/Manual em cards compactos)
- [x] Entrega apresentada como integrada ("Junto com a otimização, você também recebe:" + chips reaproveitados da Metodologia)
- [x] Transição Processo → Solução coerente (segue diretamente da etapa 05 do Processo, sem alterar `ProcessSection`)
- [x] Confirmar que nenhum placeholder parece dado real — varredura automatizada por termos/símbolos proibidos (%, R$, "primeiro lugar", "garantido" etc.) sem ocorrências
- [x] Nenhum preço/plano/parcelamento implementado
- [x] Server Components (nenhum novo `"use client"`; só `ScrollReveal` já existente anima)
- [x] Testar responsividade mobile (390px)/tablet (820px)/desktop (1440px) — bug de espaçamento nos cards Relatório/Manual encontrado e corrigido
- [x] Lint, type-check, format check e build sem erros; sem overflow horizontal; sem erros de console; `prefers-reduced-motion` respeitado
- [ ] Validação do usuário

---

## FASE 08 — Provas sociais e FAQ

> Novo componente reutilizável: `components/ui/Accordion.tsx` (`AccordionItem`), não estava na lista original. Ver PLANEJAMENTO.md, seção 14.8.

- [x] `SocialProofSection` — composição editorial curta (sem cards vazios/placeholder), explica honestamente que evidências reais virão depois
- [x] Categorias de evidência futura apresentadas como rótulos, claramente não como provas reais (Perfil otimizado / Relatório de entrega / Display NFC / Depoimento autorizado)
- [x] Nenhum depoimento, logo, estrela, número ou nome de cliente fictício — verificado por varredura automatizada
- [x] `FAQSection` com `AccordionItem` acessível (aria-expanded, aria-controls, heading envolvendo o trigger, navegável por Tab/Enter/Espaço)
- [x] `FAQSection`: objeção "Eu mesmo consigo editar meu perfil?" — resposta honesta, não diminui o cliente
- [x] `FAQSection`: objeção "Isso garante primeiro lugar?" — rejeita garantia de ranking explicitamente
- [x] `FAQSection`: objeção "Por que o diagnóstico é gratuito?" — sem menção a "captura de leads" ou urgência falsa
- [x] `FAQSection`: objeção "Vou precisar contratar mensalmente?" — não inventa modelo de mensalidade (segue quase literalmente a redação sugerida na instrução)
- [x] Conteúdo do FAQ presente no HTML real (não só após clique) — confirmado
- [x] Transição Solução → Provas → FAQ coerente, sem quebra narrativa
- [x] Testar responsividade mobile (390px)/tablet (820px)/desktop (1440px)
- [x] Lint, type-check, format check e build sem erros; sem overflow horizontal; sem erros de console; `prefers-reduced-motion` respeitado
- [ ] Validação do usuário

---

## FASE 09 — CTA final e integração real do WhatsApp

> Integração **arquiteturalmente completa e testada**, mas o número oficial da Suite360 ainda não foi fornecido — `NEXT_PUBLIC_WHATSAPP_NUMBER` continua vazio em produção. Todos os CTAs de WhatsApp estão corretamente desabilitados (sem link falso) até essa variável ser configurada. Ver PLANEJAMENTO.md, seção 14.9.

- [x] `FinalCTASection.tsx` — encerra a narrativa, devolve ao `#diagnostico`, sem repetir o formulário
- [x] `WhatsAppFloatingButton` — só aparece com número configurado, some perto do Footer, ícone genérico (não usa logo protegido)
- [x] `lib/whatsapp.ts` centraliza normalização do número, construção da URL (`buildWhatsAppUrl`) e das mensagens (`buildDiagnosticMessage`, `buildSpecialistMessage`) — nenhuma URL montada manualmente em outro lugar
- [x] `components/ui/WhatsAppLinkButton.tsx` e `TrackedCtaLink.tsx` — únicos pontos que decidem "link real vs. desabilitado" e disparam analytics, reaproveitados por Hero/Header/Diagnóstico/CTA final/Floating
- [x] Revisado todos os pontos de disparo do WhatsApp (Hero secundário, Diagnóstico, CTA final secundário, Floating) — todos usam a mesma API central
- [x] `.env.example` documenta `NEXT_PUBLIC_WHATSAPP_NUMBER` sem número real
- [x] **Número real de WhatsApp segue pendente** (aguardando o cliente) — quando fornecido, basta configurar a variável de ambiente; nenhuma mudança de código necessária
- [x] Testado com número de QA temporário (nunca commitado, removido antes de finalizar) — mensagem padrão, caracteres especiais, segmento "Outro", encoding, todos corretos
- [x] Testado sem configuração — nenhum link falso, nenhum botão flutuante, nenhuma mensagem técnica exposta, build funciona normalmente
- [x] Nenhuma persistência de dados criada (sem backend, sem cookie, sem localStorage)
- [x] Nenhum envio automático alegado — clicar apenas abre a conversa com a mensagem preenchida
- [x] Testar responsividade mobile (390px)/tablet (820px)/desktop (1440px)
- [x] Lint, type-check, format check e build sem erros; sem overflow horizontal; sem erros de console; navegação por teclado e `prefers-reduced-motion` verificados
- [ ] Validação do usuário

---

## FASE 10 — Auditoria Global, UX, Performance, SEO e Acessibilidade

> Auditoria, não reconstrução: só foram alterados pontos com problema identificável. Ver PLANEJAMENTO.md, seção 14.10.

- [x] Auditoria de ritmo vertical, densidade e hierarquia visual — nenhum problema identificado, nenhuma mudança
- [x] Auditoria de consistência do design system (tokens, componentes, Client/Server boundary) — codebase já consistente, nenhuma mudança necessária
- [x] Robustez de conteúdo animado sem JavaScript/JS lento: classe estável `.motion-reveal` + fallback global via `<noscript>` (opacidade/transform forçados) + H1 do Hero sem `ScrollReveal` (risco de LCP) + limiar de `whileInView` reduzido (0.3 → 0.15)
- [x] `/dev/design-system` retorna 404 real em produção (`notFound()` condicionado a `NODE_ENV`), sem afetar `next dev`
- [x] Página 404 customizada (`app/not-found.tsx`), com a mesma identidade visual e CTA de volta à Home
- [x] JSON-LD avaliado e implementado de forma mínima e segura: apenas `WebSite` (nome + URL). `Organization` avaliado e **rejeitado** — exigiria endereço/telefone/logo/redes sociais reais, nenhum disponível
- [x] Meta description revisada para mencionar explicitamente "Perfil da Empresa no Google"
- [x] Auditoria de contraste (WCAG AA): `color-contrast` do Lighthouse/axe encontrou 2 problemas reais — `--s360-muted-foreground` (~4.39:1 sobre `--s360-muted`) escurecido para `#64646d` (~5.3:1); modificador arbitrário `text-muted-foreground/70` no Hero (3:1) removido
- [x] Rodar Lighthouse (produção, desktop) — Performance 96–100, Acessibilidade 100 (após o fix de contraste), Best Practices 100, SEO 100 — variação de Performance entre execuções é ruído do ambiente local (processos concorrentes), não regressão de código
- [x] Auditoria de dependências (`package.json`) — nenhuma dependência não utilizada encontrada
- [x] Auditoria de `prefers-reduced-motion`, tab order, landmarks, heading hierarchy (1 H1), formulários, no-JS — revalidados, sem regressão
- [x] Regressão completa do Diagnóstico e do FAQ — sem problemas
- [x] Auditoria do WhatsApp configurado (número de QA temporário, nunca commitado) e não configurado — ambos corretos
- [x] Overflow horizontal e responsividade real (320/390/820/1440px) — sem problemas
- [x] Repetição de honestidade/claims (sem dados fictícios) — revalidado, sem ocorrências
- [x] Scripts e pacotes de QA temporários (Playwright, Lighthouse) removidos; `package.json`/`package-lock.json` confirmados intactos
- [x] Lint, type-check, format check e build de produção sem erros no estado final
- [ ] Validação do usuário

---

## FASE 11 — Analytics, Eventos, Consentimento e Preparação LGPD

> `diagnostic_step_advance` e `diagnostic_whatsapp_submit` (planejados originalmente na FASE 00) foram substituídos por `diagnostic_step_complete` e por `whatsapp_click(source="diagnostic")` — taxonomia menor e mais consistente, ver PLANEJAMENTO.md, seção 14.11.

- [x] Camada central de eventos tipada em `lib/analytics.ts` (`trackEvent`, nomes/propriedades validados em tempo de compilação via `EventParamsMap`) — nenhum componente chama `dataLayer.push`/`gtag` diretamente
- [x] `@next/third-parties` instalado como dependência real (não é ferramenta de QA) — `<GoogleTagManager>` é o único mecanismo de carregamento de script de terceiros
- [x] `diagnostic_start` — dispara na 1ª interação efetiva com o diagnóstico (selecionar/digitar), nunca no mount ou por entrar na viewport
- [x] `diagnostic_step_complete` — dispara a cada etapa validada (`step`: segment/size/city/company), nunca com o valor digitado
- [x] `diagnostic_complete` — dispara 1x ao chegar à confirmação; guardado por ref para não duplicar se o visitante editar e voltar
- [x] `cta_click` — `source` (header/hero/final_cta/not_found) + `destination` (diagnostic/home), tipados
- [x] `whatsapp_click` — `source` (hero/final_cta/floating/diagnostic), tipado; nunca indica "mensagem enviada"
- [x] `diagnostic_step_back` avaliado e **não implementado** — não agregava informação de UX nova além do que já é visível pela ausência dos eventos de avanço seguintes
- [x] **Vazamento de dados corrigido**: `ConfirmationStep` enviava `segment`/`city` como propriedades do evento de WhatsApp (herdado da FASE 09) — removido; nenhum dado de input (empresa/cidade/segmento/mensagem/número) é enviado ao analytics, confirmado por inspeção de payload em QA
- [x] `page_view` manual **não implementado** — GA4 (quando configurado dentro do GTM) já mede pageview automaticamente; evita duplicidade
- [x] UTMs — nenhuma captura/atribuição própria construída; GTM/GA4 já leem `utm_*` da URL nativamente (decisão explícita para evitar sistema de atribuição próprio sem necessidade)
- [x] `NEXT_PUBLIC_GTM_ID` (`.env.example`, vazio) — sem configuração, nenhum script carrega, nenhum request a `googletagmanager.com`, nenhum erro
- [x] GTM escolhido como estratégia única (GA4 deve ser configurado dentro do container GTM futuramente, não como integração paralela)
- [x] `AnalyticsProvider` — componente isolado (`app/layout.tsx` continua Server Component)
- [x] Banner de consentimento (`ConsentBanner`) — só renderiza se `NEXT_PUBLIC_GTM_ID` estiver configurado E o visitante ainda não escolheu; Aceitar/Rejeitar com peso visual igual, sem dark pattern; GTM só carrega após "Aceitar"; escolha persistida em `localStorage` (nunca dados do diagnóstico)
- [x] Google Consent Mode avaliado e **não implementado** — depende do desenho real do container GTM que ainda não existe; implementar agora seria uma simulação incompleta
- [x] Política de privacidade **não inventada** — Footer já tinha (desde a FASE 03) um mecanismo de `legalLinks` pronto para receber o link real quando o texto jurídico existir
- [x] QA sem configuração: sem script GTM, sem banner, sem erros, comportamento idêntico
- [x] QA com configuração temporária (ID de teste, nunca commitado): banner, aceitar/rejeitar, persistência, disparo de todos os eventos e ausência de dados proibidos verificados via captura de `dataLayer` (21 checks automatizados)
- [x] Acessibilidade do banner (teclado, foco, `role`/`aria-label`, não bloqueia o resto da página, mobile) testada
- [x] Performance reavaliada — Acessibilidade/Best Practices/SEO mantidos em 100; variação de Performance (82–97) isolada e confirmada como ruído de carga da máquina local via teste A/B (com e sem `AnalyticsProvider`), não regressão de código
- [x] SEO sem regressão (canonical/JSON-LD/robots/sitemap inalterados)
- [x] Lint, type-check, format check e build de produção sem erros
- [x] Nenhum ID real ou fictício commitado; `package.json`/`package-lock.json` confirmados sem Playwright/Lighthouse (ferramentas de QA temporárias)
- [ ] Validação do usuário

---

## FASE 12 — Produção, Deploy e Substituição dos Ativos Provisórios

> O escopo desta fase (auditoria de produção/deploy) substituiu o escopo originalmente esboçado na FASE 00 para "FASE 12" (QA final, teste A/B, deploy). Os itens abaixo refletem o que foi de fato instruído e executado; cross-browser real, cross-device real e setup de teste A/B **não fazem parte desta fase** e seguem como pendências separadas (ver final desta seção).

- [x] Auditoria completa de configuração de produção (envs, URLs, metadata, sitemap, robots, OG, WhatsApp, GTM, consentimento, rotas de dev, build) — sem redesenho de componentes
- [x] `lib/env.ts` criado — validação mínima de `NEXT_PUBLIC_SITE_URL` (URL válida) e `NEXT_PUBLIC_GTM_ID` (formato `GTM-XXXXXXX`); um valor ausente ou malformado cai com segurança no mesmo fallback de "não configurado", sem quebrar a aplicação (confirmado via QA: build/página funcionam normalmente com valores inválidos)
- [x] `lib/site.ts` — aviso no log do servidor (nunca no cliente) quando `NEXT_PUBLIC_SITE_URL` está ausente/inválida em produção, para o problema ficar visível a quem opera o deploy
- [x] `.env.example` revisado: `NEXT_PUBLIC_SITE_URL` deixou de usar `https://www.example.com` como valor de exemplo preenchido e passou a ficar vazio (mesmo padrão dos outros dois), evitando qualquer risco de ir para produção sem ser trocado
- [x] Canonical/OG/sitemap/robots confirmados dependentes só de `siteUrl` (nenhum hardcode); `/dev/` continua bloqueado no `robots.ts` e a rota real retorna 404 em produção (FASE 10)
- [x] **Identidade visual oficial**: nenhuma mudança (não existe ainda) — pontos de substituição futura mapeados e documentados (PLANEJAMENTO.md, seção 14.12): `app/globals.css` (tokens), `app/layout.tsx` (`themeColor`), `app/opengraph-image.tsx` (cores hardcoded, necessário pois `ImageResponse` não acessa CSS), `components/layout/Logo.tsx` (texto → `<Image>`), `app/favicon.ico` (arquivo)
- [x] **Favicon**: confirmado ser o favicon padrão do `create-next-app` (25.931 bytes, não é uma marca provisória da Suite360) — documentado como pendência técnica, não substituído por nada gerado artificialmente
- [x] **NFC/Relatório**: nenhuma foto/asset real inventado; documentado formato/proporção/quantidade recomendados (ver PLANEJAMENTO.md, seção 14.12)
- [x] **Copy de produção revisada** — 3 ocorrências de linguagem "de pipeline interno" removidas da interface pública (nunca inventando prova/ativo no lugar): `NfcShowcase`/`ReportShowcase` (legendas não prometem mais substituição futura) e `SocialProofSection` (parágrafo reescrito como padrão de evidência, não como "ainda não temos")
- [x] **CTA de WhatsApp sem número configurado**: no Hero e no CTA Final, o botão secundário deixou de aparecer desabilitado com "disponível em breve" — agora é omitido (o CTA principal do diagnóstico continua sendo o único caminho visível). Na Confirmação do diagnóstico, o botão permanece (é o único CTA daquela etapa) mas com legenda neutra ("indisponível no momento") em vez de expor um roteiro de lançamento
- [x] `package.json`: `engines.node` adicionado (`>=20.9.0`, espelhando o mínimo real do próprio Next.js — não um valor arbitrário); nenhuma dependência atualizada só por existir versão mais nova
- [x] `npm audit`: 0 vulnerabilidades
- [x] Nenhum `console.log`/`console.debug` fora de `lib/analytics.ts` (já condicionado a `NODE_ENV !== "production"` desde a FASE 11); nenhum TODO/FIXME, `any` ou `@ts-ignore` no código do projeto
- [x] `.gitignore` já correto (herdado do scaffold do `create-next-app`): `.env*` ignorado exceto `.env.example`, `.next/`, `.vercel`, etc. — nenhuma mudança necessária
- [x] Deploy target: Vercel (nativo, sem `vercel.json` customizado — nenhuma configuração especial identificada como necessária)
- [x] Build/start confirmados funcionando só com dependências declaradas (`npm install && npm run build && npm run start`)
- [x] `DEPLOY.md` criado — guia curto de configuração/deploy
- [x] Testes de produção sem nenhuma integração configurada E com configuração temporária (WhatsApp + GTM, nunca commitados) — aprovados, ver PLANEJAMENTO.md seção 14.12
- [x] Performance/Acessibilidade/SEO reavaliados (Acessibilidade/Best Practices/SEO = 100; Performance com a mesma variação por ruído de máquina já identificada na FASE 11 — não é regressão)
- [x] Lint, type-check, format check e build de produção sem erros
- [x] Scripts/pacotes de QA temporários removidos; `package.json`/`package-lock.json` confirmados intactos
- [ ] Revisão cross-browser real (Chrome/Safari/Firefox em navegadores reais) — **fora do escopo desta fase**, pendente
- [ ] Revisão cross-device real (dispositivo físico, não só emulador) — **fora do escopo desta fase**, pendente
- [ ] Setup de teste A/B — **fora do escopo desta fase**, pendente
- [ ] Deploy real em produção — **não executado nesta fase por instrução explícita**
- [ ] Validação do usuário

---

## FASE 13 — Identidade Visual Oficial + Redesign Premium (framer.com como benchmark)

> Nota: entre a FASE 12 e esta, o usuário pediu duas rodadas de redesign visual fora do fluxo de fases numeradas (dark theme, depois retorno a tema claro premium) — documentadas em `PLANEJAMENTO.md`, seções 14.13/14.14. Esta FASE 13 é a instrução formal seguinte, aplicando a logo oficial e a paleta definitiva (preto/branco/cinza + azul elétrico) sobre essa base.

- [x] Logo oficial (`public/brand/suite360-logo.png`) aplicada via `next/image` em `components/layout/Logo.tsx` — arquivo fornecido tinha um defeito de exportação real (área opaca branca maior que o desenho), corrigido de forma não-destrutiva (pixels quase-brancos tornados transparentes + corte para o conteúdo real); nenhum pixel do desenho alterado
- [x] Logo testada em 320/360/390/820/1440px — sem esmagar o Header em nenhuma largura
- [x] Logo testada sobre fundo escuro (composição de teste) — confirmado que NÃO funciona (bordas antialiadas desenhadas para fundir com branco); mantida só em superfícies claras (Header/Footer), nenhum filtro CSS usado para falsificar uma variante — registrado como pendência real de asset
- [x] Teal provisório (`#0f4c4c`) removido por completo dos tokens (`app/globals.css`) — busca confirmou zero resíduos
- [x] Nova paleta aplicada via tokens: preto/branco/cinza dominantes (`--s360-background/foreground/muted/border`), azul elétrico (`--s360-primary: #0066ff`) como accent funcional
- [x] Contraste recalculado e verificado matematicamente antes de aplicar — achado real corrigido: `--s360-accent-foreground` precisou de um azul mais escuro (`#0052cc`) que `--s360-primary` para passar AA como texto sobre `--s360-accent`
- [x] Tipografia mantida (Geist) — só a escala (tamanhos/tracking/line-height) já havia sido ampliada na rodada anterior, dentro do pedido desta fase também
- [x] Header refinado (translúcido + blur sutil + logo oficial), sem virar navbar cheia de links
- [x] Hero elevado: 1 efeito de fundo sutil (halo azul 5% opacidade) + preservação total da copy aprovada
- [x] HeroVisual refinado: 2 indicadores orbitando os anéis em rotação extremamente lenta (100-140s), `useReducedMotion` desliga por completo, testado
- [x] Buttons refinados: feedback por mudança de cor (não elevação, "preciso, não fofinho"), `active:scale-[0.98]`, radius 10px, sombra mínima
- [x] Diagnóstico, OptionCards, Progress, Inputs — automaticamente herdam a nova paleta (arquitetura de tokens semânticos); estados de selected/foco/erro revalidados
- [x] Metodologia/Processo/Solução/NFC/Relatório/FAQ/Provas revalidados visualmente — sem "card soup", sem glow, sem azul em excesso
- [x] CTA Final tratado como encerramento forte (bloco `Section variant="inverted"`, criado na rodada anterior, mantido)
- [x] Footer refinado — logo oficial integrada, minimalista
- [x] `--shadow-glow` (halo neon, herdado da rodada dark-theme) removido por completo — proibido explicitamente por esta fase ("glow azul", "glow exagerado")
- [x] Radius recalibrado por categoria (botões 10px, cards 20px, showcases 28px) — inconsistência pré-existente (`rounded-2xl` fora da escala de tokens) corrigida de passagem em `NfcShowcase.tsx`
- [x] Favicon genérico do `create-next-app` removido (testado: logo real ilegível em 32x32, nenhum símbolo isolado adequado) — `icons: { icon: "data:," }` evita o 404 de `/favicon.ico` sem inventar substituto
- [x] Open Graph atualizado: logo oficial + paleta nova + composição minimalista
- [x] Theme color atualizado para a paleta nova (`#fbfbfa`)
- [x] Bug real encontrado e corrigido durante a QA (não visual): guard `isFirstRender` booleano em `DiagnosticWizard.tsx` quebrava sob o double-invoke de efeitos do React Strict Mode (dev only), causando scroll automático até o Diagnóstico no carregamento da página; corrigido com comparação de valores, robusto a qualquer número de reexecuções
- [x] QA funcional completa: diagnóstico (voltar/editar/validação), FAQ, WhatsApp configurado/não configurado, consentimento, analytics, teclado, `prefers-reduced-motion` — 31 checks automatizados, todos aprovados
- [x] QA técnico: lint, type-check, format check e build de produção sem erros; sem overflow em 320/360/390/820/1440px; sem erros de console
- [x] Lighthouse em produção: Performance 96, Acessibilidade 100, Best Practices 100, SEO 100 — sem regressão (achado real corrigido no caminho: o favicon removido gerava um 404 que derrubava Best Practices para 96, resolvido antes de finalizar)
- [x] Skills `redesign-existing-projects` e `design-taste-frontend` usadas proativamente como checklist de qualidade (pedido explícito do usuário)
- [x] `CHECKLIST.md`/`PLANEJAMENTO.md` atualizados (seção 14.15)
- [ ] Validação do usuário

---

## Trabalho fora do fluxo de fases — Reformulação visual profunda, radar do Hero e painel de otimização

> Ver PLANEJAMENTO.md, seção 14.17, para o detalhamento completo.

- [x] Estrutura de depoimentos (`TestimonialWheel`) — pronta para receber conteúdo real, vazia no estado entregue
- [x] Base de tokens invertida para dark-by-default (`app/globals.css`) — causa raiz de "a página ainda parece branca" identificada e corrigida
- [x] Container ampliado (1360px) e escala tipográfica revisada com `clamp()`
- [x] Ícones técnicos próprios (`ProblemIcons.tsx`, `MethodologyIcons.tsx`) substituindo Lucide-em-círculo
- [x] Campo "Estado" adicionado ao diagnóstico (6 etapas, sigla + nome completo, limpa a Cidade ao trocar, `ConfirmationStep` atualizado)
- [x] Hero: radar tecnológico (núcleo + ondas + 5 sinais fixos) substituindo a composição de órbitas original
- [x] Hero: camada de pins de localização implementada e depois **revertida** a pedido do usuário (mantido só núcleo/ondas/sinais)
- [x] Hero: feixe de varredura giratório removido; ondas pulsantes reforçadas; núcleo com "G" (letra genérica, sem ativo oficial)
- [x] Hero: fundo em gradiente diagonal verde-azulado/teal (desktop) e vertical (mobile), com fade nas bordas
- [x] Bug real corrigido: texto do H1 pintado atrás do fundo por uma regra de empilhamento CSS (`position: static` vs `position: absolute`) — `Container` do Hero recebeu `position: relative` local
- [x] `OptimizationPreview.tsx` totalmente reformulado (janela de análise com 7 módulos/painel, núcleo de transformação, linhas de conexão, revelação animada) — sem métricas/números inventados
- [x] `OptimizationShowcase.tsx` criado — hover nas 4 etiquetas de metodologia destaca os módulos correspondentes no painel
- [x] Bug real corrigido: `setState` síncrono em `useEffect` (acusado pelo lint) e 2 pontos remanescentes do padrão de hidratação insegura
- [x] Lint, type-check e build sem erros em cada etapa; sem overflow horizontal; `prefers-reduced-motion` testado
- [x] Git/GitHub CLI instalados; repositório local inicializado; 2 commits locais criados
- [ ] Push para `github.com/EricAugusto93/Site360-filmes.git` — **bloqueado**, aguardando `gh auth login` do usuário
- [ ] Validação do usuário

---

## Trabalho fora do fluxo de fases — Redesign Diagnóstico/Sinais de Alerta + GitHub/Vercel

> Repositório novo criado e conectado à Vercel para permitir preview/deploy real durante o redesign (`EricAugusto93/suite360-landing`, produção em `https://suite360-landing.vercel.app`). Trabalho conduzido em etapas curtas, cada uma com validação visual/funcional antes de avançar para a próxima, mesmo fora da numeração de FASEs.

- [x] Bug real corrigido: efeito "ondas" sobre os cards da seção Sinais de Alerta — `blur`/opacidade do Header no estado com scroll eram fracos demais (`bg-background/70` deixava ~30% do conteúdo rolado transparecer, borrado); corrigido para `bg-background/95` + `backdrop-blur-xl`
- [x] Repositório GitHub criado (`github.com/EricAugusto93/suite360-landing`, remoto `github-new`), commit e push realizados
- [x] Deploy em produção na Vercel (projeto `suite360films/suite360-landing`) — live em `https://suite360-landing.vercel.app`

**Diagnóstico (console do wizard) — ETAPAS 1-5:**

- [x] ETAPA 1 — Auditoria somente-leitura completa da seção antes de qualquer alteração
- [x] ETAPA 2 — Cabeçalho/atmosfera reformulados (eyebrow + régua + pill dinâmico via `DIAGNOSTIC_STEP_IDS.length`, grid técnico/glow/circuito externos)
- [x] ETAPA 3 — Console analítico (chrome "Análise guiada") + `SegmentedProgress.tsx` criado (progresso em blocos discretos, substitui a barra contínua no wizard)
- [x] ETAPA 4A — Opções/estado selecionado/navegação (`OptionCard`, `SegmentStep`, `SizeStep`, `DiagnosticWizard`): indicador de check, superfícies com profundidade, aviso "leva menos de 2 minutos"
- [x] ETAPA 4B — Select/campos de texto/confirmação (`StateStep`, `TextFieldStep`, `ConfirmationStep`): superfícies premium via overrides `!important`, ícones contextuais derivados do `fieldId`, grid de revisão na confirmação
- [x] ETAPA 5 — Auditoria final de animação: `STEP_TRANSITION` ajustada de 0.18s para 0.45s; glow do progresso corrigido (gradiente→cor sólida, CSS não interpola cor↔gradiente); guard `isTransitioningRef` contra duplo-disparo em Avançar/Voltar/Editar
- [ ] Limitação residual documentada (não corrigida, fora do escopo de "correção mínima"): raro dessincronismo de pintura do Chromium/Motion na barra decorativa do console, reproduzido só sob interação mais rápida que ritmo humano realista (≤800ms entre ações) — decorativo, baixa severidade

**Sinais de Alerta (bento de 5 cards) — ETAPAS 6-9:**

- [x] ETAPA 6 — Cabeçalho/atmosfera no mesmo vocabulário editorial já aprovado na Metodologia/Diagnóstico
- [x] ETAPA 7 — Arquitetura dos 5 cards: numeração dinâmica (`String(index+1).padStart(2,"0")`), faixa "ATENÇÃO", hierarquia tipográfica por índice, marcas de canto a partir de `lg`
- [x] ETAPA 8A — `ProblemVisuals.tsx` criado: 5 microvisualizações analíticas distintas, uma por card, escolhidas por índice (nenhuma métrica/número/percentual real); 2 bugs reais corrigidos (clipping mobile por colisão de classes `h-full`/`h-[Npx]`; overflow horizontal real de ~124px em 1024px por coluna de texto de largura fixa)
- [x] ETAPA 8B — Refinamento de escala/contraste das 5 microvisualizações e reequilíbrio do espaço vazio do card 1 (grupo icone+texto+visual centralizado verticalmente em vez de ancorado nos extremos)
- [x] ETAPA 9 — Animações de entrada: cabeçalho em sequência (linha editorial → título → descrição), cards com stagger por índice e direção alternada no mobile (01 direita, 02 esquerda, 03 direita, 04 esquerda, 05 direita), sequência de entrada própria por microvisualização (`ProblemVisuals.tsx` convertido para Client Component, mesmo padrão de `MethodologyVisuals.tsx`), `prefers-reduced-motion` completo, auditoria funcional/visual final (8 breakpoints, reload no meio da seção, scroll rápido/lento, `once:true` confirmado)

- [x] Lint, type-check e build de produção sem erros em cada etapa das duas seções
- [x] Commit único (`91635ae`) cobrindo Diagnóstico + Sinais de Alerta, enviado ao GitHub (`github-new`) e implantado em produção na Vercel
- [ ] Validação do usuário

---

## Trabalho fora do fluxo de fases — Fundo mobile, Display NFC premium e atualização de logo

> Trabalho conduzido em etapas curtas com validação visual antes de cada avanço, como nas rodadas anteriores. Tudo abaixo está no commit `c2154cf` ("Add premium NFC display, mobile ambient background, and logo update"), já enviado ao GitHub (`github-new`) e implantado em produção na Vercel (`https://suite360-landing.vercel.app`).

**Fundo mobile, espaçamentos e fade lateral — ETAPAS 1-5** (commit anterior `134178f`, já em produção antes desta rodada):

- [x] ETAPA 1 — Auditoria somente-leitura da implementação atual do fundo/espaçamentos/fade lateral
- [x] ETAPA 2 — 3 halos lilás mobile-only adicionados ao `AmbientBackground.tsx`
- [x] ETAPA 3 — Padding mobile reduzido (`Section.tsx`/`OptimizationShowcase.tsx`), máscara de fade na atmosfera do Diagnóstico, halos recalibrados
- [x] ETAPA 4 — `direction` do `ScrollReveal` padronizado para `"left"` em 6 seções (mesma direção de entrada lateral em toda a landing)
- [x] ETAPA 5 — **Bug real raiz encontrado e corrigido**: `useIsMobileViewport` (`useSyncExternalStore`) nunca resolvia `true` em automação headless sem outro motivo de rerender — trocado por `useState`+`useEffect`. Segundo bug encontrado por trás do mesmo sintoma: o Motion trava a pose "hidden" no primeiro render e não reaplica ao trocar `variants` depois — corrigido com remount único via `key` em `ScrollReveal.tsx`. Regressão real de overflow horizontal (~4px) causada pela própria correção, identificada e corrigida (`overflow-hidden` faltando em 4 seções)

**Correção do fundo mobile azul/lilás — 3 rodadas de ajuste visual** (a versão aprovada do cliente passou por 3 iterações até ficar correta):

- [x] "Correção conjunta mobile" — campo contínuo azul/lilás substituindo os 3 halos isolados + compactação da Metodologia
- [x] "Ajuste mobile" (2 rodadas) — intensidade/proporção azul-lilás recalibrada (cliente pediu mais presença lilás, depois pediu recuar porque o preto tinha sumido) — resultado final: preto predominante (~55-60%), azul (~25-30%) e lilás (~15-20%) claramente reconhecíveis em cantos/bordas, sem duplicação de camadas
- [x] **Bug real corrigido**: posicionamento de um halo lilás em `ProcessSection.tsx` usava `-translate-x-1/3` (relativo ao próprio tamanho do elemento, não da placa/seção) — deslocamento quase imperceptível; corrigido para o padrão `-translate-x-1/4` já usado nas demais seções
- [x] Limitação documentada (não corrigida, fora do escopo autorizado): duas regiões consecutivas "pretas" na "Janela de análise" (mockup da Otimização, `SolutionSection.tsx`) — superfície de UI deliberadamente escura, fora do escopo do fundo ambiental
- [x] Limitação documentada: redução de altura da Metodologia mobile ficou em ~6-7% (não os ~15-25% inicialmente pedidos) — conteúdo/texto real domina a altura de cada card, e a instrução previa priorizar integridade de conteúdo sobre o percentual exato

**Display NFC premium — ETAPAS 1-5:**

- [x] ETAPA 1 — Auditoria somente-leitura do retângulo azul placeholder original (`NfcShowcase.tsx`)
- [x] ETAPA 2 — `NfcDisplayVisual.tsx` criado: placa de vidro/acrílico, núcleo NFC com anéis/pontos orbitais, 5 estrelas, celular abstrato entrando pela lateral — 100% HTML/CSS/ícones já existentes, sem imagem nova
- [x] Correção 1 — celular ficava oculto abaixo de 640px (`hidden sm:block` removido); "ondas de aproximação" pedidas na Etapa 2 original tinham sido esquecidas, adicionadas
- [x] Correção 2 — celular reconhecível como smartphone em qualquer tela: rotação/geometria refeitas (só ~18px visíveis antes, insuficiente); teto de largura da placa passou de fixo 280px para progressivo (320→400px)
- [x] ETAPA 3 — Refinamento de profundidade/hierarquia (sombra em camadas, glow contido, 1 anel a menos); correção seguinte após reprovação: núcleo ~30% maior, celular com rotação mais acentuada (13°→19°), composição reequilibrada (núcleo deslocado ~8% à esquerda)
- [x] ETAPA 4 — 5 microanimações CSS-only (pulso do núcleo, expansão das ondas, órbita dos pontos, respiração da borda, reflexo deslizante), `prefers-reduced-motion` neutraliza tudo via regra global já existente
- [x] ETAPA 5 — Auditoria final: 7 breakpoints sem overflow, WebKit testado (achado investigado e confirmado como artefato de automação headless — salto instantâneo de scroll, não afeta usuários reais), acessibilidade confirmada (0 elementos focáveis dentro do decorativo, `aria-hidden`/`pointer-events-none` corretos, título/textos/legenda preservados semanticamente)

**Atualização da logo:**

- [x] **Bug real corrigido no arquivo fonte fornecido pelo usuário**: `logo suite.png` tinha um retângulo branco opaco atrás só da palavra "Suite" (resto do arquivo já era transparente) — corrigido via un-matte de alpha (luminância → transparência), sem alterar nenhum pixel do desenho
- [x] "Suite" recolorido de preto para branco (aprovado explicitamente) — ficava ilegível sobre o fundo quase preto do header (`#050505`); depois, a pedido do usuário, restaurado para o preto original sobre chip branco (pixels originais do arquivo fonte, sem reprocessamento)
- [x] Logo ampliada no header (`h-9 sm:h-11` → `h-12 sm:h-14`) a pedido do usuário
- [x] Novo arquivo (`public/brand/suite360-wordmark-v2.png`) aplicado em `Logo.tsx` — lockup completo "Suite360 Films / A nova perspectiva.", não mais só o ícone/wordmark parcial usado até a FASE 13

**QA e deploy (todas as rodadas acima):**

- [x] Lint, TypeScript e build de produção sem erros em cada rodada
- [x] Zero overflow horizontal em todas as validações (320 a 1440px)
- [x] Ferramentas de QA temporárias (Playwright, WebKit) sempre instaladas com `--no-save` e removidas ao final; `package.json`/`package-lock.json` confirmados sem resíduo a cada rodada
- [x] Commit único (`c2154cf`) cobrindo as três frentes acima, revisado arquivo por arquivo antes de commitar (separado corretamente do trabalho de sessões anteriores, `dev-server.log` e um screenshot solto excluídos)
- [x] Push para `github-new` e deploy em produção na Vercel — confirmado ao vivo (HTTP 200, conteúdo novo presente no HTML servido)
- [ ] Validação do usuário

---

## GO-LIVE (pendências externas para o lançamento)

Nenhum destes itens pode ser marcado como concluído pelo código — todos dependem de uma decisão ou material do cliente.

- [ ] Definir domínio oficial
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` no ambiente de produção
- [x] Variante da logo adequada a fundo escuro — resolvido: `public/brand/suite360-wordmark-v2.png` (lockup completo, corrigido para transparência real e texto branco/legível sobre o header quase preto), aplicada em `Logo.tsx`
- [ ] Fornecer um símbolo/monograma isolado adequado a favicon 32×32 (o wordmark atual não cabe legível nesse tamanho) — enquanto isso, nenhum favicon é exibido (removido o genérico do Next.js, de propósito)
- [x] Divergência de nome "Suite" vs. "Suite360 Films" — resolvida: o novo arquivo de logo usa o lockup completo ("Suite360 Films" + "A nova perspectiva."), não mais só o ícone parcial "Suite" da FASE 13
- [x] Fornecer número de WhatsApp Business — `5541991111965` (assumido Brasil/DDD 41; confirmar se estiver errado), testado e funcionando (Hero, botão flutuante, confirmação do diagnóstico)
- [x] Configurar `NEXT_PUBLIC_WHATSAPP_NUMBER` — feito localmente em `.env.local` (nunca commitado, fora do git). **Ainda falta configurar a mesma variável no painel do provedor de hospedagem (Vercel) quando o deploy real acontecer** — ver `DEPLOY.md`
- [ ] Criar/fornecer container GTM
- [ ] Configurar `NEXT_PUBLIC_GTM_ID`
- [ ] Configurar GA4 dentro do GTM
- [ ] Definir Key Events no GA4 (sugestão: `diagnostic_complete`, `whatsapp_click`)
- [ ] Revisar estratégia de Consent Mode (depende do desenho real do container GTM)
- [ ] Aprovar texto jurídico da Política de Privacidade
- [ ] Adicionar link legal ao Footer (`legalLinks` em `Footer.tsx`, mecanismo já pronto)
- [ ] Fornecer fotos reais do Display NFC (ver formato recomendado em `PLANEJAMENTO.md`, seção 14.12)
- [ ] Fornecer material real do relatório de entrega (ver formato recomendado em `PLANEJAMENTO.md`, seção 14.12)
- [ ] Fornecer provas sociais autorizadas (depoimento/logo/case/screenshot)
- [ ] Fornecer/confirmar o ativo oficial do "G" colorido do Google para o núcleo do radar do Hero (hoje é um placeholder — a letra "G" genérica em branco, sem depender de nenhum arquivo) — se a letra genérica for suficiente, este item pode ser fechado sem ativo nenhum
- [ ] Autenticar o GitHub CLI nesta máquina (`gh auth login`) para permitir o `git push` dos commits já feitos localmente para `github.com/EricAugusto93/Site360-filmes.git`
- [ ] Revisão cross-browser e cross-device em ambiente real
- [ ] Fazer QA final no domínio real, após todo o resto acima estar configurado

---

> A antiga seção "Pendências para produção" foi consolidada na seção GO-LIVE acima (mesmos itens, sem duplicação).
