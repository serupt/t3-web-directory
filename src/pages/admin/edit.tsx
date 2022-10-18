import {
  Container,
  LoadingOverlay,
  Center,
  Text,
  Button,
  Group,
  SimpleGrid,
} from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import DashboardShellComponent from "../../components/DashboardShellComponent";
import EditComponent from "../../components/EditComponent";

import { useLoadScript, LoadScriptProps } from "@react-google-maps/api";
import { env } from "../../env/client.mjs";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const googleMapsLibraries: LoadScriptProps["libraries"] = ["places"];

const AdminEdit: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <Container>
        <Center mt={"40%"}>
          <SimpleGrid cols={1}>
            <Text size={30}>Not authenticated</Text>
            <Text size={16}>Sign in to continue</Text>
            <Button onClick={() => signIn()}>Sign in</Button>
          </SimpleGrid>
        </Center>
      </Container>
    );
  }

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
