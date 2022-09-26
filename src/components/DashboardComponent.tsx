import { signOut } from "next-auth/react";

export default function DashboardComponent() {
  return (
    <div>
      <p>SUP!</p>
      <button onClick={() => signOut()}></button>
    </div>
  );
}
