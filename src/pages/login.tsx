import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { LoginInput } from "../utils/validation/login.schema";
import { loginSchema } from "../utils/validation/login.schema";

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

const LoginPage: NextPage = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    })
      .then((response) => {
        // console.log(response);
        if (response && response.ok) {
          // Authenticate user
          void router.push("/manage");
        } else {
          void router.push("/error");
        }
      })
      .catch((error) => {
        console.log(error);
        void router.push("/error");
      });
  };
  return (
    <>
      <Head>
        <title>{t("login")}</title>
      </Head>
      <main className="flex h-screen w-full flex-col items-center justify-center bg-primary">
        <h1 className="pb-5 text-3xl font-bold text-secondary">
          {t("login_to_continue")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <label className="block">
              <span className="mb-2 block">{t("username")}</span>

              <input
                className="input-md w-96 rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                type="text"
                {...register("username")}
              />
              {errors.username?.message && (
                <p className="text-red-600">{errors.username?.message}</p>
              )}
            </label>
            <label className="block">
              <span className="mb-2 block">{t("password")}</span>
              <input
                className="input-md w-96 rounded bg-primary-800 shadow-md  focus:outline-none focus:ring-2 focus:ring-secondary"
                type="password"
                {...register("password")}
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-secondary-700 px-4 py-2 text-sm font-medium hover:bg-secondary-600 "
            >
              {t("login")}
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default LoginPage;
