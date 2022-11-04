import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginInput, loginSchema } from "../utils/validation/login.schema";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    })
      .then((response) => {
        // console.log(response);
        if (response && response.ok) {
          // Authenticate user
          router.push("/admin");
        } else {
          router.push("/error");
        }
      })
      .catch((error) => {
        console.log(error);
        router.push("/error");
      });
  };
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-primary">
      <h1 className="pb-5 text-3xl font-bold text-secondary">
        Login to continue
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-3">
          <label className="block">
            <span className="mb-2 block">Email</span>

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
            <span className="mb-2 block">Password</span>
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
            Login
          </button>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
