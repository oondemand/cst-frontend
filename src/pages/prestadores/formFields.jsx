import { DefaultField } from "../../components/buildForm/filds/default";
import { z } from "zod";
import {
  preprocessEmptyToUndefined,
  dateValidation,
} from "../../utils/zodHelpers";
import { CpfCnpjField } from "../../components/buildForm/filds/cpfCnpjField";
import { DateField } from "../../components/buildForm/filds/dateField";
import { SelectListaField } from "../../components/buildForm/filds/selectListaField";
import { CepField } from "../../components/buildForm/filds/cepField";
import { SelectEstadoField } from "../../components/buildForm/filds/selectEstadoField";
import { SelectBancoField } from "../../components/buildForm/filds/selectBancoField";
import { SelectField } from "../../components/buildForm/filds/selectField";
import { LISTA_PAISES_OMIE } from "../../constants/omie";
import { PisPasepField } from "../../components/buildForm/filds/pisField";

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
      accessorKey: "email",
      label: "E-mail",
      render: DefaultField,
      validation: z.string().email().optional().or(z.literal("")).nullable(),
      colSpan: 2,
    },
    {
      accessorKey: "tipo",
      label: "Tipo de Prestador",
      render: SelectField,
      validation: z.string({ message: "Tipo é um campo obrigatório" }),
      colSpan: 1,
      options: [
        { value: "pf", label: "Pessoa física" },
        { value: "pj", label: "Pessoa jurídica" },
        { value: "ext", label: "Exterior" },
      ],
    },
    {
      accessorKey: "documento",
      label: "Documento",
      render: CpfCnpjField,
      validation: z
        .string({ message: "Documento é um campo obrigatório" })
        .nonempty({ message: "Documento é um campo obrigatório" })
        .transform((value) => value.replace(/\D/g, "")),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaFisica.dataNascimento",
      label: "Data Nascimento",
      render: DateField,
      validation: dateValidation.nullable(),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaFisica.pis",
      label: "PIS",
      render: PisPasepField,
      validation: z
        .string()
        .transform((value) => value.replace(/\D/g, ""))
        .optional(),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaFisica.rg.numero",
      label: "RG Número",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaFisica.rg.orgaoEmissor",
      label: "Órgão Emissor",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaJuridica.nomeFantasia",
      label: "Nome Fantasia",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 2,
    },
    {
      accessorKey: "pessoaJuridica.codigoCNAE",
      label: "Código CNAE",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaJuridica.codigoServicoNacional",
      label: "Código Serviço Nacional",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "pessoaJuridica.regimeTributario",
      label: "Regime Tributário",
      render: SelectField,
      validation: z.string().optional(),
      colSpan: 1,
      options: [
        { value: "MEI", label: "MEI" },
        { value: "Simples Nacional", label: "Simples Nacional" },
        { value: "Lucro Presumido", label: "Lucro Presumido" },
        { value: "Lucro Real", label: "Lucro Real" },
      ],
    },
    {
      accessorKey: "endereco.rua", // updated key
      label: "Logradouro",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 2,
    },
    {
      accessorKey: "endereco.numero", // updated key
      label: "Número",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.complemento", // updated key
      label: "Complemento",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.cidade", // updated key
      label: "Cidade",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.cep", // updated key
      label: "CEP",
      render: CepField,
      validation: preprocessEmptyToUndefined(
        z
          .string()
          .transform((value) => value.replace(/\D/g, ""))
          .refine((cleanedValue) => cleanedValue.length === 8, {
            message: "CEP deve conter exatamente 8 dígitos.",
          })
          .optional()
      ),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.estado", // updated key
      label: "Estado",
      render: SelectEstadoField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "endereco.pais.cod", // updated key
      label: "País",
      render: SelectField,
      validation: z.coerce.string().optional(),
      colSpan: 1,
      options: LISTA_PAISES_OMIE.map((e) => ({
        value: e.cCodigo,
        label: e.cDescricao,
      })),
      defaultValue: "1058",
    },
    {
      accessorKey: "dadosBancarios.banco", // updated key
      label: "Banco",
      render: SelectBancoField,
      cod: "bancos",
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.agencia", // updated key
      label: "Agência",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.conta", // updated key
      label: "Conta",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
    {
      accessorKey: "dadosBancarios.tipoConta", // updated key
      label: "Tipo de Conta",
      render: SelectField,
      validation: z.string().optional(),
      colSpan: 1,
      options: [
        { value: "corrente", label: "Conta Corrente" },
        { value: "poupanca", label: "Conta poupança" },
      ],
    },
    {
      accessorKey: "dadosBancarios.tipoChavePix",
      label: "Tipo de Chave Pix",
      render: SelectField,
      validation: z.string().optional(),
      colSpan: 1,
      options: [
        { value: "cpf", label: "CPF" },
        { value: "email", label: "E-mail" },
        { value: "telefone", label: "Telefone" },
        { value: "aleatoria", label: "Aleatória" },
      ],
    },
    {
      accessorKey: "dadosBancarios.chavePix",
      label: "Chave Pix",
      render: DefaultField,
      validation: z.string().optional(),
      colSpan: 1,
    },
  ];
};
