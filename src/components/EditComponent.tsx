import { trpc } from "../utils/trpc";
import { useState, useEffect } from "react";
import {
  Button,
  Center,
  clsx,
  Divider,
  Group,
  LoadingOverlay,
  ScrollArea,
  Skeleton,
  Text,
  TextInput,
} from "@mantine/core";
import { Places } from "@prisma/client";
import { IconSearch } from "@tabler/icons";

function filterData(data: Places[], search: string) {
  const query = search.toLocaleLowerCase().trim();
  return data.filter((item) => {
    item.name.includes(query) ||
      item.category.includes(query) ||
      item.tags.includes(query);
  });
}

export default function EditComponent() {
  const [search, setSearch] = useState("");
  const hello = trpc.useQuery(["example.getAll"]);

  return (
    <div>
      {hello.isFetched ? (
        <ScrollArea>
          <Group position="left">
            <TextInput
              styles={{
                input: {
                  color: "black",
                },
              }}
              placeholder="Search by any field"
              mb="md"

              // value={search}
            />
            <Button mb={"md"}>SUP</Button>
          </Group>
          <Divider pb={10} />
          <div>
            {hello.data?.map((entry) => (
              <Text>{entry.name}</Text>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <LoadingOverlay visible />
      )}
    </div>
  );
}
