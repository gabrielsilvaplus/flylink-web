# FlyLink Web 🚀

> Uma interface rápida, componentizada e focada em conversão para um encurtador de URLs moderno.

[![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A ideia aqui não foi só fazer "mais um tela de CRUD". O objetivo desse front-end foi aplicar uma mentalidade de **Product Engineer**: a performance, a acessibilidade e a experiência de quem usa importam tanto quanto o código por trás. 

Usei esse projeto como laboratório para arquiteturas escaláveis e padrões consolidados do mercado (como o Feature-Sliced Design adaptado).

---

## 💻 Tech Stack (e os "porquês")

Não sou fã de adicionar bibliotecas por hype. Toda a stack foi pensada para resolver um problema real:

* **React + TypeScript (via Vite):** O feijão com arroz bem feito. Vite pelo tempo de build ridículo e TS para evitar dor de cabeça com bugs bobos de tipagem em runtime.
* **TanStack Router:** Roteamento 100% type-safe. Se uma rota mudar ou um parâmetro não for passado, meu build trava antes de ir pra produção.
* **TanStack Query (React Query):** Ninguém merece ficar gerenciando `isLoading` e `isError` na mão o tempo todo. Usei para gerenciar o state do servidor (cache, retry automático e invalidação após mutações).
* **Axios + Interceptors:** Configurei a instância do Axios com JSDoc para lidar globalmente com o token JWT. Recebeu `401 Unauthorized`? A sessão é invalidada na hora em todas as abas.
* **Orval:** Geração automática das tipagens da API e dos hooks (via OpenAPI/Swagger do back-end). Se o back end mudar o contrato, o front quebra no build. Zero surpresas.
* **Tailwind CSS + Shadcn UI:** Velocidade na estilização sem perder o controle do HTML/CSS (Acessibilidade garantida com a biblioteca Radix-UI).

---

## 🏗️ Estrutura do Projeto

Eu gosto de uma estrutura onde as coisas que mudam juntas, moram juntas. Em vez de entalhar tudo em pastas genéricas como `pages`, separei a lógica por domínios da aplicação (Features):

```text
src/
├── api/             # Código gerado automaticamente pelo Orval (Ouro puro!)
├── components/      # Componentes burros e genéricos (Botões, Inputs, UI básica limitados a exibição)
├── features/        # O core do app. Módulos que agrupam seus próprios componentes e contexto (auth, urls)
├── lib/             # Utils e instâncias globais isoladas (axios)
└── routes/          # Definição e mapeamento estrito das rotas (via TanStack Router)
```

---

## ⚡ Features Principais

- **Autenticação Resiliente:** Sincronização automática entre abas do navegador via persistência local controlada (Store).
- **Encurtador Dinâmico e QR Code:** Gere seu link, compartilhe-o facilmente e obtenha estatísticas.
- **Micro-interações de UI:** Animações sutis e Dark Mode natural integrado para uma primeira impressão limpa.
- **Tratamento de Erros:** O interceptor lida no momento em que um token morre. O `react-query` pega os erros e empurra para a interface de forma coesa sem `try/catch(any)` espalhados.

---

## 🛠️ Como rodar na sua máquina

Certifique-se de que o **Bun** esteja instalado. É com ele que eu rodo esse projeto (nada de npm travando, por favor).

```bash
# Clone the repository
git clone https://github.com/gabrielsilvaplus/flylink-web.git

# Navigate to the directory
cd flylink-web

# Install dependencies (ultra fast with bun)
bun install

# Start the development server
bun run dev
```

> **Aviso de API:** Para o app funcionar perfeitamente em dev, seu backend FlyLink API local deve estar rodando para bater as chamadas, devido ao proxy ou aos enpoints já mapeados.
