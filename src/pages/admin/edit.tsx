import { Container } from "@mantine/core";
import type { NextPage } from "next";
import DashboardShellComponent from "../../components/DashboardShellComponent";
import EditComponent from "../../components/EditComponent";

const AdminEdit: NextPage = () => {
  return (
    <DashboardShellComponent>
      <Container size={"100vw"} p={10}>
        <EditComponent />
      </Container>
    </DashboardShellComponent>
  );
};

export default AdminEdit;
