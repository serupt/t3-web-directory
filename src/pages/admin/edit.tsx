import { Container } from "@mantine/core";
import type { NextPage } from "next";
import Head from "next/head";
import DashboardShellComponent from "../../components/DashboardShellComponent";
import EditComponent from "../../components/EditComponent";

const AdminEdit: NextPage = () => {
  return (
    <>
      <Head>
        <title>Edit</title>
      </Head>
      <DashboardShellComponent>
        <Container size={"100vw"} p={10}>
          <EditComponent />
        </Container>
      </DashboardShellComponent>
    </>
  );
};

export default AdminEdit;
