import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getToken, getUserRole } from "../lib/services/storage";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken) {
      router.push("/login");
    }

    if (!!getUserRole) {
      const role = getUserRole();
      router.push(`/dashboard/${role}`);
    }
  });
  return <></>;
}
