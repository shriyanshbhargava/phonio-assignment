import Header from "../components/Header/Header";
import styles from "./page.module.css";
import Hero from "@/components/Hero/Hero";
import Testimonials from "../components/Testimonials/Testimonials";
import JoinCallButton from "../components/Livekit/JoinButton/JoinButton";
import RebuildButton from "../components/Rebuild/RebuildButton";

export default function Home() {

  
  return (
    <div>
      <main >
        <Header />
        <Hero />
        <Testimonials />
        <JoinCallButton />
        <RebuildButton />
      </main>
    </div>
  );
}
