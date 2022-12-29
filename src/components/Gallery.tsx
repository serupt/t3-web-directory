import { Dialog, Transition } from "@headlessui/react";
import { Place } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc";

import { useTranslation } from "next-i18next";
import Image from "next/image";
import DeleteConfirmation from "./DeleteConfirmation";
import {
  deleteImageSchema,
  ImageDeleteInput,
} from "../utils/validation/image.schema";

interface GalleryProps {
  selectedEntry: Place;
  setSelectedEntry: Dispatch<SetStateAction<Place | undefined>>;
  galleryModalOpened: boolean;
  setGalleryModalOpened: Dispatch<SetStateAction<boolean>>;
}

type FormValues = {
  item: FileList;
};

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
  const getImages = trpc.images.getPlaceImages.useQuery({
    placeId: selectedEntry.id,
  });

  const addImage = trpc.images.addImage.useMutation({
    onSuccess: () => {
      getImages.refetch();
    },
  });

  const deleteImage = trpc.images.deleteImage.useMutation({
    onSuccess: () => {
      getImages.refetch();
    },
  });

  const { t } = useTranslation("common");

  const [image, setImage] = useState<File | undefined>(undefined);

  const [confirmationModal, setConfirmationModal] = useState(false);

  const [currentID, setCurrentID] = useState<ImageDeleteInput | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ImageSchema),
    defaultValues: undefined,
  });

  const onDrop: SubmitHandler<FormValues> = (data) => {
    // console.log(data);
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const formData = new FormData();
    const fileArray = Array.from(data.item);
    fileArray.forEach((file) => {
      formData.append("file", file);
    });
    formData.append("upload_preset", "na38a6hp");

    const cloudinary = await fetch(
      "https://api.cloudinary.com/v1_1/cccnydirectory/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    addImage.mutate({
      placeId: selectedEntry.id,
      image_public_id: cloudinary.public_id,
      image_url: cloudinary.secure_url,
    });

    setImage(undefined);
    reset();
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
                <div>
                  <div className="divider before:bg-secondary after:bg-secondary"></div>
                  {getImages.data && getImages.data.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {getImages.data.map((placeImages) => {
                        return (
                          <div className="relative h-48 w-48 rounded-lg border-2 border-solid border-secondary">
                            <Image
                              src={placeImages.image_url}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                            <button
                              className="absolute top-1 right-1"
                              onClick={() => {
                                setConfirmationModal(true);
                                setCurrentID({
                                  imageId: placeImages.id,
                                  image_public_id: placeImages.image_public_id,
                                });
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#E32B2B"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>No images found. Please upload an image.</div>
                  )}
                  <div className="divider before:bg-secondary after:bg-secondary"></div>
                  <div className="mt-2 p-2">
                    <form
                      onChange={handleSubmit(onDrop)}
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <input
                        className="file-input file-input-bordered w-full"
                        type="file"
                        accept="image/png, image/jpeg"
                        {...register("item")}
                      />

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
                        <div className="flex space-x-2">
                          <button
                            className="inline-flex w-32 justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium hover:bg-red-600"
                            onClick={() => {
                              setImage(undefined);
                              reset();
                            }}
                          >
                            {t("clear")}
                          </button>
                          <button
                            type="submit"
                            className="inline-flex w-32 justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600"
                          >
                            {t("submit")}
                          </button>
                        </div>
                      </div>
                      <div className="items-center justify-center">
                        {image && (
                          <img
                            className="center h-auto max-w-xs items-center justify-center p-3"
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
                    </form>
                  </div>
                  {currentID && (
                    <DeleteConfirmation
                      currentID={currentID}
                      confirmationModal={confirmationModal}
                      setConfirmationModal={setConfirmationModal}
                      onDelete={(data) => {
                        setConfirmationModal(false);
                        deleteImage.mutate(data);
                      }}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
