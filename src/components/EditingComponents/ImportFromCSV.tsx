import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Papa, { ParseResult } from "papaparse";
import { Dispatch, Fragment, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import {
  ImportPlaceInput,
  PlaceInput,
} from "../../utils/validation/entries.schema";

interface Props {
  importOpen: boolean;
  setImportOpen: Dispatch<SetStateAction<boolean>>;
  onImport: (data: PlaceInput[]) => void;
}

interface FormData {
  item: FileList;
}

const checkHeaders = [
  "name",
  "phone_number",
  "email",
  "website",
  "description",
  "opening_hours",
  "main_address",
  "other_addresses",
  "latitude",
  "longitude",
  "category",
  "tags",
];

const FileSchema = z.object({
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
              return fileType === "text/csv";
            },
            {
              message: "File must be in .csv format",
            }
          )
          .refine(
            (file) => {
              const fileSize = file.item?.(0)?.size || 0;
              return fileSize <= 2000000;
            },
            { message: "File size must be less than 2MB" }
          ),
});

export default function ImportFromCSV({
  importOpen,
  setImportOpen,
  onImport,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FileSchema),
    defaultValues: undefined,
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    Array.from(data.item)
      .filter((file) => file.type === "text/csv")
      .forEach(async (file) => {
        const text = await file.text();
        const result: ParseResult<ImportPlaceInput> = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader(header) {
            if (checkHeaders.includes(header.toLocaleLowerCase().trim())) {
              return header.toLocaleLowerCase().trim();
            } else {
              return "ERROR";
            }
          },
        });
        if (
          result.errors.length === 0 &&
          result.meta.fields !== undefined &&
          !result.meta.fields.includes("ERROR")
        ) {
          const convertedArray = result.data.map((item) => {
            return {
              name: item.name.trim(),
              phone_number: item.phone_number.trim(),
              email: item.email.trim(),
              website: item.website.trim(),
              description: item.description.trim(),
              opening_hours: item.opening_hours.trim(),

              main_address: item.main_address.trim(),
              other_addresses: item.other_addresses.split(","),
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),

              category: item.category.trim(),
              tags: item.tags.split(","),
            };
          });
          onImport(convertedArray);
        } else {
          toast.error(
            `Please make sure the CSV headers are correct. Headers should only include [${checkHeaders.join(
              ", "
            )}]`,
            {
              style: {
                borderRadius: "10px",
                background: "#2B303A",
                color: "#fff",
                borderColor: "#B392AC",
              },
              iconTheme: { primary: "#B392AC", secondary: "#fff" },
              duration: 6000,
            }
          );
        }
      });
    reset();
  };
  return (
    <>
      <Transition appear show={importOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setImportOpen(false);
            reset();
            clearErrors();
          }}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Import from CSV
                  </Dialog.Title>

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input className="py-2" type="file" {...register("item")} />
                    {errors.item && (
                      <p className="p-1 text-xl text-red-600">
                        {errors.item.message}
                      </p>
                    )}

                    <div className="pt-2 pl-5 text-xs">
                      <ul className="list-disc">
                        <li>CSV files only</li>
                        <li>File size must be less than 2MB</li>
                      </ul>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium  hover:bg-gray-500"
                        onClick={() => {
                          setImportOpen(false);
                          reset();
                          clearErrors();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600 "
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
