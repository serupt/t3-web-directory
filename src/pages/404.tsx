import { NextPage } from "next";
import Link from "next/link";

const ErrorPage: NextPage = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-primary">
      <h1 className="text-9xl font-extrabold tracking-widest text-white">
        404
      </h1>
      <div className="text- absolute rotate-12 rounded bg-secondary px-2 text-primary">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link href={"/"}>
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
};

export default ErrorPage;
