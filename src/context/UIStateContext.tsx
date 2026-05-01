import React, { createContext, useContext, useState } from 'react';

// UI State context for managing modals, panels, and UI states
interface UIState {
  // Modals
  isCharacterModalOpen: boolean;
  isSceneModalOpen: boolean;
  isResourceModalOpen: boolean;
  isVersionHistoryOpen: boolean;
  
  // Panels/Sidebars
  isReferencePanelOpen: boolean;
  isSettingsPanelOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  
  // Notifications/toasts
  notification: {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    visible: boolean;
  } | null;
}

interface UIStateActions {
  // Modal actions
  openCharacterModal: () => void;
  closeCharacterModal: () => void;
  openSceneModal: () => void;
  closeSceneModal: () => void;
  openResourceModal: () => void;
  closeResourceModal: () => void;
  openVersionHistory: () => void;
  closeVersionHistory: () => void;
  
  // Panel actions
  toggleReferencePanel: () => void;
  closeReferencePanel: () => void;
  openSettingsPanel: () => void;
  closeSettingsPanel: () => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  
  // Notification actions
  showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  hideNotification: () => void;
}

const UIStateContext = createContext<{
  state: UIState;
  actions: UIStateActions;
} | null>(null);

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
};

interface UIStateProviderProps {
  children: React.ReactNode;
}

export const UIStateProvider: React.FC<UIStateProviderProps> = ({ children }) => {
  // Modal states
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState<boolean>(false);
  const [isSceneModalOpen, setIsSceneModalOpen] = useState<boolean>(false);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState<boolean>(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState<boolean>(false);
  
  // Panel states
  const [isReferencePanelOpen, setIsReferencePanelOpen] = useState<boolean>(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState<boolean>(false);
  
  // Loading states
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);
  
  // Notification state
  const [notification, setNotification] = useState<UIState['notification'] | null>(null);

  // Modal actions
  const openCharacterModal = () => setIsCharacterModalOpen(true);
  const closeCharacterModal = () => setIsCharacterModalOpen(false);
  const openSceneModal = () => setIsSceneModalOpen(true);
  const closeSceneModal = () => setIsSceneModalOpen(false);
  const openResourceModal = () => setIsResourceModalOpen(true);
  const closeResourceModal = () => setIsResourceModalOpen(false);
  const openVersionHistory = () => setIsVersionHistoryOpen(true);
  const closeVersionHistory = () => setIsVersionHistoryOpen(false);
  
  // Panel actions
  const toggleReferencePanel = () => setIsReferencePanelOpen(!isReferencePanelOpen);
  const closeReferencePanel = () => setIsReferencePanelOpen(false);
  const openSettingsPanel = () => setIsSettingsPanelOpen(true);
  const closeSettingsPanel = () => setIsSettingsPanelOpen(false);
  
  // Loading actions
  const setGlobalLoadingState = (loading: boolean) => setGlobalLoading(loading);
  
  // Notification actions
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotification({
      message,
      type,
      visible: true
    });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  const hideNotification = () => setNotification(null);

  return (
    <UIStateContext.Provider
      value={{
        state: {
          isCharacterModalOpen,
          isSceneModalOpen,
          isResourceModalOpen,
          isVersionHistoryOpen,
          isReferencePanelOpen,
          isSettingsPanelOpen,
          globalLoading,
          notification
        },
        actions: {
          openCharacterModal,
          closeCharacterModal,
          openSceneModal,
          closeSceneModal,
          openResourceModal,
          closeResourceModal,
          openVersionHistory,
          closeVersionHistory,
          toggleReferencePanel,
          closeReferencePanel,
          openSettingsPanel,
          closeSettingsPanel,
          setGlobalLoading: setGlobalLoadingState,
          showNotification,
          hideNotification
        }
      }}
    >
      {children}
    </UIStateContext.Provider>
  );
};