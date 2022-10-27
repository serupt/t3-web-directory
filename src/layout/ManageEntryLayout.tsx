import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function ManageEntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Menu = [
    {
      name: "Home",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
      href: "/admin",
    },
    {
      name: "Edit",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      ),
      href: "/admin/edit",
    },
  ];
  return (
    <div className="min-h-screen sm:flex">
      <aside className="max-h-screen w-full space-y-2 overflow-auto bg-primary-800 px-2 py-7 sm:max-w-[15rem] sm:flex-col">
        <div className="flex flex-col items-center space-y-2 p-2">
          <svg
            className="h-7 w-7 text-secondary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
            />
          </svg>
          <span className="text-2xl font-bold">Some Name</span>
        </div>
        <nav>
          {Menu.map((item, index) => {
            return (
              <Link href={`${item.href}`} key={index}>
                <a className="block rounded-full py-2.5 px-4 transition duration-200 hover:bg-primary-700">
                  <div className="flex items-center space-x-5 p-1">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </a>
              </Link>
            );
          })}
          <div className="block rounded-full py-2.5 px-4 transition duration-200 hover:cursor-pointer hover:bg-primary-700">
            <div
              className="flex items-center space-x-5 p-1"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
