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
  Spinner,
} from "@chakra-ui/react";
import { Oondemand } from "../svg/oondemand";
import { SendHorizonalIcon } from "lucide-react";
import { SelectAssistant } from "../selectAssistant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { AssistantService } from "../../service/assistant";
import { useMutation } from "@tanstack/react-query";
import { IntegrationGptService } from "../../service/gpt";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState, useRef } from "react";
import { AutoScroll } from "../autoScroll";
import { TextCard } from "./card";
import { useQuery } from "@tanstack/react-query";
import { TicketService } from "../../service/ticket";

const schema = z.object({
  message: z.string().optional(),
  assistant: z.string({ message: "Assistente é obrigatório" }),
});

export const IaChat = ({ visible, onClose, data }) => {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [iaChat, setIaChat] = useState([]);
  const hasExecutedChatOnOpenTime = useRef(false);

  const { data: assistants, error } = useQuery({
    queryKey: ["list-assistants"],
    queryFn: AssistantService.listAssistant,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data: ticket } = useQuery({
    queryKey: ["list-ticket"],
    queryFn: async () => await TicketService.carregarTicket(data?._id),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: visible,
  });

  const { mutateAsync: onChatSubmitMutation, isPending } = useMutation({
    mutationFn: async ({ body }) => IntegrationGptService.askQuestion({ body }),
    onSuccess: (data) => {
      toaster.create({
        placement: "top-left",
        title: "Mensagem enviada com sucesso!",
        type: "success",
      });
    },
  });

  const updateChatIa = ({ type, text, details = null }) => {
    if (iaChat.length > 30) {
      return setIaChat((prev) => {
        const prevChat = [...prev];
        prevChat.shift();
        return [...prevChat, { type, text, details }];
      });
    }

    setIaChat((prev) => [...prev, { type, text, details }]);
  };

  const onSubmit = async (values) => {
    try {
      const prompts = await AssistantService.getAssistant({
        id: values.assistant,
      });

      const modelo = assistants?.find(
        (e) => e._id === values.assistant
      )?.modelo;

      const response = await onChatSubmitMutation({
        body: { question: values.message, data: ticket, prompts, modelo },
      });

      if (values.message) updateChatIa({ type: "user", text: values.message });

      if (response)
        updateChatIa({ type: "bot", text: response?.data?.data?.response });

      setValue("message", "");
    } catch (error) {
      toaster.create({
        title: "Ouve um erro na integração com assistente!",
        description: error?.message,
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (visible && !hasExecutedChatOnOpenTime.current) {
      console.log("RUNNING");
      hasExecutedChatOnOpenTime.current = true;

      // const assistant = getValues("assistant");
      // console.log(assistant);

      onSubmit({
        message:
          "Preciso que analise os documentos da empresa e me retorne os dados de forma organizada",
        assistant: "6818f215816df1fcddd4d553",
      });
    }
  }, [visible]);

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

                  {iaChat.length > 0 && (
                    <AutoScroll mt="8" maxH="480px" pr="1" py="2" h="full">
                      {iaChat.map((chat, i) => (
                        <TextCard
                          key={`${chat.text}-${i}`}
                          text={chat.text}
                          type={chat.type}
                          details={chat?.details}
                        />
                      ))}
                    </AutoScroll>
                  )}

                  {isPending && (
                    <Flex p="2" align="center">
                      <Spinner color="gray.400" />
                    </Flex>
                  )}

                  <Box w="full" position="absolute" bottom="2">
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
                      <Button
                        disabled={isPending}
                        color="gray.600"
                        type="submit"
                        variant="unstyled"
                      >
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
