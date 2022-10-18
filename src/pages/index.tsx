import { LoadingOverlay } from "@mantine/core";
import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import type { NextPage } from "next";
import Head from "next/head";
import DisplayMap from "../components/DisplayMap";
import { env } from "../env/client.mjs";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

const Home: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });
  return (
    <>
      <Head>
        <title>Map Directory</title>
      </Head>
      {isLoaded ? <DisplayMap /> : <LoadingOverlay visible />}
    </>
  );
};

export default Home;
