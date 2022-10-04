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
import { ThemeContext } from "@emotion/react";
import { CreateEntryInput } from "../common/validation/entries.schema";
import { useForm } from "@mantine/form";
import { createContext } from "../server/router/context";
import { useRouter } from "next/router";

export default function NewEntryComponent() {
  const router = useRouter();
  const createEntry = trpc.useMutation(["entries.add-entry"], {
    onSuccess: () => router.push("/admin/edit"),
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
    createEntry.mutate(values);
  }

  return (
    <SimpleGrid cols={1}>
      <Text>{createEntry.error && createEntry.error.message}</Text>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput label="Name" required {...form.getInputProps("name")} />
        <Textarea label="Description" {...form.getInputProps("description")} />
        <TextInput
          label="Address"
          required
          {...form.getInputProps("address")}
        />
        <TextInput
          label="Phone Number"
          {...form.getInputProps("phone_number")}
        />
        <TextInput label="Website" {...form.getInputProps("website")} />
        <TextInput label="Category" {...form.getInputProps("category")} />
        <TextInput label="Tags" {...form.getInputProps("tags")} />
        <Textarea
          placeholder="Daily: 9am-6pm"
          label="Opening Hours"
          {...form.getInputProps("opening_hours")}
        />
        <Text>For google map markers</Text>
        <Group position="apart" pb={10}>
          <TextInput
            label="Latitude"
            required
            {...form.getInputProps("coords_lat")}
          />
          <TextInput
            label="Longitude"
            required
            {...form.getInputProps("coords_lng")}
          />
        </Group>
        <Group position="apart">
          <Button onClick={closeModal} color={"dark.5"}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </SimpleGrid>
  );
}
