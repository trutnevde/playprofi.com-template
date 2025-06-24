import { createContext, useContext, useState } from 'react';

const SubscriptionModalContext = createContext();

export function SubscriptionModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <SubscriptionModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SubscriptionModalContext.Provider>
  );
}

export function useSubscriptionModal() {
  const context = useContext(SubscriptionModalContext);
  if (!context) {
    throw new Error('useSubscriptionModal must be used within a SubscriptionModalProvider');
  }
  return context;
} 