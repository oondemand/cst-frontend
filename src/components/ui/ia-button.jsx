import { Box } from "@chakra-ui/react";
import { Oondemand } from "../svg/oondemand";

export const AssistantButton = (props) => {
  return (
    <Box as="button" cursor="pointer" variant="unstyled" {...props}>
      <Oondemand />
    </Box>
  );
};
