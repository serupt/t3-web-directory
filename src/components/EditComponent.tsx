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
  Modal,
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
import { EditEntrySchema } from "../common/validation/entries.schema";
import { useForm } from "@mantine/form";

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
  const [selected, setSelected] = useState<Places>();
  const [modalOpened, setModalOpened] = useState(false);

  const getEntries = trpc.useQuery(["entries.get-all-entries"]);

  const editEntry = trpc.useMutation(["entries.edit-entry"]);

  const form = useForm<EditEntrySchema>({
    initialValues: {
      id: "",
      name: "",
      description: "",
      address: "",
      phone_number: "",
      website: "",
      category: "",
      tags: [],
      opening_hours: "",
      coords_lat: "",
      coords_lng: "",
    },
  });

  return (
    <div>
      {getEntries.isFetched ? (
        <ScrollArea>
          <Group position="left">
            <TextInput
              placeholder="Search entries..."
              mb="md"
              // value={search}
            />
          </Group>
          <Divider pb={10} />
          <Modal opened={modalOpened} onClose={() => setModalOpened(false)}>
            {selected?.name}
          </Modal>
          <Table highlightOnHover verticalSpacing={"md"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {getEntries.data?.map((element) => (
                <tr
                  key={element.places_id}
                  onClick={() => {
                    setSelected(element);
                    setModalOpened(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
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
