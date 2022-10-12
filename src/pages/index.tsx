import type { NextPage } from "next";
import DisplayMap from "../components/DisplayMap";
import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import { env } from "../env/client.mjs";
import { LoadingOverlay } from "@mantine/core";
import Head from "next/head";

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
