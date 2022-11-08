import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  editPasswordForm,
  EditPasswordForm,
} from "../../utils/validation/users.schema";

interface ChangePasswordProps {
  selectedUser: User;
  showChangePassword: boolean;
  setShowChangePassword: Dispatch<SetStateAction<boolean>>;
  onEditPassword: (data: EditPasswordForm) => void;
}

export default function ChangePassword({
  selectedUser,
  showChangePassword,
  setShowChangePassword,
  onEditPassword,
}: ChangePasswordProps) {
  const {
    register,
    formState,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<EditPasswordForm>({
    resolver: zodResolver(editPasswordForm),
    defaultValues: { password: "" },
  });

  const onSubmit: SubmitHandler<EditPasswordForm> = (data) => {
    onEditPassword(data);
  };
  return (
    <Transition appear show={showChangePassword} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setShowChangePassword(false);
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
                  Type in new password
                </Dialog.Title>
                <div className="divider before:bg-secondary after:bg-secondary"></div>

                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-3">
                      <label className="block">
                        <span className="mb-2 block">New Password</span>
                        {formState.errors.password && (
                          <p className="p-1 text-xl text-red-600">
                            {formState.errors.password.message}
                          </p>
                        )}
                        <input
                          type="password"
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("password")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Confirm New Password</span>
                        <input
                          type="password"
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("confirmpassword")}
                        />
                      </label>
                    </div>
                    <div className="divider before:bg-secondary after:bg-secondary"></div>
                    <div className="flex justify-around space-x-3">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium  hover:bg-gray-500 "
                        onClick={() => {
                          reset();
                          setShowChangePassword(false);
                        }}
                      >
                        Cancel
                      </button>
                      {watch("confirmpassword") === watch("password") &&
                      getValues("confirmpassword") ? (
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium hover:bg-primary-600 "
                          disabled
                        >
                          Confirm
                        </button>
                      )}
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
