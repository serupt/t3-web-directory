import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";

import { useTranslation } from "next-i18next";
import { ImageDeleteInput } from "../utils/validation/image.schema";

interface DeleteConfirmationProps {
  currentID: ImageDeleteInput;
  confirmationModal: boolean;
  setConfirmationModal: Dispatch<SetStateAction<boolean>>;
  onDelete: (data: ImageDeleteInput) => void;
}

export default function DeleteConfirmation({
  currentID,
  confirmationModal,
  setConfirmationModal,
  onDelete,
}: DeleteConfirmationProps) {
  const { t } = useTranslation("common");
  return (
    <Transition appear show={confirmationModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setConfirmationModal(false);
        }}
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-primary p-6 text-left align-middle shadow-xl transition-all sm:max-w-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-center text-lg font-medium leading-6"
                >
                  {t("delete")}
                </Dialog.Title>
                <div className="divider before:bg-secondary after:bg-secondary"></div>

                <div>
                  <div>
                    <p className="pb-5 text-center text-base text-white">
                      {t("delete_entry_confirm")}
                    </p>
                  </div>
                  <div className="flex justify-around space-x-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium  hover:bg-gray-500 "
                      onClick={() => {
                        setConfirmationModal(false);
                      }}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                      onClick={() => {
                        onDelete(currentID);
                      }}
                    >
                      {t("confirm")}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
