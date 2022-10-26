import { Combobox, Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Places } from "@prisma/client";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import {
  DeleteEntryInput,
  EditEntryInput,
  editEntrySchema,
} from "../../utils/validation/entries.schema";

interface EditEntryProps {
  selectedEntry: Places;
  setSelectedEntry: Dispatch<SetStateAction<Places | undefined>>;
  editModalOpened: boolean;
  setEditModalOpened: Dispatch<SetStateAction<boolean>>;
  tagData: string[];
  categoryData: string[];
  onEdit: (data: EditEntryInput) => void;
  onDelete: (data: DeleteEntryInput) => void;
}
export default function EditEntry({
  selectedEntry,
  setSelectedEntry,
  editModalOpened,
  setEditModalOpened,
  categoryData,
  tagData,
  onEdit,
  onDelete,
}: EditEntryProps) {
  const { register, formState, handleSubmit, setValue, getValue } =
    useForm<EditEntryInput>({
      resolver: zodResolver(editEntrySchema),
      defaultValues: selectedEntry,
    });

  const onSubmit: SubmitHandler<EditEntryInput> = (data) => {
    onEdit(data);
  };
  const [query, setQuery] = useState("");
  const [currentTags, setCurrentTags] = useState(selectedEntry.tags);
  const [currentCategory, setCurrentCategory] = useState(
    selectedEntry.category
  );

  const filteredCategory =
    query === ""
      ? categoryData
      : categoryData.filter((category) =>
          category
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredTags =
    query === ""
      ? tagData
      : tagData.filter((tag) =>
          tag
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Transition appear show={editModalOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setSelectedEntry(undefined);
          setEditModalOpened(false);
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
                  {selectedEntry.name}
                </Dialog.Title>
                <div className="mt-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-3">
                      <label className="block">
                        <span className="mb-2 block">Name</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                          type="text"
                          {...register("name")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Address</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                          type="text"
                          {...register("main_address")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Description</span>
                        <textarea
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("description")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Other Addresses</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("other_addresses")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Phone Number</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("phone_number")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Website</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("website")}
                        />
                      </label>
                      <label className="block">
                        <Combobox
                          value={currentCategory}
                          onChange={setCurrentCategory}
                        >
                          <Combobox.Label className="mb-2 block">
                            Category
                          </Combobox.Label>
                          <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-primary text-left shadow-md sm:text-sm">
                              <Combobox.Input
                                className="input-md w-full rounded bg-primary-800 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                {...(register("category"),
                                {
                                  onChange(event) {
                                    setQuery(event.target.value);
                                    setValue("category", event.target.value, {
                                      shouldDirty: true,
                                    });
                                  },
                                })}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 focus:outline-none focus:ring-2 focus:ring-secondary">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-5 w-5 text-white"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                  />
                                </svg>
                              </Combobox.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              afterLeave={() => setQuery("")}
                            >
                              <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded bg-primary-700 py-1  text-base shadow-lg sm:text-sm">
                                {query.length > 0 && (
                                  <Combobox.Option
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-secondary text-white"
                                          : "text-white"
                                      }`
                                    }
                                    value={query}
                                  >
                                    Create "{query}"
                                  </Combobox.Option>
                                )}
                                {filteredCategory
                                  .sort()
                                  .map((category, index) => (
                                    <Combobox.Option
                                      key={index}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                          active
                                            ? "bg-secondary text-white"
                                            : "text-white"
                                        }`
                                      }
                                      value={category}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {category}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active
                                                  ? "text-white"
                                                  : "text-secondary"
                                              }`}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-5 w-5"
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
                                    </Combobox.Option>
                                  ))}
                              </Combobox.Options>
                            </Transition>
                          </div>
                        </Combobox>
                      </label>
                      {/* <label className="block">
                        <span className="mb-2 block">Category</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("category")}
                        />
                      </label> */}
                      <label className="block">
                        <Combobox
                          value={currentTags}
                          onChange={(tag) => {
                            setCurrentTags(tag);
                            setValue("tags", tag, { shouldDirty: true });
                          }}
                          multiple
                        >
                          <Combobox.Label className="mb-2 block">
                            Tags
                          </Combobox.Label>
                          {currentTags.length > 0 && (
                            <ul className="flex space-x-2">
                              {currentTags.map((tag, index) => (
                                <li
                                  key={index}
                                  className="badge truncate bg-secondary-600 px-3"
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-primary text-left shadow-md sm:text-sm">
                              <Combobox.Input
                                className="input-md w-full rounded bg-primary-800 focus:outline-none focus:ring-0 focus:ring-offset-0"
                                placeholder="Select or add new tags. Select tag again to remove it."
                                {...(register("tags"),
                                {
                                  onChange(event) {
                                    setQuery(event.target.value);
                                  },
                                })}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 focus:outline-none focus:ring-2 focus:ring-secondary">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="h-5 w-5 text-white"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                  />
                                </svg>
                              </Combobox.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              afterLeave={() => setQuery("")}
                            >
                              <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded bg-primary-700 py-1  text-base shadow-lg sm:text-sm">
                                {query.length > 0 && query.trim() !== "" && (
                                  <Combobox.Option
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-secondary text-white"
                                          : "text-white"
                                      }`
                                    }
                                    value={query.trim()}
                                  >
                                    Create "{query}"
                                  </Combobox.Option>
                                )}
                                {filteredTags
                                  .sort((a, b) =>
                                    a.toLocaleLowerCase() <
                                    b.toLocaleLowerCase()
                                      ? -1
                                      : 1
                                  )
                                  .map((tag, index) => (
                                    <Combobox.Option
                                      key={index}
                                      className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                          active
                                            ? "bg-secondary text-white"
                                            : "text-white"
                                        }`
                                      }
                                      value={tag}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {tag}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active
                                                  ? "text-white"
                                                  : "text-secondary"
                                              }`}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="h-5 w-5"
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
                                    </Combobox.Option>
                                  ))}
                              </Combobox.Options>
                            </Transition>
                          </div>
                        </Combobox>
                      </label>
                      {/* <label className="block">
                        <span className="mb-2 block">Tags</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("tags")}
                        />
                      </label> */}
                      <label className="block">
                        <span className="mb-2 block">Opening Hours</span>
                        <textarea
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("opening_hours")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Latitude</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("coords_lat")}
                        />
                      </label>
                      <label className="block">
                        <span className="mb-2 block">Longitude</span>
                        <input
                          className="input-md w-full rounded bg-primary-800 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          {...register("coords_lng")}
                        />
                      </label>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-around">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium  hover:bg-gray-400 "
                          onClick={() => {
                            setEditModalOpened(false);
                            setSelectedEntry(undefined);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!formState.isDirty}
                          className="inline-flex justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium  hover:bg-secondary-600 "
                        >
                          Confirm
                        </button>
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
