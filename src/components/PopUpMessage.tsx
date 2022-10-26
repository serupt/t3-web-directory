import { Dialog } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

interface PopUpMessageProps {
  title: string;
  message: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PopUpMessage({
  title,
  message,
  isOpen,
  setIsOpen,
}: PopUpMessageProps) {
  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Dialog.Panel>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{message}</Dialog.Description>
        <button onClick={() => setIsOpen(false)}>Okay</button>
      </Dialog.Panel>
    </Dialog>
  );
}
