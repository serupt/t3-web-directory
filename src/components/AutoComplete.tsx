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
  MultiSelect,
  Select,
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
import { Places } from "@prisma/client";

export default function AutoComplete() {
  const router = useRouter();
  const getEntry = trpc.useQuery(["entries.get-all-entries"]);
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
      category: "Others",
      tags: ["Others"],
      opening_hours: "",
      coords_lat: "",
      coords_lng: "",
    },
  });

  function getUniqueTags(data: Places[]) {
    const uniqueTag: string[] = [];
    data?.map((value) =>
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
    data?.map((value) => {
      if (!uniqueCategories.includes(value.category)) {
        uniqueCategories.push(value.category);
      }
    });
    return uniqueCategories;
  }

  const [dataCategory, setDataCategory] = useState(
    getUniqueCategories(getEntry.data!)
  );
  const [dataTags, setDataTags] = useState(getUniqueTags(getEntry.data!));

  function onSubmit(values: CreateEntryInput) {
    createEntry.mutate(values);
    form.reset();
  }

  const {
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
        "opening_hours",
        "website",
      ],
    });

    console.log(resultsDetail);

    form.setFieldValue("name", resultsDetail.name ?? "");
    form.setFieldValue("address", resultsDetail.formatted_address ?? "");
    form.setFieldValue(
      "phone_number",
      resultsDetail.formatted_phone_number ?? ""
    );
    form.setFieldValue("website", resultsDetail.website ?? "");
    form.setFieldValue(
      "opening_hours",
      resultsDetail.opening_hours?.weekday_text.join("\n") ?? ""
    );
    form.setFieldValue(
      "coords_lat",
      resultsDetail.geometry.location.lat().toString()
    );
    form.setFieldValue(
      "coords_lng",
      resultsDetail.geometry.location.lng().toString()
    );
  };

  return (
    <Center>
      <SimpleGrid cols={1}>
        <Group position="center">
          <Text>Adding new entry</Text>
        </Group>
        <Autocomplete
          icon={<IconSearch />}
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
          <Select
            label="Category"
            data={dataCategory}
            placeholder="Type to add new category..."
            description="Select a category"
            searchable
            creatable
            getCreateLabel={(query) => `${query.trim()}`}
            onCreate={(query) => {
              const item = query;
              setDataCategory((current) => [...current, item]);
              return item;
            }}
            {...form.getInputProps("category")}
          />
          <MultiSelect
            label={"Tags"}
            data={dataTags}
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
