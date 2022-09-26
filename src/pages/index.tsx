import type { NextPage } from "next";
import ApplicationComponent from "../components/ApplicationComponent";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.getAll"]);
  // console.log(hello.data)

  return <ApplicationComponent />;
};

export default Home;
