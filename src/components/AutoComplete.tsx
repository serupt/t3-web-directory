import {
  Autocomplete,
  Button,
  Container,
  Group,
  MultiSelect,
  Select,
  SimpleGrid,
  Textarea,
  TextInput,
} from "@mantine/core";
import usePlacesAutocomplete, {
  getDetails,
  getGeocode,
} from "use-places-autocomplete";

import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateEntryInput } from "../common/validation/entries.schema";

interface AddFormProps {
  setAddModalOpened: Dispatch<SetStateAction<boolean>>;
  tagData: string[];
  categoryData: string[];
  onAdd: (data: CreateEntryInput) => void;
}

export default function AutoComplete({
  tagData,
  categoryData,
  onAdd,
}: AddFormProps) {
  const form = useForm<CreateEntryInput>({
    initialValues: {
      name: "",
      description: "",
      main_address: "",
      other_addresses: [],
      phone_number: "",
      website: "",
      category: "",
      tags: [],
      opening_hours: "",
      coords_lat: "",
      coords_lng: "",
    },
  });

  const [dataCategory, setDataCategory] = useState(categoryData);
  const [dataTags, setDataTags] = useState(tagData);

  function onSubmit(values: CreateEntryInput) {
    onAdd(values);
    form.reset();
  }

  const {
    value,
    setValue,
    suggestions: { data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    cache: 7 * 24 * 60 * 60,
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
        "opening_hours",
        "website",
      ],
    });
    // @ts-ignore
    form.setFieldValue("name", resultsDetail.name ?? "");
    // @ts-ignore
    form.setFieldValue("main_address", resultsDetail.formatted_address ?? "");
    form.setFieldValue(
      "phone_number",
      // @ts-ignore
      resultsDetail.formatted_phone_number ?? ""
    );
    // @ts-ignore
    form.setFieldValue("website", resultsDetail.website ?? "");
    form.setFieldValue(
      "opening_hours",
      // @ts-ignore
      resultsDetail.opening_hours?.weekday_text.join(",\n") ?? ""
    );
    form.setFieldValue(
      "coords_lat",
      // @ts-ignore
      resultsDetail.geometry.location.lat().toString()
    );
    form.setFieldValue(
      "coords_lng",
      // @ts-ignore
      resultsDetail.geometry.location.lng().toString()
    );
  };

  return (
    <Container size={"sm"} px="sm">
      <SimpleGrid cols={1}>
        <Autocomplete
          icon={<IconSearch />}
          value={value}
          onChange={setValue}
          placeholder="Search and select place to autofill..."
          data={data.map((item) => ({ ...item, value: item.description }))}
          onItemSubmit={(e) => handleSelect(e.value)}
        />
        <form onSubmit={form.onSubmit(onSubmit)}>
          <TextInput label="Name" {...form.getInputProps("name")} />
          <Textarea
            label="Description"
            {...form.getInputProps("description")}
          />
          <TextInput
            label="Main Address"
            {...form.getInputProps("main_address")}
          />
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

          <Group grow position="apart" pb={10}>
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
    </Container>
  );
}
