import { useState, createContext, useContext, useRef } from "react";
import { IaChat } from "../components/iaChat";

const IaChatContext = createContext({});

export const IaChatProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    data: {},
    assistantConfigId: null,
  });

  const onOpen = (data, assistantConfigId) => {
    setModalConfig((prev) => ({
      ...prev,
      visible: true,
      data,
      assistantConfigId,
    }));
  };

  const onClose = () => {
    setModalConfig((prev) => ({
      ...prev,
      data: {},
      assistantConfigId: null,
      visible: false,
    }));
  };

  return (
    <IaChatContext.Provider value={{ onOpen, onClose }}>
      <IaChat
        visible={modalConfig.visible}
        onClose={onClose}
        data={modalConfig.data}
        assistantConfigId={modalConfig.assistantConfigId}
      />
      {children}
    </IaChatContext.Provider>
  );
};

export const useIaChat = () => {
  return useContext(IaChatContext);
};
