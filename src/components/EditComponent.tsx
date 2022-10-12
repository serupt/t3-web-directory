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

import { Places } from "@prisma/client";
import EditForm from "./EditForm";

function filterData(data: Places[], search: string) {
  const query = search.toLocaleLowerCase().trim();
  return data.filter((item) => {
    item.name.includes(query) ||
      item.category.includes(query) ||
      item.tags.includes(query);
  });
}

function getUniqueTags(data: Places[]) {
  const uniqueTag: string[] = [];
  data.map((value) =>
    value.tags.map((tag) => {
      if (!uniqueTag.includes(tag)) {
        uniqueTag.push(tag);
      }
    })
  );
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

export default function EditComponent() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Places>();
  const [modalOpened, setModalOpened] = useState(false);

  const getEntries = trpc.useQuery(["entries.get-all-entries"]);

  return (
    <div>
      {getEntries.isSuccess ? (
        <ScrollArea>
          <Group position="left">
            <TextInput
              placeholder="Search entries..."
              mb="md"
              // value={search}
            />
          </Group>
          <Divider pb={10} />
          <Modal
            opened={modalOpened}
            onClose={() => {
              setModalOpened(false);
            }}
          >
            <EditForm
              selected={selected!}
              setModalOpened={setModalOpened}
              tagData={getUniqueTags(getEntries.data!)}
              categoryData={getUniqueCategories(getEntries.data!)}
            />
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
                    getEntries.refetch();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td>{element.name}</td>
                  <td>{element.address}</td>
                  <td>{element.category}</td>
                  <td>
                    {element.tags.map((tag, index) => {
                      if (!tag) {
                        return;
                      }
                      return <Badge key={index}>{tag.trim()}</Badge>;
                    })}
                  </td>
                  <td>
                    {element.updated_at.toLocaleDateString() +
                      " " +
                      element.updated_at.toLocaleTimeString()}
                  </td>
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
