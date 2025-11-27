# Gerenciador de Tarefas - Next.js 15 com Testes Unitários

Aplicação de gerenciamento de tarefas desenvolvida com Next.js 15, TypeScript e testes unitários usando Jest e Testing Library.

## 🚀 Funcionalidades

- ✅ **Listagem de Tarefas**: Exibe tarefas vindas de um arquivo simulado (API mock)
- ✅ **Adicionar Tarefas**: Formulário controlado para adicionar novas tarefas
- ✅ **Contador de Tarefas**: Hook personalizado para contar tarefas totais, completas e pendentes
- ✅ **Server Components**: Carregamento de dados no servidor
- ✅ **Client Components**: Interatividade no cliente
- ✅ **Testes Unitários**: Cobertura completa dos principais componentes

## 📁 Estrutura do Projeto

```
tarefas-app/
├── app/
│   └── page.tsx                 # Server Component principal
├── components/
│   ├── NovaTarefa.tsx          # Client Component - Formulário
│   ├── ListaTarefas.tsx        # Client Component - Lista
│   ├── ContadorTarefas.tsx     # Client Component - Estatísticas
│   └── GerenciadorTarefas.tsx  # Client Component - Orquestrador
├── hooks/
│   └── useContadorDeTarefas.ts # Hook personalizado
├── lib/
│   ├── types.ts                # Tipos TypeScript
│   └── tarefas.ts              # API simulada
└── __tests__/
    ├── NovaTarefa.test.tsx
    ├── ListaTarefas.test.tsx
    ├── GerenciadorTarefas.test.tsx
    └── useContadorDeTarefas.test.ts
```

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Jest** - Framework de testes
- **Testing Library** - Testes de componentes React
- **React 19** - Biblioteca de UI

## 🌐 Site Publicado

Acesse a aplicação em produção: [https://tarefas-app.vercel.app](https://tarefas-app.vercel.app)

## 🔄 CI/CD Pipeline

Este projeto utiliza GitHub Actions para integração contínua e deploy automatizado.

### Pipeline de CI/CD

O arquivo `.github/workflows/main.yml` configura a seguinte pipeline:

1. **Instalação de dependências** (`npm ci`)
2. **Linting** (`npm run lint`)
3. **Testes** (`npm run test`)
4. **Build** (`npm run build`)
5. **Deploy para Vercel** (automático após push na branch `main`)

### Configuração do Secret VERCEL_TOKEN

Para habilitar o deploy automatizado para Vercel, é necessário configurar o secret `VERCEL_TOKEN`:

1. Acesse [Vercel Account Settings](https://vercel.com/account/tokens)
2. Crie um novo token com nome descritivo (ex: `github-actions`)
3. No repositório GitHub, vá em **Settings > Secrets and variables > Actions**
4. Clique em **New repository secret**
5. Nome: `VERCEL_TOKEN`
6. Valor: cole o token gerado na Vercel
7. Clique em **Add secret**

### Triggers

- **Push na branch `main`**: Executa CI completo + Deploy para Vercel
- **Pull Request para `main`**: Executa apenas CI (lint, test, build)

## 📦 Instalação

As dependências já foram instaladas durante a criação do projeto.

## 🏃 Como Executar

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### Build de Produção

```bash
npm run build
npm start
```

### Executar Testes

```bash
# Executar todos os testes
npm test -- --maxWorkers=2

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 🧪 Testes Implementados

### 1. Hook `useContadorDeTarefas`
- ✅ Retorna contador correto para lista de tarefas
- ✅ Retorna zeros quando a lista está vazia
- ✅ Recalcula quando as tarefas mudam
- ✅ Conta corretamente quando todas as tarefas estão completas

### 2. Componente `NovaTarefa`
- ✅ Renderiza o formulário corretamente
- ✅ Permite digitar no campo de input
- ✅ Exibe erro quando título está vazio
- ✅ Exibe erro quando título tem menos de 3 caracteres
- ✅ Chama callback ao submeter com dados válidos
- ✅ Limpa o input após submissão
- ✅ Remove espaços do título (trim)
- ✅ Remove mensagem de erro ao digitar novamente
- ✅ Possui atributos de acessibilidade corretos
- ✅ Atualiza aria-invalid quando há erro

### 3. Componente `ListaTarefas`
- ✅ Renderiza todas as tarefas da lista
- ✅ Exibe mensagem quando não há tarefas
- ✅ Renderiza o título da lista
- ✅ Exibe a data de criação de cada tarefa
- ✅ Exibe o status correto (Completa/Pendente)
- ✅ Renderiza o número correto de itens
- ✅ Aplica estilo de riscado em tarefas completas
- ✅ Não aplica riscado em tarefas pendentes

### 4. Componente `GerenciadorTarefas`
- ✅ Renderiza a lista de tarefas iniciais
- ✅ Renderiza o contador de tarefas
- ✅ Renderiza o formulário de nova tarefa
- ✅ Adiciona nova tarefa quando o formulário é submetido
- ✅ Atualiza o contador ao adicionar nova tarefa
- ✅ Exibe mensagem quando não há tarefas
- ✅ Exibe estatísticas zeradas quando não há tarefas
- ✅ Adiciona nova tarefa no topo da lista
- ✅ Exibe a data de criação das tarefas
- ✅ Exibe o status correto das tarefas

## 🎯 Conceitos Aplicados

### App Router (Next.js 15)
- Server Components para carregamento de dados
- Client Components para interatividade
- Separação clara entre lógica de servidor e cliente

### Testes Unitários
- **renderHook**: Teste isolado de hooks personalizados
- **render**: Renderização de componentes
- **screen**: Queries para encontrar elementos
- **fireEvent/userEvent**: Simulação de interações
- **waitFor**: Espera por mudanças assíncronas

### Boas Práticas
- Componentes reutilizáveis
- Tipagem forte com TypeScript
- Formulários controlados
- Validação de entrada
- Acessibilidade (ARIA)
- Separação de responsabilidades

## 📊 Cobertura de Testes

Execute `npm run test:coverage` para ver o relatório de cobertura completo.

## 🎨 Interface

A aplicação possui:
- Design moderno com Tailwind CSS
- Gradiente de fundo azul
- Cards com sombras e bordas arredondadas
- Estatísticas coloridas (azul, verde, amarelo)
- Formulário validado com mensagens de erro
- Lista de tarefas com status visual
- Responsivo e acessível

## 📝 Notas de Implementação

### Simulação de API
Os dados são simulados localmente usando `Promise.resolve()`, imitando uma chamada de API real.

### Hook Personalizado
O `useContadorDeTarefas` demonstra como criar e testar hooks personalizados de forma isolada.

### Validação
O formulário valida:
- Campo não pode estar vazio
- Mínimo de 3 caracteres
- Remove espaços em branco (trim)

### Testes
Os testes cobrem:
- Renderização de elementos
- Interação do usuário
- Validação de formulários
- Atualização de estado
- Hooks personalizados
- Acessibilidade

## 🤝 Contribuindo

Este é um projeto educacional demonstrando conceitos de testes unitários em Next.js 15.

## 📄 Licença

MIT
