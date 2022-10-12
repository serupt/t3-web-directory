import { Accordion, Button, Center, SimpleGrid, Text } from "@mantine/core";
import { Places } from "@prisma/client";
import { MapProps } from "./DisplayMap";
import { Dispatch, SetStateAction, useState } from "react";

function getUniqueCategoryTags(data: Places[], category: string) {
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

function getUniqueCategories(data: Places[]) {
  const uniqueCategories: string[] = [];
  data.map((value) => {
    if (!uniqueCategories.includes(value.category)) {
      uniqueCategories.push(value.category);
    }
  });
  return uniqueCategories;
}

function filterTaggedEntries(query: string, data: Places[]) {
  data.filter((place) => place.tags.includes(query));
}

export default function SideMapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
  selectedTag,
  setSelectedTag,
}: MapProps) {
  const [currentEntries, setCurrentEntries] = useState<Places[]>(entryData);
  return (
    <>
      {selectedEntry ? (
        <SimpleGrid cols={1}>
          <Button onClick={() => setSelectedEntry(undefined)}>Back</Button>
          <Text>{selectedEntry.name}</Text>
          <Text
            weight={"bold"}
            component="a"
            href={`https://www.google.com/maps/dir/?api=1&destination=${
              selectedEntry.coords_lat + "," + selectedEntry.coords_lng
            }`}
            target="_blank"
          >
            {selectedEntry.address}
          </Text>
          <Text>{selectedEntry.description}</Text>
          <Text>{selectedEntry.category}</Text>
          <Text>{selectedEntry.opening_hours}</Text>
        </SimpleGrid>
      ) : selectedTag ? (
        <>
          <Button onClick={() => setSelectedTag("")} fullWidth>
            Back
          </Button>
          <SimpleGrid cols={1}>
            {entryData
              .filter((entry) => entry.tags.includes(selectedTag))
              .map((filteredEntry) => {
                return (
                  <Text
                    key={filteredEntry.places_id}
                    onClick={() => setSelectedEntry(filteredEntry)}
                  >
                    {filteredEntry.name}
                  </Text>
                );
              })}
          </SimpleGrid>
        </>
      ) : (
        <Accordion variant="filled">
          {getUniqueCategories(currentEntries).map((category) => {
            return (
              <Accordion.Item value={category} key={category}>
                <Accordion.Control>{category}</Accordion.Control>
                {getUniqueCategoryTags(currentEntries, category).map((tag) => {
                  return (
                    <Accordion.Panel
                      key={tag}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedTag(tag);
                      }}
                    >
                      {tag}
                    </Accordion.Panel>
                  );
                })}
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </>
  );
}
