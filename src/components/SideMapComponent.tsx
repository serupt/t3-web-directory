import {
  Accordion,
  Badge,
  Button,
  Divider,
  Group,
  ScrollArea,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { Places } from "@prisma/client";
import { useState } from "react";
import { MapProps } from "./DisplayMap";
import EntryCard from "./EntryCard";

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

export default function SideMapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
  selectedTag,
  setSelectedTag,
}: MapProps) {
  const [currentEntries, setCurrentEntries] = useState<Places[]>(entryData);
  const [query, setQuery] = useState("");
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
                  {selectedEntry.opening_hours.split(",").map((day, index) => (
                    <Text key={index}>{day.trim()}</Text>
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
                    <EntryCard
                      filteredEntry={filteredEntry}
                      setSelectedEntry={setSelectedEntry}
                    />
                  );
                })}
            </SimpleGrid>
          </ScrollArea>
        </>
      ) : query ? (
        <>
          <TextInput
            placeholder="Search entries..."
            mb={10}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ScrollArea style={{ height: "calc(100vh - 110px)" }}>
            <SimpleGrid cols={1}>
              {entryData
                .filter((entry) =>
                  entry.name
                    .toLocaleLowerCase()
                    .includes(query.toLocaleLowerCase().trim())
                )
                .sort((a, b) =>
                  a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()
                    ? -1
                    : 1
                )
                .map((filteredEntry) => {
                  return (
                    <EntryCard
                      filteredEntry={filteredEntry}
                      setSelectedEntry={setSelectedEntry}
                    />
                  );
                })}
            </SimpleGrid>
          </ScrollArea>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Search entries..."
            mb={10}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ScrollArea style={{ height: "calc(100vh - 110px)" }}>
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
          </ScrollArea>
        </>
      )}
    </>
  );
}
