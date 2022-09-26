import { AppShell, Navbar, Text } from "@mantine/core";
import MapComponent from "./MapComponent";

export default function ApplicationComponent() {
  return (
    <AppShell navbar={
      <Navbar p="md" width={{lg: 300 }}>
        <Text>Application navbar</Text>
      </Navbar>
    }>
      <MapComponent />
    </AppShell>
  );
}
