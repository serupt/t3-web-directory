import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ManageUsers from "../../components/ManageUsers";
import ManageEntryLayout from "../../layout/ManageEntryLayout";

const Users: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  if (session?.user.role !== "ADMIN") {
    return (
      <main className="flex h-screen w-full flex-col items-center justify-center bg-primary">
        <h1 className="text-4xl font-extrabold tracking-widest text-white">
          You do not have permission to view this page.
        </h1>
        <button className="mt-5">
          <Link href={"/manage"}>
            <a className="group relative inline-block text-sm font-medium text-secondary focus:outline-none focus:ring active:text-orange-500">
              <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-secondary transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

              <span className="relative block border border-current bg-primary px-8 py-3">
                Go Back
              </span>
            </a>
          </Link>
        </button>
      </main>
    );
  }
  return (
    <>
      <Head>
        <title>Manage Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ManageEntryLayout>
        <ManageUsers />
      </ManageEntryLayout>
    </>
  );
};

export default Users;
