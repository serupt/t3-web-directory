import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { signIn } from "next-auth/react";

export default function LoginComponent() {
  return (
    <Container size={450} my={40}>
      <Title
        mt={200}
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
        color={"brand.7"}
      >
        Login to continue
      </Title>

      <Paper p={30} mt={50} radius="lg">
        <TextInput label="Email" placeholder="Email" />
        <PasswordInput label="Password" placeholder="Password" mt="md" />
        <Group position="right" mt="md">
          {/* <Checkbox label="Remember me" /> */}
          <Anchor<"a">
            onClick={(event) => event.preventDefault()}
            href="#"
            size="sm"
            color={"brand.7"}
          >
            Forgot password?
          </Anchor>
        </Group>
        <Button
          fullWidth
          mt="xl"
          color={"brand.7"}
          onClick={() => signIn("auth0", { callbackUrl: "/admin" })}
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
