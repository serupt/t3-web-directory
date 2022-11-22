import { Dialog, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import {
  DeleteUserInput,
  EditPasswordForm,
  EditUsernameForm,
} from "../../utils/validation/users.schema";
import ChangePassword from "./ChangePassword";
import ChangeUsername from "./ChangeUsername";
import DeleteConfirmation from "./DeleteConfirmation";

import { useTranslation } from "next-i18next";

interface EditUsersProps {
  selectedUser: User;
  setSelectedUser: Dispatch<SetStateAction<User | undefined>>;
  editUserModalOpened: boolean;
  setEditUserModalOpened: Dispatch<SetStateAction<boolean>>;
  onEditUsername: (data: EditUsernameForm) => void;
  onEditPassword: (data: EditPasswordForm) => void;
  onDelete: (data: DeleteUserInput) => void;
}

export default function EditUsers({
  selectedUser,
  setSelectedUser,
  editUserModalOpened,
  setEditUserModalOpened,
  onEditUsername,
  onEditPassword,
  onDelete,
}: EditUsersProps) {
  const { t } = useTranslation("common");

  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <Transition appear show={editUserModalOpened} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setSelectedUser(undefined);
            setEditUserModalOpened(false);
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
                    {t("edit_editing")} {selectedUser.username}
                  </Dialog.Title>
                  <div className="divider before:bg-secondary after:bg-secondary"></div>

                  <div>
                    {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                    <div className="flex flex-col space-y-3">
                      <label className="block">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                          onClick={() => setShowChangeUsername(true)}
                        >
                          {t("username_change")}
                        </button>
                      </label>
                      <label className="block">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                          onClick={() => setShowChangePassword(true)}
                        >
                          {t("password_change")}
                        </button>
                      </label>
                      <label className="block">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                          onClick={() => setShowDeleteConfirmation(true)}
                        >
                          {t("users_delete")}
                        </button>
                      </label>
                    </div>
                    <div className="divider before:bg-secondary after:bg-secondary"></div>
                    <div className="mt-4">
                      <div className="flex justify-start space-x-2">
                        <div className="flex flex-1 justify-around space-x-2">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium  hover:bg-gray-500 "
                            onClick={() => {
                              setSelectedUser(undefined);
                              setEditUserModalOpened(false);
                            }}
                          >
                            {t("cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* </form> */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ChangeUsername
        selectedUser={selectedUser}
        showChangeUsername={showChangeUsername}
        setShowChangeUsername={setShowChangeUsername}
        onEditUsername={(data) => onEditUsername(data)}
      />
      <ChangePassword
        selectedUser={selectedUser}
        showChangePassword={showChangePassword}
        setShowChangePassword={setShowChangePassword}
        onEditPassword={(data) => onEditPassword(data)}
      />
      <DeleteConfirmation
        selectedUser={selectedUser}
        showDeleteConfirmation={showDeleteConfirmation}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
        onDelete={(data) => onDelete(data)}
      />
    </>
  );
}
