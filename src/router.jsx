import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./components/_layouts/main";
import { LoginPage } from "./pages/login";
import { AuthLayout } from "./components/_layouts/auth";
import { PrestadoresList } from "./pages/prestadores/list";
import { ServicosList } from "./pages/servicos/list";
import { ServicosTomados } from "./pages/servicosTomados";
import { Dashboard } from "./pages/dashboard";
import { Doc } from "./pages/doc";
import { PlanejamentoMensal } from "./pages/planejamentoMensal";
import { ImportServicosPage } from "./pages/servicos/importacao";
import { ImportPrestadoresPage } from "./pages/prestadores/importacao";
import { UsuariosPage } from "./pages/usuarios/index";
import { AlterarSenha } from "./pages/alterarSenha";
import { RegistrosPage } from "./pages/registros";
import { Listas } from "./pages/listas";
import { SistemaPage } from "./pages/sistema";
import { TicketsPagosPage } from "./pages/ticketsPagos";
import { EtapasPage } from "./pages/etapas";
import { DocumentosFiscaisList } from "./pages/documentoFiscal";
import { ImportDocumentosFiscaisPage } from "./pages/documentoFiscal/importacao";
import { AssistenteConfigPage } from "./pages/assistant";
import { DocumentosCadastraisList } from "./pages/documentoCadastral";
import { ImportDocumentosCadastraisPage } from "./pages/documentoCadastral/importacao";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      {
        path: "/servicos-tomados",
        element: <ServicosTomados />,
      },
      { path: "/planejamento", element: <PlanejamentoMensal /> },
      { path: "/prestadores", element: <PrestadoresList /> },
      { path: "/prestadores/importacao", element: <ImportPrestadoresPage /> },
      { path: "/servicos/todos", element: <ServicosList /> },
      { path: "/servicos/importacao", element: <ImportServicosPage /> },
      { path: "/documentos-fiscais", element: <DocumentosFiscaisList /> },
      { path: "/documentos-cadastrais", element: <DocumentosCadastraisList /> },
      {
        path: "/documentos-fiscais/importacao",
        element: <ImportDocumentosFiscaisPage />,
      },
      {
        path: "/documentos-cadastrais/importacao",
        element: <ImportDocumentosCadastraisPage />,
      },
      { path: "/usuarios", element: <UsuariosPage /> },
      { path: "/registros", element: <RegistrosPage /> },
      { path: "/listas", element: <Listas /> },
      { path: "/sistema", element: <SistemaPage /> },
      { path: "/doc", element: <Doc /> },
      { path: "/pagos", element: <TicketsPagosPage /> },
      { path: "/etapas", element: <EtapasPage /> },
      { path: "/assistentes", element: <AssistenteConfigPage /> },
    ],
  },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/alterar-senha", element: <AlterarSenha /> },
    ],
  },
]);
