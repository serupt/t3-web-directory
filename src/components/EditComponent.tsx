import { trpc } from "../utils/trpc";
import { useState, useEffect } from "react";
import {
  Button,
  Center,
  Badge,
  Divider,
  Group,
  LoadingOverlay,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  TextInput,
  ActionIcon,
  Container,
  SimpleGrid,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { Places } from "@prisma/client";
import { IconSearch, IconMenu2 } from "@tabler/icons";

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

  const openModal = (element: Places) =>
    openConfirmModal({
      title: `Editing ${element.name}`,
      children: (
        <SimpleGrid cols={1}>
          <TextInput label="ID" value={element.id} disabled />
          <TextInput label="Name" value={element.name} />
          <TextInput label="Address" value={element.address} />
          <TextInput label="Category" value={element.category} />
          <Group position="apart">
            <TextInput
              label="Latitude"
              value={JSON.stringify(element.coords)}
            />
            {/* <TextInput label="Longitude" value={element.coords?.lng} /> */}
          </Group>
        </SimpleGrid>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });

  return (
    <div>
      {hello.isFetched ? (
        <ScrollArea>
          <Group position="left">
            <TextInput
              placeholder="Search entries..."
              mb="md"

              // value={search}
            />
            <Button mb={"md"}>Add Entry</Button>
          </Group>
          <Divider pb={10} />
          <Table highlightOnHover verticalSpacing={"md"}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {hello.data?.map((element) => (
                <tr
                  key={element.id}
                  onClick={() => openModal(element)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{element.id}</td>
                  <td>{element.name}</td>
                  <td>{element.address}</td>
                  <td>{element.category}</td>
                  <td>
                    {element.tags.map((tag, index) => {
                      return <Badge key={index}>{tag}</Badge>;
                    })}
                  </td>
                  <td>
                    {element.updated_at.toLocaleDateString() +
                      " " +
                      element.updated_at.toLocaleTimeString()}
                  </td>
                  {/* <td>
                    <ActionIcon variant="transparent">
                      <IconMenu2 size={12} />
                    </ActionIcon>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      ) : (
        <LoadingOverlay visible />
      )}
    </div>
  );
}
