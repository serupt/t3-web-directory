import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { Grid, LoadingOverlay, Skeleton } from "@mantine/core";
import LoginComponent from "../../components/LoginComponent";
import DashboardShellComponent from "../../components/DashboardShellComponent";

import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import { env } from "../../env/client.mjs";
import NewEntryComponent from "../../components/NewEntryComponent";
import AutoComplete from "../../components/AutoComplete";
import MapComponent from "../../components/MapComponent";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

export default function Admin() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      {session ? (
        <DashboardShellComponent>
          <Grid grow gutter={0} justify="center" align="center">
            <Grid.Col span={1}>
              {isLoaded ? <AutoComplete /> : <Skeleton visible />}
            </Grid.Col>
            <Grid.Col span={5}>
              {isLoaded ? <MapComponent /> : <LoadingOverlay visible />}
            </Grid.Col>
          </Grid>
        </DashboardShellComponent>
      ) : (
        <LoginComponent />
      )}
    </div>
  );
}
