"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  /** Служебная метка с страницы (например development | outstaff) — попадает в source заявки */
  leadSourceHint: string | null;
  openModal: (sourceHint?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  leadSourceHint: null,
  openModal: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [leadSourceHint, setLeadSourceHint] = useState<string | null>(null);

  const openModal = useCallback((sourceHint?: string) => {
    const hint =
      typeof sourceHint === "string" && sourceHint.trim() ? sourceHint.trim() : null;
    setLeadSourceHint(hint);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setLeadSourceHint(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, leadSourceHint, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
