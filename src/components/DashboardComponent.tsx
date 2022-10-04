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
import EditComponent from "./EditComponent";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import HomeComponent from "./HomeComponent";
import NewEntryComponent from "./NewEntryComponent";

const navitems = [
  { icon: IconHome2, label: "Home" },
  { icon: IconPlus, label: "Add" },
  { icon: IconEdit, label: "Edit" },
];

export default function DashboardComponent() {
  const [active, setActive] = useState("Home");

  const links = navitems.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.label === active}
      onClick={() => {
        if (link.label === "Home") {
          setActive("/");
        } else {
          setActive(link.label);
        }
      }}
    />
  ));

  return (
    <Router>
      <AppShell
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
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/admin" element={<HomeComponent />} />
          <Route path="/admin/edit" element={<EditComponent />} />
          <Route path="/admin/add" element={<NewEntryComponent />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
