import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  editUsernameForm,
  EditUsernameForm,
} from "../../utils/validation/users.schema";

import { useTranslation } from "next-i18next";

interface ChangeUsernameProps {
  selectedUser: User;
  showChangeUsername: boolean;
  setShowChangeUsername: Dispatch<SetStateAction<boolean>>;
  onEditUsername: (data: EditUsernameForm) => void;
}

export default function ChangeUsername({
  selectedUser,
  showChangeUsername,
  setShowChangeUsername,
  onEditUsername,
}: ChangeUsernameProps) {
  const { t } = useTranslation("common");

  const {
    register,
    formState,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<EditUsernameForm>({
    resolver: zodResolver(editUsernameForm),
    defaultValues: { username: selectedUser?.username },
  });

  const onSubmit: SubmitHandler<EditUsernameForm> = (data) => {
    onEditUsername({
      username: data.username,
    });
  };
  return (
    <Transition appear show={showChangeUsername} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setShowChangeUsername(false);
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
                  {t("username_text")}
                </Dialog.Title>
                <div className="divider before:bg-secondary after:bg-secondary"></div>

                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label className="block">
                        <span className="mb-2 block">{t("username_new")}</span>
                        {formState.errors.username && (
                          <p className="p-1 text-xl text-red-600">
                            {formState.errors.username.message}
                          </p>
                        )}
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("username")}
                        />
                      </label>
                    </div>

                    <div className="flex justify-around space-x-3 py-5">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium  hover:bg-gray-500 "
                        onClick={() => {
                          reset();
                          setShowChangeUsername(false);
                        }}
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                      >
                        {t("confirm")}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
