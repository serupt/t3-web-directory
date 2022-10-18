import { Badge, Card, Center, Divider, Text } from "@mantine/core";
import { Places } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface EntryCardProps {
  filteredEntry: Places;
  setSelectedEntry: Dispatch<SetStateAction<Places | undefined>>;
}

export default function EntryCard({
  filteredEntry,
  setSelectedEntry,
}: EntryCardProps) {
  return (
    <Card
      p={"md"}
      key={filteredEntry.places_id}
      onClick={() => setSelectedEntry(filteredEntry)}
      style={{ cursor: "pointer" }}
    >
      <Center p={5}>
        <Card.Section>
          <Text size={24}>{filteredEntry.name}</Text>
        </Card.Section>
      </Center>
      <Center>
        <Text>{filteredEntry.address}</Text>
      </Center>
      <Divider m={5} />
      {filteredEntry.description ? (
        <>
          <Text>{filteredEntry.description}</Text>
          <Divider m={5} />
        </>
      ) : null}
      {filteredEntry.tags.map((tag, index) => {
        return <Badge key={index}>{tag}</Badge>;
      })}
    </Card>
  );
}
