import {
  Box,
  Center,
  Flex,
  Heading,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../config/api";
import { toaster } from "../../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { useHookFormMask } from "use-mask-input";

const schema = z.object({
  baseOmie: z.object({
    nome: z.string().nonempty({ message: "Nome é um campo obrigatório" }),
    cnpj: z.string().nonempty({ message: "Cnpj é um campo obrigatório" }),
    appKey: z.string().nonempty({ message: "AppKey é um campo obrigatório" }),
    appSecret: z
      .string()
      .nonempty({ message: "App Secret é um campo obrigatório" }),
  }),
  usuario: z.object({
    nome: z.string().nonempty({ message: "Nome é um campo obrigatório" }),
    email: z.string().email({ message: "Email inválido" }),
    senha: z.string().nonempty({ message: "Senha é um campo obrigatório" }),
    tipo: z.string().nonempty({ message: "Tipo é um campo obrigatório" }),
  }),
});

export const Ativacao = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      usuario: {
        tipo: "admin",
      },
    },
  });

  const registerWithMask = useHookFormMask(register);

  const ativacaoMutation = useMutation({
    mutationFn: async (data) => {
      await api.post("/ativacao", data);
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao ativar",
        description: error.response?.data?.message,
        type: "error",
      });
    },
    onSuccess: () => {
      toaster.create({
        title: "Ativação realizada com sucesso",
        type: "success",
      });

      navigate("/login", { viewTransition: true });
    },
  });

  console.log(errors);

  const onSubmit = async (data) => {
    await ativacaoMutation.mutateAsync(data);
  };

  return (
    <Center h="full" bg="#F8F9FA">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          width={{ base: "90%", md: "800px" }}
          minHeight={{ base: "595px" }}
          boxShadow="lg"
          borderRadius="lg"
          overflow="hidden"
          py="5"
          px="6"
          bg="white"
          color="gray.700"
          position="relative"
          borderLeft="2px solid"
          borderColor="cyan.500"
        >
          <Heading>Oondemand</Heading>
          <Text>Formulário de ativação</Text>
          <Box mt="6">
            <Text fontWeight="medium">Base omie</Text>
            <Flex
              gap="6"
              mt="0"
              color="gray.600"
              flexWrap="wrap"
              border="1px solid"
              borderColor="gray.200"
              px="6"
              py="4"
              pb="6"
              rounded="md"
            >
              <Box w="xs">
                <Text fontSize="sm">Nome</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="Nome da base omie"
                  {...register("baseOmie.nome")}
                />
                {errors.baseOmie?.nome?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.baseOmie.nome.message}
                  </Text>
                )}
              </Box>

              <Box w="xs">
                <Text fontSize="sm">Cnpj</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="CNPJ da base omie"
                  {...registerWithMask("baseOmie.cnpj", "99.999.999/9999-99")}
                />
                {errors.baseOmie?.cnpj?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.baseOmie.cnpj.message}
                  </Text>
                )}
              </Box>

              <Box w="xs">
                <Text fontSize="sm">AppKey</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="App key"
                  {...register("baseOmie.appKey")}
                />
                {errors.baseOmie?.appKey?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.baseOmie.appKey.message}
                  </Text>
                )}
              </Box>

              <Box w="xs">
                <Text fontSize="sm">App Secret</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="App secret"
                  type="password"
                  {...register("baseOmie.appSecret")}
                />
                {errors.baseOmie?.appSecret?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.baseOmie.appSecret.message}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>

          <Box mt="6">
            <Text fontWeight="medium">Usuário</Text>
            <Flex
              gap="6"
              mt="0"
              color="gray.600"
              flexWrap="wrap"
              border="1px solid"
              borderColor="gray.200"
              px="6"
              py="4"
              pb="6"
              rounded="md"
            >
              <Box w="xs">
                <Text fontSize="sm">Nome</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="Nome"
                  {...register("usuario.nome")}
                />
                {errors.usuario?.nome?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.usuario.nome.message}
                  </Text>
                )}
              </Box>

              <Box w="xs">
                <Text fontSize="sm">Email</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="email"
                  {...register("usuario.email")}
                />
                {errors.usuario?.email?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.usuario.email.message}
                  </Text>
                )}
              </Box>

              <Box w="xs">
                <Text fontSize="sm">Senha</Text>
                <Input
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="Senha"
                  type="password"
                  {...register("usuario.senha")}
                />
                {errors.usuario?.senha?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.usuario.senha.message}
                  </Text>
                )}
              </Box>

              <Box w="xs">
                <Text fontSize="sm">Tipo</Text>
                <Input
                  disabled
                  size="sm"
                  focusRingColor="brand.350"
                  placeholder="Tipo"
                  {...register("usuario.tipo")}
                />
                {errors.usuario?.tipo?.message && (
                  <Text fontSize="xs" mt="0.5" color="red.500">
                    {errors.usuario.tipo.message}
                  </Text>
                )}
              </Box>
            </Flex>
          </Box>

          <Box mt="6">
            <Button
              disabled={ativacaoMutation.isPending}
              w="2xs"
              colorPalette="cyan"
              type="submit"
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </form>
    </Center>
  );
};
