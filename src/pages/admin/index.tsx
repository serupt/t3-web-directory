import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { LoadingOverlay } from "@mantine/core";
import LoginComponent from "../../components/LoginComponent";
import DashboardComponent from "../../components/DashboardComponent";

export default function Admin() {
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
        <DashboardComponent session={session} expires={session.expires} />
      ) : (
        <LoginComponent />
      )}
    </div>
  );
}
