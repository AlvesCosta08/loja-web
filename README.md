# 🛒 Loja Web

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)

Frontend SPA (Single Page Application) para o e-commerce **Loja API**. Desenvolvido com as práticas mais modernas do mercado, focando em performance, escalabilidade, testabilidade (TDD) e arquitetura limpa.

## 📑 Sumário

1. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
2. [Arquitetura (Feature-Sliced Design)](#-arquitetura-feature-sliced-design)
3. [Pré-requisitos](#-pré-requisitos)
4. [Como executar o projeto](#-como-executar-o-projeto)
5. [Testes (TDD)](#-testes-tdd)
6. [Progresso do Roadmap](#-progresso-do-roadmap)

---

## 🚀 Tecnologias Utilizadas

- **Core:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS 4
- **Roteamento:** React Router 7 (com Lazy Loading)
- **Estado Global:** Zustand
- **Server State / Cache:** TanStack Query (React Query)
- **HTTP Client:** Axios (com interceptors para JWT e tratamento de erro global)
- **Formulários:** React Hook Form + Zod (validação de esquema)
- **Feedback Visual:** Sonner (Toasts)
- **Testes:** Vitest + React Testing Library (TDD)
- **Linter:** Oxlint (Rust-based, ultra-rápido)

---

## 🏗️ Arquitetura (Feature-Sliced Design)

O projeto abandona a estrutura "flat" tradicional (`components`, `pages`, `hooks`) e adota o padrão **Feature-Sliced Design**, muito utilizado em grandes empresas para evitar acoplamento e facilitar a escalabilidade.

```text
src/
├── app/                  # Configuração global, Providers e Rotas
│   ├── providers/        # React Query, Sonner, etc.
│   ├── router/           # Definição de rotas com Lazy Loading
│   └── App.tsx           # Componente raiz com Bootstrapper de Auth
├── shared/               # O que é genérico e reutilizável
│   ├── components/       # UI (Button, Layout), Layouts
│   ├── lib/              # Axios, Utils, Setup de Testes
│   └── types/            # Tipagens globais da API (DTOs)
└── features/             # Domínios de negócio (onde a mágica acontece)
    ├── auth/             # Login, Cadastro, Store (Zustand), API e Guards
    ├── home/             # Página inicial
    └── products/         # Catálogo e detalhes (em desenvolvimento)