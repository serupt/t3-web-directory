import type { LoadScriptProps } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import EditingComponent from "../../components/EditingComponent";
import LoadingOverlay from "../../components/LoadingOverlay";
import Login from "../../components/Login";
import { env } from "../../env/client.mjs";
import ManageEntryLayout from "../../layout/ManageEntryLayout";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../../next-i18next.config.mjs";

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"], nextI18nConfig, [
      "en",
      "zh",
    ])),
  },
});

const AdminEdit: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });
  const { data: session } = useSession();

  if (!session) {
    return <Login />;
  }
  return (
    <>
      <Head>
        <title>Manage Entries</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManageEntryLayout>
        {isLoaded ? <EditingComponent /> : <LoadingOverlay />}
      </ManageEntryLayout>
    </>
  );
};

export default AdminEdit;
