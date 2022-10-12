import { Grid, LoadingOverlay } from "@mantine/core";
import { Places } from "@prisma/client";
import { trpc } from "../utils/trpc";
import MapComponent from "./MapComponent";
import SideMapComponent from "./SideMapComponent";
import { Dispatch, SetStateAction, useState } from "react";

export interface MapProps {
  entryData: Places[];
  selectedEntry: Places | undefined;
  setSelectedEntry: Dispatch<SetStateAction<Places | undefined>>;
  selectedTag: string;
  setSelectedTag: Dispatch<SetStateAction<string>>;
}

export default function DisplayMap() {
  const getData = trpc.useQuery(["entries.get-all-entries"]);
  const [selectedEntry, setSelectedEntry] = useState<Places>();
  const [selectedTag, setSelectedTag] = useState("");

  return getData.isFetched ? (
    <Grid gutter={0}>
      <Grid.Col span={3} p={18}>
        <SideMapComponent
          entryData={getData.data!}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </Grid.Col>
      <Grid.Col span={"auto"} p={0}>
        <MapComponent
          entryData={getData.data!}
          selectedEntry={selectedEntry}
          setSelectedEntry={setSelectedEntry}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
      </Grid.Col>
    </Grid>
  ) : (
    <LoadingOverlay visible />
  );
}
