import { createPortal } from "react-dom";
import css from "../NoteModal/NoteModal.module.css";
import React, { useEffect} from "react";

interface ModalProps{
  onClose: () => void;
  children: React.ReactNode;
}

export default function NoteModal({onClose, children}: ModalProps){
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
  if (event.target === event.currentTarget) {
    onClose();
  }
  };
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

   return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalStyle;
    };
    }, [onClose]);
  
  if (!open) return null;


  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button className={css.closeButton} onClick={onClose} aria-label="Close modal">
          ✕
      </button>
      {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLDivElement
  );
}
