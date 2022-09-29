import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";
import { Navbar, Center, Stack, AppShell } from "@mantine/core";
import {
  IconHome2,
  IconEdit,
  IconLogout,
  Icon3dCubeSphere,
} from "@tabler/icons";
import { NavbarLink } from "./NavbarLink";
import EditComponent from "./EditComponent";
import { trpc } from "../utils/trpc";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import DashboardHomeComponent from "./DashboardHomeComponent";

const navitems = [
  { icon: IconHome2, label: "Home" },
  { icon: IconEdit, label: "Edit" },
];

export default function DashboardComponent() {
  const [active, setActive] = useState("Home");
  const hello = trpc.useQuery(["example.getAll"]);

  const links = navitems.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.label === active}
      onClick={() => setActive(link.label)}
    />
  ));

  return (
    <Router>
      <AppShell
        navbar={
          <Navbar height={"100vh"} width={{ base: 80 }} p="md">
            <Center>
              <Icon3dCubeSphere />
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
        <Routes>
          <Route path="/admin" element={<DashboardHomeComponent />} />
          <Route path="/admin/edit" element={<EditComponent />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
