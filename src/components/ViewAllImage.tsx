import { Dialog, Transition } from "@headlessui/react";
import { PlaceImages } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";

interface ViewAllImageProps {
  entryName: string;
  viewAllImage: boolean;
  entryImages: PlaceImages[];
  setViewAllImage: Dispatch<SetStateAction<boolean>>;
}

export default function ViewAllImage({
  viewAllImage,
  setViewAllImage,
  entryImages,
  entryName,
}: ViewAllImageProps) {
  const { t } = useTranslation("common");

  return (
    <Transition appear show={viewAllImage} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setViewAllImage(false);
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
                  {entryName} {t("gallery")}
                </Dialog.Title>
                <div>
                  <div className="divider before:bg-secondary after:bg-secondary"></div>
                  {entryImages.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {entryImages.map((placeImages) => {
                        return (
                          <div className="relative h-48 w-48 rounded-lg border-2 border-solid border-secondary">
                            <Image
                              src={placeImages.image_url}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>No images found. Please upload an image.</div>
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
