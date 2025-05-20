import { IconButton, Button } from "@chakra-ui/react";
import { forwardRef } from "react";
import { Pencil } from "lucide-react";

export const IconTrigger = forwardRef((props, ref) => {
  return (
    <IconButton
      ref={ref}
      variant="surface"
      colorPalette="gray"
      size="2xs"
      {...props}
    >
      <Pencil />
    </IconButton>
  );
});

export const DefaultTrigger = forwardRef(({ title, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      size="sm"
      variant="subtle"
      fontWeight="semibold"
      color="brand.500"
      _hover={{ backgroundColor: "gray.50" }}
      {...rest}
    >
      {title}
    </Button>
  );
});
