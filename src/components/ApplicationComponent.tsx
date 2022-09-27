import { useEffect, useState } from "react";
import {
  AppShell,
  Navbar,
  Text,
  useMantineTheme,
  LoadingOverlay,
  CloseButton,
  Group,
} from "@mantine/core";
import MapComponent from "./MapComponent";
import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import { env } from "../env/client.mjs";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

export default function ApplicationComponent() {
  const theme = useMantineTheme();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  const [apiDATA, setAPIData] = useState([]);
  const [error, setError] = useState();

  // useEffect(() => {
  //   const fetchDirectory = async () => {
  //     const { data: directory, error } = await supabase
  //       .from("directory")
  //       .select("*");

  //     if (error) {
  //       setError(error);
  //       console.error(error);
  //     }
  //     if (directory) {
  //       setAPIData(directory);
  //       setError("");
  //     }
  //   };
  // });

  return isLoaded ? (
    <AppShell
      padding={0}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          width={{ xs: 400 }}
          hiddenBreakpoint={"xs"}
          hidden={true}
        >
          <Text>Haha</Text>
        </Navbar>
      }
    >
      <MapComponent />
    </AppShell>
  ) : (
    <LoadingOverlay visible={true} overlayBlur={2} />
  );
}
