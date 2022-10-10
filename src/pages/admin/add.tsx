import AutoComplete from "../../components/AutoComplete";
import DashboardShellComponent from "../../components/DashboardShellComponent";
import Head from "next/head";
import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import { env } from "../../env/client.mjs";
import { LoadingOverlay } from "@mantine/core";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

export default function add() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });
  return (
    <>
      <Head>
        <title>Add</title>
      </Head>
      <DashboardShellComponent>
        {isLoaded ? <AutoComplete /> : <LoadingOverlay visible />}
      </DashboardShellComponent>
    </>
  );
}
