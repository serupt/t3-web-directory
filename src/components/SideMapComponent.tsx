import { Button, Center, SimpleGrid, Text } from "@mantine/core";
import { MapProps } from "./DisplayMap";

export default function SideMapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
}: MapProps) {
  return (
    <Center>
      {selectedEntry ? (
        <SimpleGrid cols={1}>
          <Text>{selectedEntry.name}</Text>
          <Text
            component="a"
            href={`https://www.google.com/maps/dir/?api=1&destination=${
              selectedEntry.coords_lat + "," + selectedEntry.coords_lng
            }`}
          >
            {selectedEntry.address}
          </Text>
          <Text>{selectedEntry.description}</Text>
          <Text>{selectedEntry.category}</Text>
          <Text>{selectedEntry.opening_hours}</Text>
        </SimpleGrid>
      ) : null}
    </Center>
  );
}
