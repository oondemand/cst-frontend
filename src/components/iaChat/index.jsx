import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Box,
  Flex,
  Input,
  Group,
  Text,
} from "@chakra-ui/react";
import { Oondemand } from "../svg/oondemand";
import { SendHorizonalIcon } from "lucide-react";
import { SelectAssistant } from "../selectAssistant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const schema = z.object({
  message: z.string().min(3, "Mensagem é obrigatória"),
  assistant: z.string({ message: "Assistente é obrigatório" }),
});

export const IaChat = ({ visible, onClose, data }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Drawer.Root open={visible} onOpenChange={onClose} size="sm">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner py="2.5" px="2">
          <Drawer.Content rounded="lg">
            <Drawer.Header>
              <Box>
                <Flex pr="16" gap="4">
                  <Oondemand />
                </Flex>
                <Drawer.Title mt="1" fontSize="sm">
                  Assistente inteligente
                </Drawer.Title>
                <Drawer.Description fontSize="xs">
                  Agora você pode contar com assistentes inteligentes para
                  agilizar seu trabalho!
                </Drawer.Description>
              </Box>
            </Drawer.Header>
            <Drawer.Body mt="-2">
              <Flex flexDirection="column" h="full" position="relative">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box>
                    <Controller
                      control={control}
                      name="assistant"
                      render={({ field }) => (
                        <SelectAssistant
                          w="xs"
                          name={field.name}
                          value={[field.value]}
                          onValueChange={({ value }) => {
                            field.onChange(value[0]);
                          }}
                          onInteractOutside={() => field.onBlur()}
                        />
                      )}
                    />
                    {errors.assistant && (
                      <Text color="red.500" ml="0.5" fontSize="xs">
                        {errors.assistant.message}
                      </Text>
                    )}
                  </Box>

                  <Box w="full" position="absolute" bottom="2">
                    {/* {errors.message && (
                      <Text color="red.500" ml="0.5" fontSize="xs">
                        {errors.message.message}
                      </Text>
                    )} */}
                    <Flex
                      w="full"
                      border="1px solid"
                      borderColor={errors.message ? "red.400" : "gray.200"}
                      rounded="md"
                    >
                      <Input
                        variant="unstyled"
                        flex="1"
                        placeholder="Insira sua mensagem"
                        {...register("message")}
                      />
                      <Button color="gray.600" type="submit" variant="unstyled">
                        <SendHorizonalIcon size={20} />
                      </Button>
                    </Flex>
                  </Box>
                </form>
              </Flex>
            </Drawer.Body>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
