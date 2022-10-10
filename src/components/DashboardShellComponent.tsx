import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";
import { Navbar, Center, Stack, AppShell } from "@mantine/core";
import {
  IconHome2,
  IconEdit,
  IconLogout,
  IconPlus,
  IconLayoutDashboard,
} from "@tabler/icons";
import { NavbarLink } from "./NavbarLink";
import { useRouter } from "next/router";

const navitems = [
  { icon: IconHome2, label: "Admin" },
  { icon: IconPlus, label: "Add" },
  { icon: IconEdit, label: "Edit" },
];

type DashboardShellComponentProps = {
  children: React.ReactNode;
};

export default function DashboardShellComponent({
  children,
}: DashboardShellComponentProps) {
  const router = useRouter();
  const path = router.pathname.split("/");
  const links = navitems.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.label.toLocaleLowerCase() === path[path.length - 1]}
    />
  ));

  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar height={"100vh"} width={{ base: 80 }} p="md">
          <Center>
            <IconLayoutDashboard />
          </Center>
          <Navbar.Section grow mt={50}>
            <Stack justify="center" spacing={0}>
              {links}
            </Stack>
          </Navbar.Section>
          <Navbar.Section>
            <Stack justify="center" spacing={0}>
              <NavbarLink
                icon={IconLogout}
                label="Logout"
                onClick={() => signOut({ callbackUrl: "/admin" })}
              />
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
    >
      {children}
    </AppShell>
  );
}
