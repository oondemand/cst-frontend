import { Box, Text, Grid } from "@chakra-ui/react";
import { currency } from "../../utils/currency";

export const ServicosDetailsCard = ({ servicos }) => {
  return (
    <Box width="350px" pt="2" color="gray.700">
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        <Text fontSize="sm" minWidth="100px">
          Competência
        </Text>
        <Text fontSize="sm" minWidth="90px">
          Descrição
        </Text>
        <Text fontSize="sm" minWidth="110px" fontWeight="600">
          Valor
        </Text>
      </Grid>

      {servicos.map((item, index) => (
        <Grid
          key={index}
          templateColumns="repeat(3, 1fr)"
          gap={2}
          py="0.5"
          borderBottom={index < servicos.length - 1 ? "1px solid" : "none"}
          borderColor="gray.100"
        >
          <Text fontSize="sm" minWidth="100px">
            {`${item?.competencia?.mes}/${item?.competencia?.ano}`}
          </Text>
          <Text truncate fontSize="sm" minWidth="90px">
            {item?.descricao ?? ""}
          </Text>
          <Text fontSize="sm" minWidth="110px" fontWeight="600">
            {currency.format(item?.valor ?? 0)}
          </Text>
        </Grid>
      ))}
    </Box>
  );
};
