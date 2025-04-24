import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { LoginForm } from "./form";
import { env } from "../../config/env";

export const AlterarSenha = () => {
  return (
    <Center h="full">
      <Box
        width={{ base: "90%", md: "800px" }}
        height={{ base: "595px" }}
        display="flex"
        boxShadow="lg"
        borderRadius="md"
        overflow="hidden"
      >
        <Box
          flex="1"
          p={10}
          bg="brand.500"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Flex gap="4" align="center" justify="flex-center">
            <Text as="div" fontSize="md" color="white">
              Central de Serviços
            </Text>

            {/* <img src="/logo_rakuten.png" alt="RAKUTEN" /> */}
            <Text fontSize="2xl" fontWeight="700" color="white">
              oondemand
            </Text>
          </Flex>
          <Text color="white" fontSize="sm" fontWeight="semibold">
            v {env.VITE_SERVICE_VERSION}
          </Text>
        </Box>

        <Flex
          direction={"column"}
          flex="1"
          p={10}
          bg="white"
          justifyContent={"center"}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading mb="2" color="brand.500" size="lg" textAlign="center">
              Bem vindo(a) :)
            </Heading>
            <Text mb="4" color="brand.500" textAlign="center">
              Crie sua nova senha para acessar a Central de Serviços.
            </Text>

            <LoginForm />
          </Box>
        </Flex>
      </Box>
    </Center>
  );
};
