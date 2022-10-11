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

function filterTaggedEntries(
  query: string,
  data: Places[],
  setEntry: Dispatch<SetStateAction<Places | undefined>>
) {}

export default function SideMapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
}: MapProps) {
  const [currentEntries, setCurrentEntries] = useState<Places[]>(entryData);
  const [selectedTag, setSelectedTag] = useState("");
  return (
    <>
      {selectedEntry ? (
        <SimpleGrid cols={1}>
          <Text>{selectedEntry.name}</Text>
          <Text
            weight={"bold"}
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
      ) : (
        <Accordion>
          {getUniqueCategories(currentEntries).map((category) => {
            return (
              <Accordion.Item value={category}>
                <Accordion.Control>{category}</Accordion.Control>
                {getUniqueCategoryTags(currentEntries, category).map((tag) => {
                  return (
                    <Accordion.Panel
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
