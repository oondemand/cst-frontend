import { Select } from "chakra-react-select";
import { useQuery } from "@tanstack/react-query";
import { Box, Text } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { createChakraStyles } from "./chakraStyles";
import { ListaOmieService } from "../../../service/lista-omie";

export const SelectContaCorrenteField = ({ ...props }) => {
  const { data } = useQuery({
    queryKey: ["listar-conta-corrente"],
    queryFn: async () =>
      ListaOmieService.getListByCode({ cod: "conta_corrente" }),
    staleTime: Infinity,
  });

  const options = useMemo(
    () =>
      data?.lista?.map((e) => ({
        value: e?.nCodCC,
        label: `${e?.descricao} ${e?.nCodCC}`,
      })),
    [data]
  );

  return (
    <Box>
      <Box>
        <Text color="gray.700" fontSize="sm">
          {props.label}
        </Text>
        <Controller
          name={props.field.name}
          control={props.methods.control}
          render={({ field }) => (
            <Select
              fontSize="sm"
              size="sm"
              disabled={props?.disabled}
              value={options?.find((item) => item?.value == field?.value) ?? ""}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(e?.value ?? "")}
              cacheOptions
              isClearable
              options={options}
              chakraStyles={createChakraStyles()}
            />
          )}
        />
      </Box>
      <Text pt="3" fontSize="xs" color="red.400">
        {props.error}
      </Text>
    </Box>
  );
};
