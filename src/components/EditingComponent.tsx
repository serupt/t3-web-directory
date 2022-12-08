import { Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { trpc } from "../utils/trpc";
import AddEntry from "./EditingComponents/AddEntry";
import EditEntry from "./EditingComponents/EditEntry";
import ImportFromCSV from "./EditingComponents/ImportFromCSV";
import LoadingOverlay from "./LoadingOverlay";

import { useTranslation } from "next-i18next";
import { Menu, Transition } from "@headlessui/react";
import Gallery from "./Gallery";
import DeleteEntryConfirmation from "./EditingComponents/DeleteEntryConfirmation";

function getUniqueTags(data: Place[]) {
  const uniqueTag: string[] = [];
  data.map((value) =>
    value.tags.map((tag) => {
      if (!uniqueTag.includes(tag)) {
        uniqueTag.push(tag);
      }
    })
  );
  return uniqueTag;
}

function getUniqueCategories(data: Place[]) {
  const uniqueCategories: string[] = [];
  data.map((value) => {
    if (!uniqueCategories.includes(value.category)) {
      uniqueCategories.push(value.category);
    }
  });
  return uniqueCategories;
}

function getSuccessNotificationMessage(message: string) {
  toast.success(message, {
    style: {
      borderRadius: "10px",
      background: "#2B303A",
      color: "#fff",
      borderColor: "#B392AC",
    },
    iconTheme: { primary: "#B392AC", secondary: "#fff" },
  });
}

function getErrorNotificationMessage(message: string) {
  toast.error(message, {
    style: {
      borderRadius: "10px",
      background: "#2B303A",
      color: "#fff",
      borderColor: "#B392AC",
    },
    iconTheme: { primary: "#B392AC", secondary: "#fff" },
  });
}

function checkIfAdmin(session: any) {
  if (session?.user?.role === "ADMIN") {
    return true;
  }
  return false;
}

const tableThreads = ["Name", "Address", "Category", "Tags", "Updated_At", ""];

export default function EditingComponent() {
  const { data: session } = useSession();

  const { t } = useTranslation("common");

  const [query, setQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Place>();
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [galleryModalOpened, setGalleryModalOpened] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [importOpen, setImportOpen] = useState(false);

  // Check if user is admin
  const getEntries = checkIfAdmin(session)
    ? trpc.places.getAll.useQuery()
    : trpc.places.getUserPlaces.useQuery();

  const addEntry = trpc.places.addEntry.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entry added successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  const editEntry = trpc.places.editEntry.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entry edited successfully");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  const deleteEntry = trpc.places.deleteEntry.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entry deleted successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  const importEntries = trpc.places.addManyEntries.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entries imported successfully!");
    },
    onError: () => {
      getErrorNotificationMessage("Please check your file and try again");
    },
  });
  return (
    <div>
      <nav className="flex items-center space-x-5 px-5 pt-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          //@ts-ignore
          placeholder={t("search")}
          className=" input-sm w-1/4  rounded bg-primary-800  focus:outline-none focus:ring-2 focus:ring-secondary"
        />
        <button
          className="btn btn-sm gap-2 bg-secondary-700 text-white hover:bg-secondary-600"
          onClick={() => setAddModalOpened(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {t("add_entry")}
        </button>
        <button
          onClick={() => setImportOpen(true)}
          className="btn btn-sm gap-2 bg-secondary-700 text-white hover:bg-secondary-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {t("import_csv")}
        </button>
      </nav>
      <div className="divider px-2 before:bg-secondary after:bg-secondary"></div>
      <main className="overflow-x-visible px-2">
        {getEntries.isFetched && getEntries.data ? (
          <table className="w-full text-left">
            <thead>
              <tr>
                {tableThreads.map((thread, index) => {
                  return (
                    <th key={index} className="px-4 py-2 text-base">
                      {t(`${thread.toLocaleLowerCase()}`)}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {getEntries.data
                .sort((a, b) =>
                  a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()
                    ? -1
                    : 1
                )
                .filter(
                  (entry) =>
                    entry.name
                      .toLocaleLowerCase()
                      .includes(query.toLocaleLowerCase().trim()) ||
                    entry.main_address
                      .toLocaleLowerCase()
                      .includes(query.toLocaleLowerCase().trim())
                )
                .map((entry) => {
                  return (
                    <tr
                      key={entry.id}
                      className="text-base odd:bg-primary-800  hover:bg-primary-700"
                    >
                      <td className="px-4 py-2">{entry.name}</td>
                      <td className="px-4 py-2">{entry.main_address}</td>
                      <td className="px-4 py-2">{entry.category}</td>
                      <td className="px-4 py-2">
                        {entry.tags.sort().map((tag, index) => {
                          return (
                            <span
                              key={index}
                              className="badge truncate bg-secondary-600 px-3 text-white"
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </td>
                      <td className="px-4 py-2">
                        {entry.updated_at.toLocaleDateString() +
                          " " +
                          entry.updated_at.toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">
                        {
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-0 px-2 py-2 hover:bg-opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-0">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                                  />
                                </svg>
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-50  w-32 origin-top-right divide-y divide-secondary rounded-md bg-primary-800 shadow-lg ring-1 ring-secondary  focus:outline-none">
                                <div className="px-1 py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active
                                            ? "bg-secondary text-white"
                                            : "text-white"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => {
                                          setSelectedEntry(entry);
                                          setEditModalOpened(true);
                                        }}
                                      >
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
                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                          />
                                        </svg>
                                        <p className="px-3">{t("Edit")}</p>
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active
                                            ? "bg-secondary text-white"
                                            : "text-white"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => {
                                          setSelectedEntry(entry);
                                          setGalleryModalOpened(true);
                                        }}
                                      >
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
                                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                          />
                                        </svg>
                                        <p className="px-3">{t("Gallery")}</p>
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                                <div className="px-1 py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        className={`${
                                          active
                                            ? "bg-red-700 text-white"
                                            : "text-white"
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        onClick={() => {
                                          setSelectedEntry(entry);
                                          setShowDeleteConfirmation(true);
                                        }}
                                      >
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
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                          />
                                        </svg>
                                        <p className="px-3">{t("Delete")}</p>
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        }
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <LoadingOverlay />
        )}
      </main>
      <>
        {getEntries.data && selectedEntry ? (
          <EditEntry
            selectedEntry={selectedEntry}
            setSelectedEntry={setSelectedEntry}
            editModalOpened={editModalOpened}
            setEditModalOpened={setEditModalOpened}
            tagData={getUniqueTags(getEntries.data)}
            categoryData={getUniqueCategories(getEntries.data)}
            onEdit={(data) => {
              editEntry.mutate(data);
              setEditModalOpened(false);
              setSelectedEntry(undefined);
            }}
          />
        ) : null}
        {getEntries.data && (
          <AddEntry
            addModalOpened={addModalOpened}
            setAddModalOpened={setAddModalOpened}
            tagData={getUniqueTags(getEntries.data)}
            categoryData={getUniqueCategories(getEntries.data)}
            onAdd={(data) => {
              addEntry.mutate(data);
              setAddModalOpened(false);
            }}
          />
        )}
        {getEntries.data && selectedEntry ? (
          <Gallery
            selectedEntry={selectedEntry}
            setSelectedEntry={setSelectedEntry}
            galleryModalOpened={galleryModalOpened}
            setGalleryModalOpened={setGalleryModalOpened}
          />
        ) : null}
        {getEntries.data && selectedEntry ? (
          <DeleteEntryConfirmation
            selectedEntry={selectedEntry}
            showDeleteConfirmation={showDeleteConfirmation}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
            onDelete={(data) => {
              deleteEntry.mutate(data);
              setShowDeleteConfirmation(false);
              setSelectedEntry(undefined);
            }}
          />
        ) : null}
        <ImportFromCSV
          importOpen={importOpen}
          setImportOpen={setImportOpen}
          onImport={(data) => importEntries.mutate(data)}
        />
      </>
      <div>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
