import { LoadScriptProps, useLoadScript } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import DisplayMap from "../components/DisplayMap";
import LoadingOverlay from "../components/LoadingOverlay";
import { env } from "../env/client.mjs";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
    ])),
  },
});

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
        <title>CCCNY Directory</title>
      </Head>
      {isLoaded ? <DisplayMap /> : <LoadingOverlay />}
    </>
  );
};

export default Home;
