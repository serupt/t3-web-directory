import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import type { NextPage } from "next";
import Head from "next/head";
import DisplayMap from "../../components/DisplayMap";
import LoadingOverlay from "../../components/LoadingOverlay";
import { env } from "../../env/client.mjs";
import ManageEntryLayout from "../../layout/ManageEntryLayout";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

const AdminHome: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });
  return (
    <>
      <Head>
        <title>Manage Entries</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManageEntryLayout>
        {isLoaded ? <DisplayMap /> : <LoadingOverlay />}
      </ManageEntryLayout>
    </>
  );
};

export default AdminHome;
