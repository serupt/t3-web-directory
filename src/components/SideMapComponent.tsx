import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Places } from "@prisma/client";
import { MapProps } from "./DisplayMap";
import { useState } from "react";

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
        <>
          <Button onClick={() => setSelectedEntry(undefined)} fullWidth mb={15}>
            Back
          </Button>
          <Divider p={10} />
          <ScrollArea style={{ height: "calc(100vh - 110px)" }}>
            <SimpleGrid cols={1}>
              <Text size={36} weight={"bold"}>
                {selectedEntry.name}
              </Text>
              <Text
                underline
                color={"blue"}
                size={"lg"}
                weight={"bold"}
                component="a"
                href={`https://www.google.com/maps/dir/?api=1&destination=${
                  selectedEntry.coords_lat + "," + selectedEntry.coords_lng
                }`}
                target="_blank"
              >
                {"➥ " + selectedEntry.address}
              </Text>
              <Divider />
              <Text size={20}>{selectedEntry.category}</Text>
              <Group>
                {selectedEntry.tags.map((tag, index) => {
                  if (!tag) {
                    return;
                  }
                  return <Badge key={index}>{tag.trim()}</Badge>;
                })}
              </Group>
              <Divider />
              {selectedEntry.description ? (
                <>
                  <Text>{selectedEntry.description}</Text>
                  <Divider />
                </>
              ) : null}
              {selectedEntry.phone_number ? (
                <>
                  <Text size={20}>Phone Number:</Text>
                  <Text>{selectedEntry.phone_number}</Text>
                  <Divider />
                </>
              ) : null}

              {selectedEntry.website ? (
                <>
                  <Text size={20}>Website:</Text>
                  <Text
                    underline
                    color={"blue"}
                    size={"lg"}
                    weight={"bold"}
                    component="a"
                    href={selectedEntry.website}
                    target="_blank"
                  >
                    {selectedEntry.website}
                  </Text>
                  <Divider />
                </>
              ) : null}

              {selectedEntry.opening_hours ? (
                <>
                  <Text size={20}>Opening Hours:</Text>
                  {selectedEntry.opening_hours.split(",").map((day) => (
                    <Text>{day.trim()}</Text>
                  ))}
                </>
              ) : null}
            </SimpleGrid>
          </ScrollArea>
        </>
      ) : selectedTag ? (
        <>
          <Button onClick={() => setSelectedTag("")} fullWidth mb={15}>
            Back
          </Button>
          <Divider p={10} />
          <ScrollArea style={{ height: "calc(100vh - 110px)" }}>
            <SimpleGrid cols={1}>
              {entryData
                .filter((entry) => entry.tags.includes(selectedTag))
                .sort((a, b) =>
                  a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()
                    ? -1
                    : 1
                )
                .map((filteredEntry) => {
                  return (
                    <Card
                      p={"md"}
                      key={filteredEntry.places_id}
                      onClick={() => setSelectedEntry(filteredEntry)}
                      style={{ cursor: "pointer" }}
                    >
                      <Center p={5}>
                        <Card.Section>{filteredEntry.name}</Card.Section>
                      </Center>
                      <Center>
                        <Text>{filteredEntry.address}</Text>
                      </Center>
                      {filteredEntry.tags.map((tag) => {
                        return <Badge>{tag}</Badge>;
                      })}
                    </Card>
                  );
                })}
            </SimpleGrid>
          </ScrollArea>
        </>
      ) : (
        <Accordion variant="filled">
          {getUniqueCategories(currentEntries)
            .sort()
            .map((category) => {
              return (
                <Accordion.Item value={category} key={category}>
                  <Accordion.Control>{category}</Accordion.Control>
                  {getUniqueCategoryTags(currentEntries, category)
                    .sort()
                    .map((tag) => {
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
