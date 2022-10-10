import {
  Button,
  Center,
  Container,
  Group,
  MultiSelect,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { Places } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { EditEntryInput } from "../common/validation/entries.schema";
import { trpc } from "../utils/trpc";

interface FormValues {
  id: string;
  name: string;
  description: string;
  address: string;
  phone_number: string;
  website: string;
  category: string;
  tags: string[];
  opening_hours: string;
  coords_lat: string;
  coords_lng: string;
}

interface EditFormProps {
  selected: Places;
  setModalOpened: Dispatch<SetStateAction<boolean>>;
  tagData: string[];
}
export default function EditForm({
  selected,
  setModalOpened,
  tagData,
}: EditFormProps) {
  const editEntry = trpc.useMutation(["entries.edit-entry"]);

  const [dataTags, setDataTags] = useState(tagData);

  const form = useForm<EditEntryInput>({
    initialValues: {
      id: selected.places_id,
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
    editEntry.mutate(values);

    form.reset();
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
          <TextInput label="Category" {...form.getInputProps("category")} />
          <MultiSelect
            label={"Tags"}
            data={dataTags}
            defaultValue={selected?.tags}
            placeholder={"Type to add new tags..."}
            description={"Select up to 5 tags"}
            searchable
            creatable
            getCreateLabel={(query) => `${query}`}
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
          <Group position="center">
            <Button type="submit" fullWidth>
              Submit
            </Button>
          </Group>
        </form>
      </SimpleGrid>
    </Center>
  );
}
