# 🛒 Loja Web

> Frontend SPA (Single Page Application) para o e-commerce **Loja API**. Desenvolvido com **React 19**, **TypeScript** e **Tailwind CSS 4**, focando em performance, escalabilidade, testabilidade (TDD) e arquitetura limpa (Feature-Sliced Design).

<p align="left">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-State-764ABC?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/TanStack_Query-Cache-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Vitest-TDD-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Tests-37_passing-2ea44f?style=for-the-badge" alt="37 testes" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT" />
</p>

---

## 📖 Sobre o projeto

Esta é a interface do e-commerce **Loja API** (backend em Java/Spring Boot). O projeto abandona a estrutura "flat" tradicional e adota o **Feature-Sliced Design (FSD)** para organizar o código por domínios de negócio.

O grande diferencial deste frontend é a aplicação de **TDD (Test-Driven Development)** desde o primeiro commit. A lógica de negócio (como a Store de autenticação e componentes de UI) é testada antes mesmo da interface existir.

🔗 **Backend do projeto:** [Loja API (Java + Spring Boot)](https://github.com/AlvesCosta08/loja-api)

---

## ✨ Funcionalidades Implementadas

- ✅ **Autenticação completa** (Login, Cadastro e Logout)
- ✅ **Persistência de Sessão** com JWT (validação via `/users/me` no reload)
- ✅ **Proteção de Rotas** (`ProtectedRoute`, `GuestRoute` e `AdminRoute`)
- ✅ **Interceptor Axios** para injeção automática do Bearer Token e tratamento global de erros 401
- ✅ **Catálogo de Produtos** com React Query (paginação e busca sincronizada com a URL)
- ✅ **Detalhes do Produto** com imagem, descrição, estoque e preço
- ✅ **Carrinho de Compras** persistente (adicionar, atualizar quantidade, remover itens)
- ✅ **Checkout** com cálculo de frete via CEP e criação de pedido
- ✅ **Pagamento** (Pix com QR Code + Cartão de Crédito)
- ✅ **Histórico de Pedidos** com status, data e detalhes dos itens
- ✅ **Painel Administrativo** — Dashboard, Pedidos, Produtos e Usuários
- ✅ **F5-Safe Payment** — recupera o pagamento em andamento após reload sem gerar duplicata
- ✅ **UI/UX Profissional** com Tailwind CSS 4, Toasts (Sonner), Lazy Loading e Feedback visual
- ✅ **37 testes automatizados** (Vitest + Testing Library)

---

## 🏗️ Arquitetura (Feature-Sliced Design)

### Estrutura de pastas

```text
src/
├── app/                  # Configuração global da aplicação
│   ├── providers/        # QueryClient, Sonner
│   ├── router/           # Rotas com Lazy Loading e Suspense
│   └── App.tsx           # Componente raiz com Bootstrapper (Auth)
├── shared/               # O que é genérico e reutilizável
│   ├── components/       # UI (Button, Layout, Spinner)
│   │   ├── layout/       # Header, Footer, Layout
│   │   └── ui/           # Button, Input, etc.
│   ├── lib/              # Axios configurado, Utils, test-utils
│   └── types/            # Tipagens globais da API (DTOs)
└── features/             # Domínios de negócio
    ├── auth/             # Login, Cadastro, Store (Zustand), API e Guards
    ├── cart/             # Carrinho (API, Página, Controles)
    ├── checkout/         # Finalização de compra (CEP, Frete)
    ├── home/             # Página inicial (Landing Page)
    ├── orders/           # Histórico e detalhes de Pedidos
    ├── payments/         # Pix e Cartão (PayOrder, Polling)
    ├── products/         # Catálogo, Detalhes, API e Cards
    ├── shipping/         # API de cálculo de frete
    └── admin/            # Dashboard, Pedidos, Produtos, Usuários
```

### Fluxo de uma compra

```text
Carrinho (CartPage)
    │
    ▼
Checkout (CheckoutPage) ──► POST /orders (cria pedido)
    │
    ▼
PayOrder (PayOrderPage) ──► POST /payments (gera Pix)
    │                        │
    │                        ▼
    │                  QR Code + código copiável
    │                        │
    │                        ▼
    │                  Polling (usePaymentPolling)
    │                        │
    │                        ▼
    │                  GET /payments/{id} (a cada 3s)
    │                        │
    │                        ▼
    │                  Status = CONFIRMED?
    │                        │
    │                        ▼
    └──────────────────► OrderDetail (Pedido Pago)
```

### Fluxo de Autenticação (JWT)

```text
Login (LoginPage)
    │
    ▼
POST /auth/login ──► TokenResponse
    │
    ▼
useAuthStore.setAuth() ──► localStorage.setItem('loja_token')
    │
    ▼
Interceptor Axios ──► Authorization: Bearer <token>
    │
    ▼
Reload da página ──► useAuthBootstrap
    │
    ▼
GET /users/me ──► Revalida o token
    │
    ├── Válido ──► Mantém sessão
    └── Inválido ──► clearAuth() → redireciona para /login
```

### Fluxo do Carrinho e Cache

```text
Adicionar ao Carrinho
    │
    ▼
POST /cart/items ──► invalida cache do React Query ['cart']
    │
    ▼
CartPage ──► GET /cart (recarrega o carrinho atualizado)
    │
    ▼
Checkout ──► POST /orders ──► invalida cache do carrinho
    │
    ▼
PayOrder ──► POST /payments ──► polling até CONFIRMED
```

---

## 🛠️ Stack

| Camada | Tecnologia |
|--------|------------|
| **Framework** | React 19 + Vite 6 |
| **Linguagem** | TypeScript 5.6 |
| **Estilização** | Tailwind CSS 4 (plugin `@tailwindcss/vite`) |
| **Estado Global** | Zustand |
| **Server State** | TanStack Query (React Query) |
| **HTTP Client** | Axios + interceptors |
| **Rotas** | React Router 7 + `ProtectedRoute`/`GuestRoute`/`AdminRoute` |
| **Formulários** | React Hook Form + Zod |
| **Toasts** | Sonner |
| **Testes** | Vitest + Testing Library |
| **Build** | Vite |
| **Arquitetura** | Feature-Sliced Design (FSD) |
| **Deploy previsto** | Vercel / Netlify |

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js 20 LTS** ou superior
- **Backend rodando** em `http://localhost:8080`

### 1. Clonar o repositório

```bash
git clone https://github.com/AlvesCosta08/loja-web.git
cd loja-web
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Edite se necessário:
# VITE_API_URL=http://localhost:8080
```

### 4. Rodar o dev server

```bash
npm run dev
```

Acesse **http://localhost:5173**.

### 5. Rodar os testes

```bash
npx vitest run          # 37 testes (single run)
npx vitest              # modo watch
npx vitest --ui         # interface gráfica
```

### 6. Build de produção

```bash
npm run build           # gera a pasta dist/
npm run preview         # preview do build
```

---

## ⚙️ Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_URL` | URL base da API backend | `http://localhost:8080` |

---

## 📁 Estrutura do projeto

```text
loja-web/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── README.md
├── index.html
└── src/
    ├── main.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── app/
    │   ├── App.tsx
    │   ├── providers/AppProviders.tsx
    │   └── router/index.tsx
    ├── shared/
    │   ├── components/
    │   │   ├── layout/Layout.tsx
    │   │   └── ui/Button.tsx
    │   ├── lib/
    │   │   ├── axios.ts
    │   │   └── test-utils.tsx
    │   └── types/api.ts
    └── features/
        ├── auth/
        │   ├── api/api.ts
        │   ├── components/ProtectedRoute.tsx
        │   ├── components/GuestRoute.tsx
        │   ├── components/AdminRoute.tsx
        │   ├── hooks/useAuthBootstrap.ts
        │   ├── pages/Login.tsx
        │   ├── pages/Register.tsx
        │   └── store.ts
        ├── products/
        │   ├── api/api.ts
        │   ├── components/ProductCard.tsx
        │   └── pages/ProductList.tsx, ProductDetail.tsx
        ├── cart/
        │   ├── api/api.ts
        │   └── pages/Cart.tsx
        ├── checkout/
        │   └── pages/Checkout.tsx
        ├── orders/
        │   ├── api/api.ts
        │   └── pages/OrderList.tsx, OrderDetail.tsx
        ├── payments/
        │   ├── api/api.ts
        │   ├── hooks/usePaymentPolling.ts
        │   └── pages/PayOrder.tsx
        ├── shipping/api/api.ts
        └── admin/
            ├── api/api.ts
            ├── components/AdminLayout.tsx
            └── pages/AdminDashboard.tsx, AdminOrders.tsx, AdminProducts.tsx, AdminUsers.tsx
```

---

## 🧪 Testes

A suíte cobre **37 cenários** distribuídos em **14 arquivos**:

| Suite | Testes | Cobertura |
|-------|-------:|-----------|
| `auth/store.test.ts` | 3 | Login, logout, persistência |
| `auth/components/AdminRoute.test.tsx` | 3 | Guards de admin |
| `shared/components/ui/Button.test.tsx` | 3 | Variantes e estados |
| `products/components/ProductCard.test.tsx` | 2 | Render, preço |
| `products/pages/ProductDetail.test.tsx` | 1 | Detalhes |
| `payments/api/api.test.ts` | 4 | Pix, cartão, consulta, F5-safe |
| `payments/hooks/usePaymentPolling.test.tsx` | 3 | Polling contínuo, stop em CONFIRMED, disabled |
| `payments/pages/PayOrder.test.tsx` | 5 | Tabs, geração Pix, F5-safe, pedido pago, pagamento confirmado |
| `orders/pages/OrderDetail.test.tsx` | 4 | Render, botão pagar, status, erro |
| `admin/pages/AdminDashboard.test.tsx` | 2 | Cards, loading |
| `admin/pages/AdminOrders.test.tsx` | 2 | Lista, alterar status |
| `admin/pages/AdminProducts.test.tsx` | 2 | Lista, restock |
| `admin/pages/AdminUsers.test.tsx` | 2 | Lista, alterar role |
| `admin/api/api.test.ts` | 1 | Dashboard |
| **Total** | **37** | ✅ todos passando |

```bash
# Roda a suíte inteira
npx vitest run

# Roda um arquivo específico
npx vitest run src/features/payments

# Roda em modo watch
npx vitest
```

**TDD aplicado:** Cada fase começou com um teste que falhava (`🔴 RED`), seguido da implementação mínima (`🟢 GREEN`) e refatoração (`🔵 REFACTOR`).

---

## 🗺️ Roadmap

| # | Fase | Status |
|---|------|:------:|
| 0 | Setup Vite + React + Tailwind + CORS + Layout base | ✅ |
| 1 | Roteamento + guards + interceptor JWT (Axios) | ✅ |
| 2 | Autenticação (login, cadastro, `/users/me`) | ✅ |
| 3 | Catálogo de produtos (lista, busca, filtros, paginação) | ✅ |
| 4 | Detalhe do produto + adicionar ao carrinho | ✅ |
| 5 | Carrinho (add, update, remove, total) | ✅ |
| 6 | Checkout (endereço, frete, criação de pedido) | ✅ |
| 7 | Pagamento (Pix com QR, cartão) | ✅ |
| 8 | Meus pedidos (lista + detalhe) | ✅ |
| 9 | Painel admin (produtos, pedidos, usuários, dashboard) | ✅ |
| 10 | Deploy + integração com backend em produção | 🔴 Pendente |

**Progresso:** 9/11 fases concluídas · 37 testes verdes.

---

## 🧠 Decisões técnicas

| Decisão | Por quê |
|---------|---------|
| **Feature-Sliced Design (FSD)** | Evita acoplamento, escala por domínio de negócio |
| **React 19 + Vite 6** | Fast refresh, build rápido |
| **Tailwind CSS 4** via plugin Vite | Zero-config, tokens via `@theme` |
| **TanStack Query** para server state | Cache, retry, invalidação declarativa |
| **Zustand** para client state | Store de auth e carrinho — simples, sem `Provider` |
| **Axios + interceptors** | Injeção automática de Bearer + tratamento global de 401 |
| **`ProtectedRoute` / `GuestRoute` / `AdminRoute`** | Guards declarativos por role/sessão |
| **Sincronização de busca/paginação na URL** | Compartilhável, back/forward funcionam |
| **Bootstrapper no `App.tsx`** | Valida token via `/users/me` antes de renderizar |
| **React Hook Form + Zod** | Validação schema-first, alinhada com Bean Validation |
| **Sonner** para toasts | Acessível, empilhável, sem CSS extra |
| **Lazy Loading + Suspense** | Reduz bundle inicial |
| **F5-safe payments** (`GET /payments?orderId=`) | Recupera o QR Pix sem gerar duplicata |
| **Polling com `usePaymentPolling`** | Atualiza o status do pagamento a cada 3s até CONFIRMED |
| **`localStorage` para JWT** *(provisório)* | Simples — **revisar antes de produção** (XSS) |
| **Vitest + Testing Library** | Mesma API do Jest, integração nativa com Vite |
| **`@/` alias** | Imports limpos, refatoração sem caminhos relativos |
| **Evento `auth:logout` global** | Desacopla o interceptor Axios da store de auth |

---

## 🔒 Segurança

- Token **JWT** em `localStorage` *(provisório — migrar para `httpOnly cookies` antes de prod)*
- **Interceptor Axios** remove o token em 401 e redireciona para login
- **Guards** de rota por role (`AdminRoute`)
- **Validação de formulário** via Zod (nunca confiando no backend)
- **Sanitização de exibição** (produtos e inputs usam React, que escapa por padrão)
- **Nenhuma chave secreta no bundle** — apenas `VITE_API_URL` (pública)

---

## ⚠️ Pendências conhecidas

- **`localStorage` para JWT** — vulnerável a XSS. Para produção, migrar para `httpOnly cookies` + CSRF.
- **`AdminProducts` usa `productApi.list`** (público) para listar todos. Backend poderia ter um endpoint `GET /admin/products` paginado.
- **Falta `OrderDetail` mostrar o status de pagamento** (hoje só mostra o status do pedido).
- **Sem cobertura E2E** (Playwright) — apenas unit/integration com Vitest.
- **Sem Sentry / observabilidade** no frontend.
- **Deploy ainda não configurado** (Vercel/Netlify + CORS prod no backend).

---

## 🤝 Contribuindo

1. Faça um **fork** do projeto
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Escreva **primeiro o teste** (TDD)
4. Implemente até o teste passar
5. Rode `npx vitest run` (tudo verde antes de commitar)
6. Commit no padrão **Conventional Commits**: `git commit -m 'feat: adiciona X'`
7. Push e abra um **Pull Request**

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](./LICENSE) para mais detalhes.

---

## 👤 Autor

**Alves Costa**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/alves74)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/AlvesCosta08)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:alvescosta74@gmail.com)

---

<div align="center">

Se este projeto te ajudou, considere dar uma ⭐!

</div>