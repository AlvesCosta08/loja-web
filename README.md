# 🛒 Loja Web

> Frontend SPA (Single Page Application) para o e-commerce **Loja API**. Desenvolvido com **React 19**, **TypeScript** e **Tailwind CSS 4**, focando em performance, escalabilidade, testabilidade (TDD) e arquitetura limpa.

<p align="left">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zustand-State-764ABC?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/TanStack_Query-Cache-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/Vitest-TDD-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
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
- ✅ **Proteção de Rotas** (`ProtectedRoute`, `GuestRoute` e `AdminRoute` preparado)
- ✅ **Interceptor Axios** para injeção automática do Bearer Token e tratamento global de erros 401
- ✅ **Catálogo de Produtos** com React Query (paginação e cache no client)
- ✅ **Busca de Produtos** sincronizada com a URL (`useSearchParams`)
- ✅ **UI/UX Profissional** com Tailwind CSS 4, Toasts (Sonner) e Feedback visual de loading/erro

---

## 🏗️ Arquitetura (Feature-Sliced Design)

O projeto utiliza a seguinte estrutura para evitar acoplamento e facilitar a escalabilidade:

```text
src/
├── app/                  # Configuração global da aplicação
│   ├── providers/        # React Query, Sonner, Theme
│   ├── router/           # Rotas com Lazy Loading e Suspense
│   └── App.tsx           # Componente raiz com Bootstrapper (Auth)
├── shared/               # O que é genérico e reutilizável (não tem regra de negócio)
│   ├── components/       # UI (Button, Layout, Spinner)
│   │   ├── layout/       # Header, Footer, Layout
│   │   └── ui/           # Button, Input, etc.
│   ├── lib/              # Axios configurado, Utils, Setup de Testes
│   └── types/            # Tipagens globais da API (DTOs)
└── features/             # Domínios de negócio
    ├── auth/             # Login, Cadastro, Store (Zustand), API e Guards
    │   ├── api/          # Chamadas HTTP de autenticação
    │   ├── components/   # ProtectedRoute, GuestRoute
    │   ├── hooks/        # useAuthBootstrap
    │   ├── pages/        # Login, Register
    │   └── store.ts      # Zustand Store
    ├── home/             # Página inicial (Landing Page)
    └── products/         # Catálogo, API, Cards e Detalhes
        ├── api/          # Chamadas HTTP de produtos
        ├── components/   # ProductCard
        └── pages/        # ProductList


```
    🧪 Testes (TDD)
O projeto utiliza a abordagem TDD (Test-Driven Development). Os componentes e lógicas de negócio (como o Zustand Store) são testados antes mesmo da interface existir.

Para rodar a suíte de testes:

bash
# Modo watch (roda e observa mudanças durante o desenvolvimento)
npm run test

# Interface visual do Vitest (Dashboard no navegador)
npm run test:ui
📈 Progresso do Roadmap
☑ Fase 0: Setup Vite, Tailwind 4, Axios e Arquitetura Base.
☑ Fase 1: Autenticação (Login, Cadastro, JWT, Zustand, Guards de Rota).
□ Fase 2: Catálogo de Produtos (Lista, Busca e Paginação).
□ Fase 3: Detalhes do Produto e Carrinho.
□ Fase 4: Checkout e Pagamentos (Pix/Cartão).
□ Fase 5: Painel Administrativo.
