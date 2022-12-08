import { Dialog, Transition } from "@headlessui/react";
import { Place } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useTranslation } from "next-i18next";

interface GalleryProps {
  selectedEntry: Place;
  setSelectedEntry: Dispatch<SetStateAction<Place | undefined>>;
  galleryModalOpened: boolean;
  setGalleryModalOpened: Dispatch<SetStateAction<boolean>>;
}

interface FormData {
  item: FileList;
}

const ImageSchema = z.object({
  item:
    typeof window === "undefined" // this is required if your app rendered in server side, otherwise just remove the ternary condition
      ? z.undefined()
      : z
          .instanceof(FileList)
          .refine((file) => file.length !== 0, {
            message: "Please select a file",
          })
          .refine(
            (file) => {
              const fileType = file.item?.(0)?.type || "";
              return fileType === "image/jpeg" || fileType === "image/png";
            },
            {
              message: "File must be a jpeg or png image",
            }
          )
          .refine(
            (file) => {
              const fileSize = file.item?.(0)?.size || 0;
              return fileSize <= 5000000;
            },
            { message: "File size must be less than 5MB" }
          ),
});

export default function Gallery({
  selectedEntry,
  setSelectedEntry,
  galleryModalOpened,
  setGalleryModalOpened,
}: GalleryProps) {
  const { t } = useTranslation("common");

  const [image, setImage] = useState<File | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(ImageSchema),
    defaultValues: undefined,
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // console.log(data.item[0]);
    if (
      data.item[0]?.type === "image/jpeg" ||
      data.item[0]?.type === "image/png"
    ) {
      setImage(data.item[0]);
    } else {
      toast.error("File must be a jpeg or png image", {
        style: {
          borderRadius: "10px",
          background: "#2B303A",
          color: "#fff",
          borderColor: "#B392AC",
        },
        iconTheme: { primary: "#B392AC", secondary: "#fff" },
        duration: 6000,
      });
    }
  };

  return (
    <Transition appear show={galleryModalOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setSelectedEntry(undefined);
          setImage(undefined);
          setGalleryModalOpened(false);
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
                  {selectedEntry.name}'s Gallery
                </Dialog.Title>
                <div className="divider before:bg-secondary after:bg-secondary"></div>
                <div>Gallery</div>
                <div className="divider before:bg-secondary after:bg-secondary"></div>
                <div className="mt-2 p-2">
                  <form onChange={handleSubmit(onSubmit)}>
                    <div className="flex w-full items-center justify-center">
                      <label
                        htmlFor="dropzone-file"
                        className="dark:hover:bg-bray-800 flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            aria-hidden="true"
                            className="mb-3 h-10 w-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          {...register("item")}
                        />
                      </label>
                    </div>
                  </form>
                  {errors.item && (
                    <p className="p-1 text-xl text-red-600">
                      {errors.item.message}
                    </p>
                  )}
                  <div className="mt-4 flex justify-between">
                    <p
                      className="mt-2 p-1 text-sm text-gray-500 dark:text-gray-300"
                      id="file_input_help"
                    >
                      PNG or JPG (Max 5MB).
                    </p>
                    <button
                      type="submit"
                      className="inline-flex w-32 justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600 "
                    >
                      {t("submit")}
                    </button>
                  </div>
                  <div>
                    {image && (
                      <img
                        className="h-auto max-w-full"
                        src={URL.createObjectURL(image)}
                      />
                    )}
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium  hover:bg-gray-500"
                      onClick={() => {
                        setGalleryModalOpened(false);
                        reset();
                        setImage(undefined);
                        clearErrors();
                      }}
                    >
                      {t("Back")}
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
