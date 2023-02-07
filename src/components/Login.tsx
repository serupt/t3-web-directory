import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { useTranslation } from "next-i18next";

export default function Login() {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("login")}</title>
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center bg-primary">
        <h1 className="text-4xl font-extrabold tracking-widest text-white">
          {t("login_to_continue")}
        </h1>
        <div className="flex space-x-5">
          <button className="mt-5">
            <div onClick={() => signIn()}>
              <a className="group relative inline-block text-sm font-medium text-secondary focus:outline-none focus:ring active:text-orange-500">
                <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-secondary transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

                <span className="relative block border border-current bg-primary px-8 py-3">
                  {t("login")}
                </span>
              </a>
            </div>
          </button>
          <button className="mt-5">
            <Link
              className="group relative inline-block text-sm font-medium text-secondary focus:outline-none focus:ring active:text-orange-500"
              href={"/"}
            >
              <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-secondary transition-transform group-hover:translate-y-0 group-hover:translate-x-0"></span>

              <span className="relative block border border-current bg-primary px-8 py-3">
                {t("back")}
              </span>
            </Link>
          </button>
        </div>
      </main>
    </>
  );
}
