import { useState, createContext, useContext, useRef } from "react";
import { IaChat } from "../components/iaChat";

const IaChatContext = createContext({});

export const IaChatProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    data: {},
  });

  const onOpen = (data) => {
    setModalConfig((prev) => ({ ...prev, visible: true, data }));
  };

  const onClose = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  return (
    <IaChatContext.Provider value={{ onOpen, onClose }}>
      <IaChat
        visible={modalConfig.visible}
        onClose={onClose}
        data={modalConfig.data}
      />
      {children}
    </IaChatContext.Provider>
  );
};

export const useIaChat = () => {
  return useContext(IaChatContext);
};
