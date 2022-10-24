import React from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { ImHome } from "react-icons/im";

export default function ManageEntryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Menu = [
    { name: "Home", icon: <ImHome />, href: "/admin" },
    { name: "Edit", icon: <AiTwotoneEdit />, href: "/admin/edit" },
  ];
  return (
    <div className="min-h-screen sm:flex">
      <aside className="max-h-screen w-full flex-none overflow-auto bg-primary-800 sm:max-w-[5rem] sm:flex-col">
        <div className="flex flex-col justify-center overflow-hidden p-3 ">
          {Menu.map((item) => {
            return (
              <div className="flex flex-col items-center justify-center">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
