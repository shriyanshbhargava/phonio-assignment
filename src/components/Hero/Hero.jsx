"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import UnicornStudioEmbed from "../Background/UnicornStudioEmbed";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Osmo - Start building websites people remember</title>
        <meta name="description" content="Osmo - Web development toolbox" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isMobile ? <MobileContent /> : <DesktopContent />}

      <div className={styles.background}>
        <UnicornStudioEmbed
          projectId="UoU6tCsTzJZXfkwww1zf"
          scale={1}
          dpi={1.5}
          fps={30}
          altText="Description of your scene"
          lazyLoad={false}
        />
      </div>
    </div>
  );
}

function MobileContent() {
  return (
    <main className={styles.mainContent}>
      <h1 className={styles.heroText}>
        Start building websites
        <br />
        people
        <br />
        remember.
      </h1>

      <div className={styles.ctaButtons}>
        <button className={styles.memberBtn}>Become a member</button>
        <button className={styles.aboutBtn}>
          <div className={styles.avatarGroup}>
            <div className={styles.avatar}></div>
            <div className={styles.avatar2}></div>
          </div>
          About us
        </button>
      </div>

      <p className={styles.description}>
        Osmo came from constantly digging through old projects wondering, 'How
        did I build that again?' It is basically our personal toolbox, packed
        with components, techniques, tricks and tutorials—and it will keep
        growing.
      </p>
    </main>
  );
}

function DesktopContent() {
  return (
    <>
      <div className={styles.desktopContainer}>
        <div className={styles.sidebarLeft}>
          <div className={styles.sidebarSection}>
            <p>Buttons</p>
            <p>Components</p>
            <p>Transitions</p>
            <p>Animations</p>
            <p>Loaders</p>
          </div>
          <div className={styles.sidebarSection}>
            <p>Documentation</p>
            <p>Tools</p>
            <p>References</p>
            <p>Tutorials</p>
          </div>
        </div>

        <main className={styles.desktopMain}>
          <h1 className={styles.desktopHeroText}>
            Start building websites
            <br />
            people remember.
          </h1>

          <div className={styles.ctaButtons}>
            <button className={styles.memberBtn}>Become a member</button>
            <button className={styles.aboutBtn}>
              <div className={styles.avatarGroup}>
                <div className={styles.avatar}></div>
                <div className={styles.avatar2}></div>
              </div>
              About us
            </button>
          </div>

          <p className={styles.desktopDescription}>
            Osmo came from constantly digging through old projects wondering,
            'How did I build that again?' It is basically our personal toolbox,
            packed with components, techniques, tricks and tutorials—and it will
            keep growing.
          </p>

        </main>
      </div>
    </>
  );
}
