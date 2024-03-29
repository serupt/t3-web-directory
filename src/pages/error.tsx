import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const LoginErrorPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login Error</title>
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center bg-primary">
        <h1 className="text-4xl font-extrabold tracking-widest text-white">
          Incorrect username or password
        </h1>
        <button className="mt-5">
          <Link
            className="group relative inline-block text-sm font-medium text-secondary focus:outline-none focus:ring active:text-orange-500"
            href={"/login"}
          >
            <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-secondary transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

            <span className="relative block border border-current bg-primary px-8 py-3">
              Try again
            </span>
          </Link>
        </button>
      </main>
    </>
  );
};

export default LoginErrorPage;
