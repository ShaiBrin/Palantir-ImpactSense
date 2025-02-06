"use client";
import useAuthenticated from "@/lib/useAuthenticated";
import styles from "./page.module.css";
import RoadAccSelect from "./ui/roadAcc";

function Home() {
  const authenticated = useAuthenticated();
  if (!authenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <RoadAccSelect />
      </div>
      <div className={styles.right}>
        <RoadAccSelect />
      </div>
    </div>
  );
}

export default Home;
