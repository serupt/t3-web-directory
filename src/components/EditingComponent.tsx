import type { Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../utils/api";
import AddEntry from "./EditingComponents/AddEntry";
import EditEntry from "./EditingComponents/EditEntry";
import ImportFromCSV from "./EditingComponents/ImportFromCSV";
import LoadingOverlay from "./LoadingOverlay";

import { useTranslation } from "next-i18next";
import Gallery from "./Gallery";
import DeleteEntryConfirmation from "./EditingComponents/DeleteEntryConfirmation";
import EditTable from "./EditingComponents/EditTable";
import { type Session } from "next-auth";

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

// function checkIfAdmin(session: Session) {
//   if (session?.user?.role === "ADMIN") {
//     return true;
//   }
//   return false;
// }

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
  const getEntries =
    session && session.user?.role === "ADMIN"
      ? api.places.getAll.useQuery()
      : api.places.getUserPlaces.useQuery();

  const addEntry = api.places.addEntry.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entry added successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  const editEntry = api.places.editEntry.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entry edited successfully");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  const deleteEntry = api.places.deleteEntry.useMutation({
    onSuccess: () => {
      getEntries.refetch();
      getSuccessNotificationMessage("Entry deleted successfully!");
    },
    onError: (e) => getErrorNotificationMessage(e.message),
  });

  const importEntries = api.places.addManyEntries.useMutation({
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
      <nav className="mb-[-10px] flex items-center space-x-5 px-5 pt-3">
        <button
          className="btn-sm btn gap-2 bg-secondary-700 text-white hover:bg-secondary-600"
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
          className="btn-sm btn gap-2 bg-secondary-700 text-white hover:bg-secondary-600"
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
      <main className="overflow-x-visible px-2 ">
        {getEntries.isFetched && getEntries.data ? (
          <EditTable
            entries={getEntries.data}
            setSelectedEntry={setSelectedEntry}
            setEditModalOpened={setEditModalOpened}
            setGalleryModalOpened={setGalleryModalOpened}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
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
