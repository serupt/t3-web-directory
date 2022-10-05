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
  Textarea,
  MultiSelect,
} from "@mantine/core";
import {
  openConfirmModal,
  openModal,
  closeAllModals,
  closeModal,
} from "@mantine/modals";
import { Places } from "@prisma/client";
import { IconSearch, IconMenu2 } from "@tabler/icons";
import Link from "next/link";

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

  // const { handleSubmit, register } = useForm<CreateEntryInput>();

  const hello = trpc.useQuery(["example.getAll"]);

  const editModal = (element: Places) =>
    openModal({
      title: `Editing ${element.name}`,
      children: (
        <SimpleGrid cols={1}>
          <TextInput label="ID" placeholder={element.places_id} disabled />
          <TextInput label="Name" placeholder={element.name} />
          <Textarea label="Description" placeholder={element.description} />
          <TextInput label="Address" placeholder={element.address} />
          <TextInput label="Phone Number" placeholder={element.phone_number} />
          <TextInput label="Website" placeholder={element.website} />
          <TextInput label="Category" placeholder={element.category} />
          <TextInput label="Tags" placeholder={element.tags.join(" ")} />
          <Textarea placeholder="Daily: 9am-6pm" label="Opening Hours" />
          <Text>For google map markers</Text>
          <Group position="apart">
            <TextInput label="Latitude" placeholder={element.coords_lat} />
            <TextInput label="Longitude" placeholder={element.coords_lng} />
          </Group>
        </SimpleGrid>
      ),
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
                  key={element.places_id}
                  onClick={() => editModal(element)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{element.places_id}</td>
                  <td>{element.name}</td>
                  <td>{element.address}</td>
                  <td>{element.category}</td>
                  <td>
                    {element.tags.map((tag, index) => {
                      return <Badge key={index}>{tag.trim()}</Badge>;
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
