import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { LoadingOverlay } from "@mantine/core";
import LoginComponent from "../../components/LoginComponent";

export default function Admin() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }
  return (
    <div>
      <Head>
        <title>Login test</title>
      </Head>
      {session ? (
        <div>
          <p>hi {session.user?.email}</p>
          <button onClick={() => signOut({ callbackUrl: "/admin" })}>
            Sign Out
          </button>
        </div>
      ) : (
        <LoginComponent />
      )}
    </div>
  );
}
