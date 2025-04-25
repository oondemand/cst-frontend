import { Flex } from "@chakra-ui/react";

export const Container = ({ children, ...rest }) => {
  return (
    <Flex {...rest} flex="1" flexDir="column" py="8" pl="6" bg="#F8F9FA">
      {children}
    </Flex>
  );
};
