import { Place } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";
import LoadingOverlay from "./LoadingOverlay";
import MapComponent from "./MapComponent";
import SideMapComponent from "./SideMapComponent";

export interface MapProps {
  entryData: Place[];
  selectedEntry: Place | undefined;
  setSelectedEntry: Dispatch<SetStateAction<Place | undefined>>;
  selectedTag: string;
  setSelectedTag: Dispatch<SetStateAction<string>>;
}

export default function DisplayMap() {
  const getEntries = trpc.places.getAll.useQuery();
  const [selectedEntry, setSelectedEntry] = useState<Place>();
  const [selectedTag, setSelectedTag] = useState("");

  return getEntries.isFetched && getEntries.data ? (
    <div className="min-h-screen sm:flex ">
      <aside className="scrollbar-hide max-h-screen w-full flex-none overflow-auto sm:max-w-lg">
        <SideMapComponent
          entryData={getEntries.data}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </aside>
      <main className=" flex-1">
        <MapComponent
          entryData={getEntries.data}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </main>
    </div>
  ) : (
    <LoadingOverlay />
  );
}
