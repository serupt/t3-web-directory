import { Places } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface EditingTableProps {
  entries: Places[];
  setSelectedEntry: Dispatch<SetStateAction<Places | undefined>>;
  setEditModalOpened: Dispatch<SetStateAction<boolean>>;
}

const tableThreads = ["Name", "Address", "Category", "Tags", "Last Updated"];

export default function EditingTable({
  entries,
  setSelectedEntry,
  setEditModalOpened,
}: EditingTableProps) {
  return (
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
        {entries
          .sort((a, b) =>
            a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
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
                  {entry.tags
                    .sort((a, b) =>
                      a.toLocaleLowerCase() < b.toLocaleLowerCase() ? -1 : 1
                    )
                    .map((tag, index) => {
                      return (
                        <span
                          key={index}
                          className="badge truncate bg-secondary-600 px-3"
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
  );
}
