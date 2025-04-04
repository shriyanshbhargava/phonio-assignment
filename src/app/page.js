import Header from "../components/Header/Header";
import styles from "./page.module.css";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <div>
      <main>
        <Header />
        <Hero />
        <Hero />
      </main>
    </div>
  );
}
