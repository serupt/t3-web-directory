import { Places } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface SelectedTagViewProps {
  entryData: Places[];
  selectedTag: string;
  setSelectedEntry: Dispatch<SetStateAction<Places | undefined>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

export default function SelectedTagView({
  entryData,
  query,
  setQuery,
  setSelectedEntry,
  selectedTag,
}: SelectedTagViewProps) {
  return (
    <div className="space-y-2">
      {query !== ""
        ? entryData
            .filter((entry) =>
              entry.name
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase().trim())
            )
            .sort((a, b) =>
              a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
            )
            .map((filteredEntry) => {
              return (
                <div
                  key={filteredEntry.id}
                  className=" w-90 card bg-primary-800 shadow-xl hover:bg-primary-700"
                  onClick={() => {
                    setQuery("");
                    setSelectedEntry(filteredEntry);
                  }}
                >
                  <div className="card-body">
                    <h3 className="card-title text-base font-bold">
                      {filteredEntry.name}
                    </h3>
                    {filteredEntry.description ? (
                      <p className="truncate text-sm">
                        {filteredEntry.description}
                      </p>
                    ) : null}
                    <div className="space-x-1 truncate">
                      {filteredEntry.tags.sort().map((tag, index) => {
                        return (
                          <span
                            key={index}
                            className="badge bg-secondary-600 px-3"
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
        : entryData
            .filter((entry) => entry.tags.includes(selectedTag))
            .sort((a, b) =>
              a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase() ? -1 : 1
            )
            .map((filteredEntry) => {
              return (
                <div
                  key={filteredEntry.id}
                  className=" w-90 card bg-primary-800 shadow-xl hover:bg-primary-700"
                  onClick={() => setSelectedEntry(filteredEntry)}
                >
                  <div className="card-body">
                    <h3 className="card-title text-base font-bold">
                      {filteredEntry.name}
                    </h3>
                    {filteredEntry.description ? (
                      <p className="truncate text-sm">
                        {filteredEntry.description}
                      </p>
                    ) : null}
                    <div className="space-x-1 truncate">
                      {filteredEntry.tags.sort().map((tag, index) => {
                        return (
                          <span
                            key={index}
                            className="badge bg-secondary-600 px-3"
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
    </div>
  );
}
