import { Place } from "@prisma/client";
import { useState } from "react";
import { MapProps } from "./DisplayMap";
import DefaultView from "./SideMap/DefaultView";
import SelectedEntryView from "./SideMap/SelectedEntryView";
import SelectedTagView from "./SideMap/SelectedTagView";

export function getUniqueCategoryTags(data: Place[], category: string) {
  const uniqueTag: string[] = [];
  data.map((value) => {
    if (value.category === category) {
      value.tags.map((tag) => {
        if (!uniqueTag.includes(tag)) {
          uniqueTag.push(tag);
        }
      });
    }
  });
  return uniqueTag;
}

export function getUniqueCategories(data: Place[]) {
  const uniqueCategories: string[] = [];
  data.map((value) => {
    if (!uniqueCategories.includes(value.category)) {
      uniqueCategories.push(value.category);
    }
  });
  return uniqueCategories;
}

export default function SideMapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
  selectedTag,
  setSelectedTag,
}: MapProps) {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="space-y-3 p-3">
        {selectedEntry || selectedTag ? (
          <button
            onClick={() => {
              if (selectedEntry) {
                setSelectedEntry(undefined);
              } else {
                setSelectedTag("");
              }
            }}
            className="btn-sm w-full rounded bg-secondary hover:bg-secondary-600"
          >
            Back
          </button>
        ) : (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by name..."
            className=" input-sm w-full  rounded bg-primary-800  focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        )}
        <div className="divider before:bg-secondary after:bg-secondary"></div>
        <div>
          {selectedEntry ? (
            <SelectedEntryView selectedEntry={selectedEntry} />
          ) : selectedTag || query ? (
            <SelectedTagView
              entryData={entryData}
              query={query}
              setQuery={setQuery}
              setSelectedEntry={setSelectedEntry}
              selectedTag={selectedTag}
            />
          ) : (
            <DefaultView
              entryData={entryData}
              setSelectedTag={setSelectedTag}
            />
          )}
        </div>
      </div>
    </>
  );
}
