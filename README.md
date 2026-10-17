# 🛒 Loja Web

Frontend SPA (Single Page Application) para o e-commerce **Loja API**. Desenvolvido com as práticas mais modernas do mercado, focando em performance, escalabilidade, testabilidade (TDD) e arquitetura limpa.

## 🚀 Tecnologias Utilizadas

- **Core:** React 19 + TypeScript + Vite
- **Estilização:** Tailwind CSS 4
- **Roteamento:** React Router 7 (com Lazy Loading)
- **Estado Global:** Zustand
- **Server State / Cache:** TanStack Query (React Query)
- **HTTP Client:** Axios (com interceptors para JWT e tratamento de erro)
- **Formulários:** React Hook Form + Zod (validação de esquema)
- **Feedback Visual:** Sonner (Toasts)
- **Testes:** Vitest + React Testing Library (TDD)

## 🏗️ Arquitetura (Feature-Sliced Design)

O projeto abandona a estrutura "flat" tradicional (`components`, `pages`, `hooks`) e adota o padrão **Feature-Sliced Design**, muito utilizado em grandes empresas para evitar acoplamento e facilitar a escalabilidade.

```text
src/
├── app/                  # Configuração global, Providers e Rotas
├── shared/               # Componentes UI, Hooks e Utils genéricos
├── features/             # Domínios de negócio (onde a mágica acontece)
│   ├── auth/             # Login, Cadastro, Store, API de Autenticação
│   ├── home/             # Página inicial
│   └── products/         # Catálogo e detalhes (em desenvolvimento)

```

✅ Progresso do Roadmap
☑ Fase 0: Setup Vite, Tailwind 4, Axios e Arquitetura Base.
☑ Fase 1: Autenticação (Login, Cadastro, JWT, Zustand, Guards de Rota).
□ Fase 2: Catálogo de Produtos (Lista, Busca e Paginação).
□ Fase 3: Detalhes do Produto e Carrinho.
□ Fase 4: Checkout e Pagamentos (Pix/Cartão).
□ Fase 5: Painel Administrativo.