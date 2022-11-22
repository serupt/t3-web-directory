import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

import { useTranslation } from "next-i18next";

export default function ManageEntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { t } = useTranslation("common");

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
      href: "/manage",
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
      href: "/manage/edit",
    },
  ];
  const AdminMenu = [
    {
      name: "Users",
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
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      ),
      href: "/manage/users",
    },
  ];
  return (
    <div className="min-h-screen sm:flex">
      <aside className="max-h-screen w-full space-y-2 overflow-auto bg-primary-800 px-2 py-7 sm:max-w-[15rem] sm:flex-col">
        <div className="flex flex-col items-center space-y-2 p-2">
          {/* <img src="/cccny.png" alt="Logo" className="h-16 w-16" /> */}
          <span className="text-2xl font-bold">CCCNY Directory</span>
        </div>
        <div className="divider before:bg-secondary after:bg-secondary"></div>

        <nav>
          {Menu.map((item, index) => {
            return (
              <Link href={`${item.href}`} key={index}>
                <a className="block rounded-full py-2.5 px-4 transition duration-200 hover:bg-primary-700">
                  <div className="flex items-center space-x-5 p-1">
                    <span>{item.icon}</span>
                    <span>{t(`${item.name.toLocaleLowerCase()}`)}</span>
                  </div>
                </a>
              </Link>
            );
          })}

          {session?.user.role === "ADMIN"
            ? AdminMenu.map((item, index) => {
                return (
                  <Link href={`${item.href}`} key={index}>
                    <a className="block rounded-full py-2.5 px-4 transition duration-200 hover:bg-primary-700">
                      <div className="flex items-center space-x-5 p-1">
                        <span>{item.icon}</span>
                        <span>{t(`${item.name.toLocaleLowerCase()}`)}</span>
                      </div>
                    </a>
                  </Link>
                );
              })
            : null}
          <div className="divider before:bg-secondary after:bg-secondary"></div>
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
              <span>{t("logout")}</span>
            </div>
          </div>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
