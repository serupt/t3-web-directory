import { Container, LoadingOverlay } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import DashboardShellComponent from "../../components/DashboardShellComponent";
import EditComponent from "../../components/EditComponent";

import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import { env } from "../../env/client.mjs";

import DisplayMap from "../../components/DisplayMap";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

const AdminEdit: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });
  return isLoaded ? (
    <>
      <Head>
        <title>Edit</title>
      </Head>
      <DashboardShellComponent>
        <Container size={"100vw"} p={10}>
          <EditComponent />
        </Container>
      </DashboardShellComponent>
    </>
  ) : (
    <LoadingOverlay visible />
  );
};

export default AdminEdit;
