import { Dialog, Transition } from "@headlessui/react";
import { Place } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction } from "react";

interface GalleryProps {
  selectedEntry: Place;
  setSelectedEntry: Dispatch<SetStateAction<Place | undefined>>;
  galleryModalOpened: boolean;
  setGalleryModalOpened: Dispatch<SetStateAction<boolean>>;
}

export default function Gallery({
  selectedEntry,
  setSelectedEntry,
  galleryModalOpened,
  setGalleryModalOpened,
}: GalleryProps) {
  return (
    <Transition appear show={galleryModalOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setSelectedEntry(undefined);
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
