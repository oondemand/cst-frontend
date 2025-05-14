import {
  Button,
  CloseButton,
  Drawer,
  Portal,
  Box,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import { Oondemand } from "../svg/oondemand";
import { SendHorizonalIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AssistantService } from "../../service/assistant";
import { useMutation } from "@tanstack/react-query";
import { IntegrationGptService } from "../../service/gpt";
import { toaster } from "../../components/ui/toaster";
import { useEffect, useState } from "react";
import { AutoScroll } from "../autoScroll";
import { TextCard } from "./card";
import { useQuery } from "@tanstack/react-query";

const schema = z.object({ message: z.string().optional() });

export const IaChat = ({ visible, onClose, data, assistantConfigId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [iaChat, setIaChat] = useState([]);

  const { data: assistants, error } = useQuery({
    queryKey: ["list-assistants"],
    queryFn: AssistantService.listAssistant,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const selectedAssistant = assistants?.find(
    (e) => e._id === assistantConfigId
  );

  const { mutateAsync: onChatSubmitMutation, isPending } = useMutation({
    mutationFn: async ({ body }) => IntegrationGptService.askQuestion({ body }),
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
        id: assistantConfigId,
      });

      const response = await onChatSubmitMutation({
        body: {
          question: values.message,
          data,
          prompts,
          modelo: selectedAssistant?.modelo,
        },
      });

      if (values?.message) updateChatIa({ type: "user", text: values.message });

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
    if (visible && iaChat.length === 0) {
      if (assistantConfigId) {
        onSubmit({
          assistant: assistantConfigId,
        });
      }
    }
  }, [visible, assistantConfigId]);

  return (
    <Drawer.Root
      open={visible}
      onOpenChange={(e) => {
        onClose();
        reset();
        setIaChat([]);
      }}
      size="sm"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner py="2.5" px="2">
          <Drawer.Content rounded="lg">
            <Drawer.Header>
              <Box>
                <Flex pr="16" gap="4">
                  <Oondemand />
                </Flex>
                <Drawer.Title mt="1" fontSize="sm" display="flex" gap="2">
                  Assistente inteligente
                  <Text color="gray.400" fontWeight="medium">
                    {selectedAssistant?.nome}
                  </Text>
                </Drawer.Title>
                <Drawer.Description fontSize="xs">
                  Agora você pode contar com assistentes inteligentes para
                  agilizar seu trabalho!
                </Drawer.Description>
              </Box>
            </Drawer.Header>
            <Drawer.Body mt="-2">
              <Flex flexDirection="column" h="full" position="relative">
                {!assistantConfigId && (
                  <Text
                    p="2"
                    border="1px dashed"
                    borderColor="red.200"
                    rounded="md"
                    fontSize="xs"
                    color="red.400"
                    data-state="open"
                    _open={{
                      animation: "fade-in 300ms ease-out",
                    }}
                  >
                    Precisando de um Assistente Inteligente para te ajudar nessa
                    análise? Entre em contato com o suporte!
                  </Text>
                )}
                <form onSubmit={handleSubmit(onSubmit)}>
                  {iaChat.length > 0 && (
                    <AutoScroll maxH="550px" pr="1" py="2" h="full">
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
                    <Flex
                      align="center"
                      data-state="open"
                      _open={{
                        animation: "fade-in 300ms ease-out",
                      }}
                    >
                      <Text fontSize="sm" fontWeight="medium" color="gray.400">
                        Pensando...
                      </Text>
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
                        disabled={isPending || !selectedAssistant}
                        variant="unstyled"
                        flex="1"
                        placeholder="Insira sua mensagem"
                        {...register("message")}
                      />
                      <Button
                        disabled={isPending || !selectedAssistant}
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
