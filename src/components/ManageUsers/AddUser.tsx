import { Dialog, Listbox, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  CreateUserForm,
  createUserForm,
  CreateUserInput,
} from "../../utils/validation/users.schema";

import { useTranslation } from "next-i18next";

interface AddUserProps {
  addUserModalOpened: boolean;
  setAddUserModalOpened: Dispatch<SetStateAction<boolean>>;
  onAdd: (data: CreateUserInput) => void;
}

const roles = ["ADMIN", "USER"];

export default function AddUser({
  addUserModalOpened,
  setAddUserModalOpened,
  onAdd,
}: AddUserProps) {
  const { t } = useTranslation("common");

  const {
    register,
    formState,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserForm),
    defaultValues: {
      username: "",
      password: "",
      role: "USER",
    },
  });

  const onSubmit: SubmitHandler<CreateUserForm> = (data) => {
    onAdd({
      username: data.username,
      password: data.password,
      role: data.role,
    });
    reset();
  };

  const [role, setRole] = useState("USER");

  return (
    <Transition appear show={addUserModalOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          reset();
          setAddUserModalOpened(false);
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
                  {t("add_user")}
                </Dialog.Title>
                <div className="divider before:bg-secondary after:bg-secondary"></div>

                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-3">
                      <label className="block">
                        <span className="mb-2 block">{t("username")}</span>
                        {formState.errors.username && (
                          <p className="p-1 text-xl text-red-600">
                            {formState.errors.username.message}
                          </p>
                        )}
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("username", { required: true })}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">{t("password")}</span>
                        {formState.errors.password && (
                          <p className="p-1 text-xl text-red-600">
                            {formState.errors.password.message}
                          </p>
                        )}
                        <input
                          type={"password"}
                          className="input-md w-full rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("password", { required: true })}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">
                          {t("password_confirm")}
                        </span>
                        {watch("confirmpassword") !== watch("password") &&
                        getValues("confirmpassword") ? (
                          <p className="p-1 text-xl text-red-600">
                            password does not match
                          </p>
                        ) : null}
                        <input
                          type={"password"}
                          className="input-md w-full rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("confirmpassword", { required: true })}
                        />
                      </label>
                      <label className="block">
                        <Listbox value={role} onChange={setRole}>
                          <Listbox.Label className="mb-2 block">
                            {t("role")}
                          </Listbox.Label>
                          <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-primary-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-secondary">
                              <span className="block truncate">{role}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                  />
                                </svg>
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-primary-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {roles.map((role, roleIdx) => (
                                  <Listbox.Option
                                    key={roleIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-secondary text-white"
                                          : "text-white"
                                      }`
                                    }
                                    value={role}
                                    onClick={() =>
                                      setValue(
                                        "role",
                                        role === "ADMIN" ? "ADMIN" : "USER"
                                      )
                                    }
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          {role}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={1.5}
                                              stroke="currentColor"
                                              className="h-6 w-6"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                              />
                                            </svg>
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
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
                              reset();
                              setAddUserModalOpened(false);
                            }}
                          >
                            {t("cancel")}
                          </button>
                          {watch("confirmpassword") === watch("password") &&
                          getValues("confirmpassword") ? (
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                            >
                              {t("confirm")}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setAddUserModalOpened(false);
                              }}
                              disabled
                              className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium hover:bg-primary-600 "
                            >
                              {t("confirm")}
                            </button>
                          )}
                        </div>
                      </div>
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
