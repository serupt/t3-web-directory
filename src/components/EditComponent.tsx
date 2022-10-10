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
import { EditEntryInput } from "../common/validation/entries.schema";
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

  const form = useForm<EditEntryInput>({
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

  function onSubmit(values: EditEntryInput) {
    editEntry.mutate(values);
    form.reset();
  }

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
          <Modal
            opened={modalOpened}
            onClose={() => {
              setModalOpened(false);
              form.reset();
            }}
          >
            <Center>
              <SimpleGrid cols={1}>
                <Group position="center">
                  <Text>{`Editing ${selected?.name}`}</Text>
                </Group>
                <Container fluid={false} size={"xs"}>
                  <Text color={"red"}>
                    {editEntry.error && editEntry.error.message}
                  </Text>
                </Container>
                <form onSubmit={form.onSubmit(onSubmit)}>
                  <TextInput label="ID" value={selected?.places_id} disabled />
                  <TextInput label="Name" {...form.getInputProps("name")} />

                  <Textarea
                    label="Description"
                    {...form.getInputProps("description")}
                  />
                  <TextInput
                    label="Address"
                    {...form.getInputProps("address")}
                  />
                  <TextInput
                    label="Phone Number"
                    {...form.getInputProps("phone_number")}
                  />
                  <TextInput
                    label="Website"
                    {...form.getInputProps("website")}
                  />
                  <TextInput
                    label="Category"
                    {...form.getInputProps("category")}
                  />
                  <MultiSelect
                    label={"Tags"}
                    data={["Test"]}
                    defaultValue={selected?.tags}
                    placeholder={"Type to add new tags..."}
                    description={"Select up to 5 tags"}
                    searchable
                    creatable
                    getCreateLabel={(query) => `${query}`}
                    maxSelectedValues={5}
                    // onCreate={(query) => {
                    //   const item = query;
                    //   setDataTags((current) => [...current, item]);
                    //   return item;
                    // }}
                    {...form.getInputProps("tags")}
                  />
                  <Textarea
                    placeholder="Daily: 9am-6pm"
                    label="Opening Hours"
                    {...form.getInputProps("opening_hours")}
                  />

                  <Group position="apart" pb={10}>
                    <TextInput
                      label="Latitude"
                      {...form.getInputProps("coords_lat")}
                    />
                    <TextInput
                      label="Longitude"
                      {...form.getInputProps("coords_lng")}
                    />
                  </Group>
                  <Group position="center">
                    <Button type="submit" fullWidth>
                      Submit
                    </Button>
                  </Group>
                </form>
              </SimpleGrid>
            </Center>
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
                    setModalOpened(true);
                    // console.log(selected);
                  }}
                  onMouseOver={() => {
                    setSelected(element);
                    console.log(selected);
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
