import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./styles/theming";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { queryClient } from "./config/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConfirmationProvider } from "./hooks/useConfirmation";
import { AuthProvider } from "./hooks/useAuth";
import { Toaster } from "./components/ui/toaster";
import { IaChatProvider } from "./hooks/useTicketModal";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <ChakraProvider value={system}>
        <AuthProvider>
          <ConfirmationProvider>
            <IaChatProvider>
              <Toaster />
              <RouterProvider router={router} />
            </IaChatProvider>
          </ConfirmationProvider>
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
