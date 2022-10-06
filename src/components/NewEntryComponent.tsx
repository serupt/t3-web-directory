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
  Notification,
  Modal,
} from "@mantine/core";
import { IconSearch, IconMenu2 } from "@tabler/icons";

import { env } from "../env/client.mjs";

import { CreateEntryInput } from "../common/validation/entries.schema";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export default function NewEntryComponent() {
  const router = useRouter();

  const [showNotification, setShowNotification] = useState(false);

  const createEntry = trpc.useMutation(["entries.add-entry"], {
    onSuccess: () => router.push("/admin"),
  });

  const form = useForm<CreateEntryInput>({
    initialValues: {
      name: "",
      description: "",
      address: "",
      phone_number: "",
      website: "",
      category: "",
      tags: [""],
      opening_hours: "",
      coords_lat: "",
      coords_lng: "",
    },
  });

  function onSubmit(values: CreateEntryInput) {
    values.tags = values.tags[0]?.split(",").join("").split("")!;
    createEntry.mutate(values);
  }

  return (
    <Center>
      <SimpleGrid cols={1}>
        <Group position="center">
          <Text>Adding new entry</Text>
        </Group>
        <TextInput
          icon={<IconSearch />}
          placeholder={"Search and select a place for autofill."}
        />
        <Container fluid={false} size={"xs"}>
          <Text color={"red"}>
            {createEntry.error && createEntry.error.message}
          </Text>
        </Container>
        <form onSubmit={form.onSubmit(onSubmit)}>
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
          <TextInput label="Tags" {...form.getInputProps("tags.0")} />
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
