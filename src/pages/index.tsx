import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import DisplayMap from "../components/DisplayMap";
import LoadingOverlay from "../components/LoadingOverlay";
import { env } from "../env/client.mjs";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

const Home: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/manage");
  }

  return (
    <>
      <Head>
        <title>Map Directory</title>
      </Head>
      {isLoaded ? <DisplayMap /> : <LoadingOverlay />}
    </>
  );
};

export default Home;
