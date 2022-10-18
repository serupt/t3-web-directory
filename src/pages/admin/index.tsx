import { LoadingOverlay } from "@mantine/core";
import { useSession } from "next-auth/react";
import Head from "next/head";
import DashboardShellComponent from "../../components/DashboardShellComponent";
import LoginComponent from "../../components/LoginComponent";

import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import { env } from "../../env/client.mjs";

import DisplayMap from "../../components/DisplayMap";

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
          {isLoaded ? <DisplayMap /> : <LoadingOverlay visible />}
        </DashboardShellComponent>
      ) : (
        <LoginComponent />
      )}
    </div>
  );
}
