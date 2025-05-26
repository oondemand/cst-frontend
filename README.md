# CST-Frontend

![GitHub stars](https://img.shields.io/github/stars/oondemand/cst-backend)
![GitHub issues](https://img.shields.io/github/issues/oondemand/cst-backend)
![GitHub license](https://img.shields.io/github/license/oondemand/cst-backend)
[![Required Node.JS >=18.0.0](https://img.shields.io/static/v1?label=node&message=%20%3E=18.0.0&logo=node.js&color=3f893e)](https://nodejs.org/about/releases)

## Índice

- [1. Visão Geral do Projeto](#1-visão-geral-do-projeto)
- [2. Tecnologias Utilizadas](#2-tecnologias-utilizadas)
- [3. Estrutura de Pastas](#3-estrutura-de-pastas)
- [4. Instalação](#4-instalação)
- [5. Introdução aos módulos](#5-introdução-aos-módulos)
  - [5.1 Criação de novos módulos]()

## 1. Visão Geral do Projeto

O **CST-Frontend** é uma aplicação desenvolvida em **React.js**, que faz parte da plataforma **OonDemand v2**. A aplicação fornece uma interface amigável e responsiva para gerenciar tickets, prestadores de serviço, integrações com o sistema Omie, e outras operações administrativas. O frontend foi desenvolvido para proporcionar uma experiência de usuário fluida e intuitiva, utilizando práticas modernas de desenvolvimento.

## 2. Tecnologias Utilizadas

- **React.js**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Chakra UI**: Biblioteca de componentes acessíveis e estilizados para aplicações React.
- **Axios**: Cliente HTTP para integração com o backend.
- **React Router**: Gerenciamento de rotas e navegação entre páginas.
- **React Hook Form + Zod**: Gerenciamento de formulários e validação com alta performance e integração nativa com TypeScript.
- **TanStack React Table**: Biblioteca poderosa para criação de tabelas altamente customizáveis.
- **TanStack React Virtual**: Renderização virtualizada para listas e tabelas de grande volume.
- **TanStack React Query**: Gerenciamento de estado assíncrono e cache de dados de forma eficiente.

## 3. Estrutura de Pastas

A estrutura de pastas da aplicação segue uma organização por domínio para facilitar o desenvolvimento:

```
src/
├── components/   # Componentes reutilizáveis e isolados da UI
├── config/       # Configurações básicas da aplicação, como React Query, Axios, etc.
├── constants/    # Constantes e valores padrão, como valores iniciais de formulários
├── hooks/        # Hooks personalizados para lógica reutilizável
├── pages/        # Páginas da aplicação, representando rotas principais
├── service/      # Serviços de comunicação com APIs externas
├── styles/       # Estilos globais e personalizados
└── utils/        # Funções utilitárias e esquemas de validação (ex: Zod)
```

## 4. Instalação

### Você vai precisar de:

- [NodeJs (recomendado 18+)](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [CST-Backend](https://github.com/oondemand/cst-backend)

> Para ter acesso de todas as funcionalidades (integração com gpt) da aplicação você também ira precisar configurar alguns serviços locais como [Doc-custom](https://github.com/oondemand/fatura-personalizada-backend) e [Api-integração-gpt](https://github.com/oondemand/api-integracao-gpt)

### Passo a passo

1. Clone esse repositório localmente:

```bash
git clone https://github.com/oondemand/cst-frontend.git
cd cst-frontend
```

2. Instale as dependências

```bash
npm install
```

3. Execute a aplicação:

```bash
npm run dev
```

## 5. Introdução aos módulos

No projeto, chamamos de **módulos** conjuntos estruturados que englobam:

- **Listagem:** Datagrid construído com React Table, com paginação, filtros e edição de linhas processados no backend. O datagrid permite também ajustar o tamanho das colunas e ocultar colunas conforme a necessidade do usuário.
- **Formulário:** Interfaces para criação e edição dos dados, com opção de ocultar campos para personalização e melhor usabilidade.
- **Importação e Exportação:** Funcionalidades opcionais que possibilitam importar ou exportar dados, configuráveis por módulo.

Essa estrutura modular facilita manutenção, reutilização e escalabilidade das funcionalidades da aplicação.

### 5.1. A criação de novos módulos

Módulos seguem a seguinte estrutura de pastas

```
src/
├── importacao/            # Página de importação de dados do módulo (opcional)
├── columns.jsx            # JSON com a definição das colunas disponíveis no datagrid
├── dialog.jsx             # Configurações do diálogo de criação e edição (visibilidade, títulos etc.)
├── formFields.jsx         # JSON com a definição dos campos disponíveis no formulário
└── list.jsx ou index.jsx  # Componente principal do módulo, responsável por renderizar a página
```

Todo módulo tem uma componente raiz que deve ser registrada nos links em **src/components/\_layouts/auth/index.jsx** e **src/router.jsx**

A criação de um novo módulo geralmente começa pelo arquivo **`columns.jsx`**, onde definimos as colunas do `DataGrid`. Nesse arquivo, devemos considerar dois aspectos principais:

#### 🔹 Células Personalizadas (`cells`)

As células são responsáveis por renderizar o conteúdo de cada coluna. Componentes personalizados de célula ficam localizados em:

```
src/components/dataGrid/cells/
```

Eles podem incluir máscaras, formatações e comportamentos específicos, como células editáveis ou exibindo valores formatados (ex: moeda, data, etc.).

#### 🔹 Ações Personalizadas (`actions`)

As ações são componentes com funcionalidades específicas que interagem com os dados, como deletar, visualizar ou duplicar registros. Elas estão localizadas em:

```
src/components/dataGrid/actions/
```

Podem ser utilizadas dentro de colunas do tipo "Ações", normalmente renderizadas por `TableActionsCell`.

#### 📄 Exemplo de `columns.jsx`

```jsx
import { DefaultEditableCell } from "../../components/dataGrid/cells/defaultEditable";
import { TableActionsCell } from "../../components/dataGrid/cells/tableActionsCell";
import { DeleteUsuarioAction } from "../../components/dataGrid/actions/deleteUsuarioButton";

export const makeUsuarioDynamicColumns = () => {
  return [
    {
      accessorKey: "acoes",
      header: "Ações",
      enableSorting: false,
      cell: (props) => (
        <TableActionsCell>
          <DeleteUsuarioAction id={props.row.original?._id} />
        </TableActionsCell>
      ),
    },
    {
      accessorKey: "nome",
      header: "Nome Completo",
      cell: DefaultEditableCell,
      enableColumnFilter: true,
      enableSorting: false,
      meta: { filterKey: "nome" },
    },
  ];
};
```
