import { Place } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { trpc } from "../utils/trpc";
import AddEntry from "./EditingComponents/AddEntry";
import EditEntry from "./EditingComponents/EditEntry";
import ImportFromCSV from "./EditingComponents/ImportFromCSV";
import LoadingOverlay from "./LoadingOverlay";

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

const tableThreads = ["Name", "Address", "Category", "Tags", "Last Updated"];

export default function EditingComponent() {
  const { data: session } = useSession();

  const [query, setQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Place>();
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);

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
          placeholder="Search by name..."
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
          Add New Entry
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
          Import from CSV
        </button>
      </nav>
      <div className="divider px-2 before:bg-secondary after:bg-secondary"></div>
      <main className="overflow-x-auto px-2">
        {getEntries.isFetched && getEntries.data ? (
          <table className="w-full text-left ">
            <thead>
              <tr>
                {tableThreads.map((thread, index) => {
                  return (
                    <th key={index} className="px-4 py-2 text-base">
                      {thread}
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
                      className="text-base odd:bg-primary-800 hover:cursor-pointer hover:bg-primary-700"
                      onClick={() => {
                        setSelectedEntry(entry);
                        setEditModalOpened(true);
                      }}
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
            onDelete={(data) => {
              deleteEntry.mutate(data);
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
