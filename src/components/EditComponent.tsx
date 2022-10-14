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
  Box,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

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
  const [debouncedQuery] = useDebouncedValue(search, 200);
  const [selected, setSelected] = useState<Places>();
  const [modalOpened, setModalOpened] = useState(false);

  const getEntries = trpc.useQuery(["entries.get-all-entries"]);
  const editEntry = trpc.useMutation(["entries.edit-entry"], {
    onSuccess: () => getEntries.refetch(),
    onError: (e) =>
      showNotification({
        color: "red",
        title: "Error",
        message: e.message,
      }),
  });
  const deleteEntry = trpc.useMutation(["entries.delete-entry"], {
    onSuccess: () => getEntries.refetch(),
  });

  return (
    <div>
      {getEntries.isSuccess ? (
        <ScrollArea>
          <Box>
            <TextInput
              placeholder="Search entries by name or address"
              mb="md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
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
              onEdit={(data) => {
                if (data) {
                  editEntry.mutate(data);
                  setModalOpened(false);
                }
              }}
              onDelete={(data) => {
                deleteEntry.mutate(data);
                setModalOpened(false);
              }}
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
              {debouncedQuery !== ""
                ? getEntries.data
                    .filter(
                      (filtered) =>
                        filtered.name
                          .toLocaleLowerCase()
                          .includes(debouncedQuery) ||
                        filtered.address
                          .toLocaleLowerCase()
                          .includes(debouncedQuery)
                    )
                    .map((element) => (
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
                    ))
                : getEntries.data?.map((element) => (
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
