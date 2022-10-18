import { Button, Container, Paper, Title } from "@mantine/core";
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
        Sign in to continue
      </Title>

      <Paper p={30} mt={50} radius="lg">
        {/* <TextInput
          label="Email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        /> */}
        {/* <PasswordInput label="Password" placeholder="Password" mt="md" /> */}
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
