import {
  Autocomplete,
  Button,
  Center,
  Group,
  Text,
  TextInput,
  Container,
  SimpleGrid,
  Textarea,
} from "@mantine/core";
import usePlacesAutocomplete, {
  getGeocode,
  getDetails,
} from "use-places-autocomplete";

import { trpc } from "../utils/trpc";
import { useState, useEffect } from "react";
import { IconSearch } from "@tabler/icons";
import { CreateEntryInput } from "../common/validation/entries.schema";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

export default function AutoComplete() {
  const router = useRouter();
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

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    cache: 24 * 60 * 60,
    requestOptions: {
      radius: 2000,
      componentRestrictions: { country: "us" },
      location: new google.maps.LatLng(40.716596, -73.99712),
    },
    debounce: 300,
  });

  const handleSelect = async (val: string) => {
    setValue(val, false);
    clearSuggestions();

    const results = await getGeocode({ address: val });
    const placeID = results[0]?.place_id ?? "";
    const resultsDetail = await getDetails({
      placeId: placeID,
      fields: [
        "name",
        "formatted_address",
        "geometry.location",
        "formatted_phone_number",
        "url",
        "website",
      ],
    });

    console.log(resultsDetail);

    form.setValues({
      name: resultsDetail.name,
      address: resultsDetail.formatted_address,
      phone_number: resultsDetail.formatted_phone_number,
      website: resultsDetail.website,
      coords_lat: resultsDetail.geometry.location.lat(),
      coords_lng: resultsDetail.geometry.location.lng(),
    });
  };

  return (
    <Center>
      <SimpleGrid cols={1}>
        <Group position="center">
          <Text>Adding new entry</Text>
        </Group>
        <Autocomplete
          value={value}
          onChange={setValue}
          placeholder="Search and select place to autofill..."
          data={data.map((item) => ({ ...item, value: item.description }))}
          onItemSubmit={(e) => handleSelect(e.value)}
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
