import {
  Button,
  Center,
  Container,
  Group,
  MultiSelect,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { Places } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import {
  EditEntryInput,
  DeleteEntryInput,
} from "../common/validation/entries.schema";
import { trpc } from "../utils/trpc";

interface EditFormProps {
  selected: Places;
  setModalOpened: Dispatch<SetStateAction<boolean>>;
  tagData: string[];
  categoryData: string[];
}
export default function EditForm({
  selected,
  setModalOpened,
  tagData,
  categoryData,
}: EditFormProps) {
  const editEntry = trpc.useMutation(["entries.edit-entry"]);
  const deleteEntry = trpc.useMutation(["entries.delete-entry"]);
  const [dataTags, setDataTags] = useState(tagData);
  const [dataCategories, setDataCategories] = useState(categoryData);

  const form = useForm<EditEntryInput>({
    initialValues: {
      places_id: selected.places_id,
      name: selected.name,
      description: selected.description,
      address: selected.address,
      phone_number: selected.phone_number,
      website: selected.website,
      category: selected.category,
      tags: selected.tags,
      opening_hours: selected.opening_hours,
      coords_lat: selected.coords_lat,
      coords_lng: selected.coords_lng,
    },
  });

  function onSubmit(values: EditEntryInput) {
    if (form.isDirty()) {
      editEntry.mutate(values);
    }
    form.reset();
    setModalOpened(false);
  }

  function onDelete(values: DeleteEntryInput) {
    deleteEntry.mutate(values);
    setModalOpened(false);
  }

  return (
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
          <TextInput label="Address" {...form.getInputProps("address")} />
          <TextInput
            label="Phone Number"
            {...form.getInputProps("phone_number")}
          />
          <TextInput label="Website" {...form.getInputProps("website")} />
          <Select
            label="Category"
            data={dataCategories}
            placeholder="Type to add new category..."
            description="Select a category"
            searchable
            creatable
            getCreateLabel={(query) => `${query.trim()}`}
            onCreate={(query) => {
              const item = query;
              setDataCategories((current) => [...current, item]);
              return item;
            }}
            {...form.getInputProps("category")}
          />
          <MultiSelect
            label={"Tags"}
            data={dataTags}
            defaultValue={selected?.tags}
            placeholder={"Type to add new tags..."}
            description={"Select up to 5 tags"}
            searchable
            creatable
            getCreateLabel={(query) => `${query.trim()}`}
            maxSelectedValues={5}
            onCreate={(query) => {
              const item = query;
              setDataTags((current) => [...current, item]);
              return item;
            }}
            {...form.getInputProps("tags")}
          />
          <Textarea
            placeholder="Daily: 9am-6pm"
            label="Opening Hours"
            {...form.getInputProps("opening_hours")}
          />

          <Group position="apart" pb={10}>
            <TextInput label="Latitude" {...form.getInputProps("coords_lat")} />
            <TextInput
              label="Longitude"
              {...form.getInputProps("coords_lng")}
            />
          </Group>
          <Group position="apart">
            <Button
              color={"red"}
              onClick={() => onDelete({ places_id: selected.places_id })}
            >
              Delete
            </Button>
            <Group position="center">
              <Button color={"dark.5"} onClick={() => setModalOpened(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </Group>
          </Group>
        </form>
      </SimpleGrid>
    </Center>
  );
}
