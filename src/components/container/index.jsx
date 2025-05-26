import { Flex } from "@chakra-ui/react";

export const Container = ({ children, ...rest }) => {
  return (
    <Flex
      flex="1"
      py="8"
      px="6"
      pb="2"
      itens="center"
      overflow="auto"
      scrollbarWidth="thin"
      bg="#F8F9FA"
    >
      {children}
    </Flex>
  );
};
