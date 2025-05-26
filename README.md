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
  - [5.1 Criação de novos módulos](#5.1-a-criação-de-novos-módulos)
  - [5.2 Componente principal](#5.2-Componente-principal)
  - [5.3 Formulário](#5.3-formulário)
  - [5.4 Componente principal](#5.4-componente-principal)
- [6. Pontos de melhorias](#6-pontos-de-melhorias)

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

### 5.1 A criação de novos módulos

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

### 5.2 Componente principal

Depois de definir as nossa colunas podemos seguir com o nosso componente principal. E aqui temos alguns aspectos que podemos analisar.

#### DataGrid

Componente responsável por renderizar as informações de cada módulo. Além de acoplar o formulário e ações de exportar e importar.

```jsx
<DataGrid
  // Formulário (opcional)
  form={PrestadoresDialog}
  // Função que sera chamada ao clicar no botão de exportar (opcional)
  exportDataFn={getAllPrestadoresWithFilters}
  // Função chamada ao clicar no botão de importar (nesse caso teremos uma página especifica para lidar com a importação, opcional)
  importDataFn={() => navigate("/prestadores/importacao")}
  // a seguir
  table={table}
  //dados a serem reenderizados
  data={data?.results || []}
  //informações sobre paginação fornecida pelo backend
  rowCount={data?.pagination?.totalItems}
  isDataLoading={isLoading || isFetching}
  //função que será chamada ao editar uma célula do datagrid (opcional)
  onUpdateData={async (values) => {
    await updatePrestador.mutateAsync({
      id: values.id,
      body: values.data,
    });
  }}
/>
```

#### useDataGrid

O hook `useDataGrid` centraliza todas as configurações necessárias para exibir e controlar um `DataGrid`, incluindo paginação, filtros, ordenação e persistência do estado (colunas visíveis, tamanhos etc.).

```jsx
const { filters, table } = useDataGrid({ columns, key: "USUARIOS" });
```

- `columns`: Colunas definidas para o módulo.
- `key`: Identificador único para salvar o estado do grid no `localStorage`.

> 🔒 A `key` é essencial para manter o estado do grid (colunas ocultas, ordem, filtros etc.) entre recarregamentos.

#### Exportação de Dados

O `useDataGrid` também aceita a propriedade `exportModel`, usada para definir o modelo de colunas que será utilizado na exportação dos dados. Isso é útil para reorganizar ou ocultar colunas exportadas sem afetar a visualização do grid.

```jsx
const modeloDeExportacao = [
  {
    accessorKey: "prestador.nome",
    header: "Nome Prestador",
  },
  {
    accessorKey: "prestador.documento",
    header: "Documento Prestador",
  },
  ...columns.filter((e) => e.accessorKey !== "prestador"),
];

const { filters, table } = useDataGrid({
  columns,
  exportModel: modeloDeExportacao,
  key: "DOCUMENTOS_FISCAIS",
});
```

#### Configurações Avançadas

O hook também repassa todas as configurações aceitas pelo `useTable` da biblioteca [`@tanstack/react-table`](https://tanstack.com/table), o que permite controle completo sobre o comportamento do grid.

### 5.3 Criação de formulário

Ao criar um novo formulário, o primeiro passo é definir os campos que estarão disponíveis `formFields.jsx` — assim como fazemos com as colunas no DataGrid. A definição segue a mesma premissa de modularidade e configuração externa.

#### 🔹 Campos Personalizadas (`fields`)

Fields são campos com personalizado seja com mascaras, formatações ou funções especificas. Eles estão localizados em

```
src/components/buildForm/filds/
```

Exemplo de `formFields.jsx`

```jsx
export const createDynamicFormFields = () => {
  return [
    {
      accessorKey: "nome",
      label: "Nome Completo",
      render: DefaultField,
      validation: z.coerce
        .string()
        .min(3, { message: "Nome precisa ter pelo menos 3 caracteres" }),
      colSpan: 2,
    },
    {
      accessorKey: "tipo",
      label: "Tipo",
      render: SelectField,
      validation: z.string({ message: "Tipo é um campo obrigatório" }),
      colSpan: 2,
      options: [
        { value: "central", label: "Central" },
        { value: "admin", label: "Administrador" },
      ],
    },
  ];
};
```

### 5.4 Componente principal

Da mesma forma, temos o nosso componente principal `dialog.jsx` em que temos o componente central do formulário.

#### FormDialog

Componente responsável por montar o dialog e formulário.

```jsx
<FormDialog
  // opcional, caso seja `atualizar`
  data={data}
  // campos disponíveis
  fields={fields}
  label={label}
  // função chamada ao fazer blur no campo
  onSubmit={onSubmit}
  // função executada ao fechar o dialog
  onOpenChange={() => {
    queryClient.invalidateQueries(["listar-usuarios"]);
    setOpen(false);
    setData();
  }}
  open={open}
  key="USUARIOS"
/>
```

> Da mesma forma temos uma key que é usado para guardar o `estado` do formulário (visibilidade dos campos) em `localstorage`

## 6 Guia de Contribuição

Obrigado por querer contribuir com este projeto! 🎉  
Siga os passos abaixo para garantir que sua contribuição seja bem-sucedida.

### 6.1 Como contribuir

- [ ] Faça um fork do repositório
- [ ] Crie uma nova branch descritiva: `git checkout -b feat/nome-da-sua-feature`
- [ ] Faça suas alterações e adicione testes, se necessário
- [ ] Confirme as alterações: `git commit -m "feat: adiciona nova feature"`
- [ ] Envie a branch: `git push origin feat/nome-da-sua-feature`
- [ ] Crie um Pull Request explicando as mudanças realizadas

### 6.2 Padrões de código

- Mantenha o código limpo e legível
- Siga a estrutura e padrões já existentes
- Evite adicionar dependências desnecessárias

### 6.3 Commits

Use o [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/):

Exemplos:

- `feat: adiciona botão de login`
- `fix: corrige erro ao carregar usuários`
- `refactor: melhora performance do datagrid`

### 6.4 Feedback

Se tiver dúvidas ou sugestões, abra uma **Issue** para discutirmos.  
Sua colaboração é sempre bem-vinda! 🚀
