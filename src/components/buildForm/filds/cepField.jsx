import { Input, Box, Text } from "@chakra-ui/react";
import { useHookFormMask } from "use-mask-input";

export const CepField = ({ ...props }) => {
  const registerWithMask = useHookFormMask(props.methods.register);

  return (
    <Box>
      <Text fontSize="sm" color="gray.700">
        {props.label}
      </Text>
      <Input
        disabled={props.disabled}
        fontSize="sm"
        size="sm"
        variant="flushed"
        {...registerWithMask(props.accessorKey, "99999-999")}
      />
      <Text mt="0.5" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
