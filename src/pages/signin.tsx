import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignIn({ providers }: { providers: any[] }) {
  const {
    query: { callbackUrl },
  } = useRouter();
  return (
    <button onClick={() => signIn("auth0", { callbackUrl: "/admin" })}>
      Sign in with Auth0
    </button>
  );
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
