"use client";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader toggleSidebar={toggleSidebar} />
          {isSidebarOpen && <MobileSidebar toggleSidebar={toggleSidebar} />}
        </>
      ) : (
        <DesktopHeader />
      )}
    </>
  );
}

function MobileHeader({ toggleSidebar }) {
  return (
    <header className={styles.mobileHeader}>
      <div className={styles.logo}>
        Osmo <StarIcon />
      </div>
      <div className={styles.headerButtons}>
        <button className={styles.loginBtn}>Log in</button>
        <button className={styles.getStartedBtn}>Get Started</button>
        <button className={styles.plusBtn} onClick={toggleSidebar}>
          +
        </button>
      </div>
    </header>
  );
}

function DesktopHeader() {
  return (
    <header className={styles.desktopHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.logo}>Osmo</div>
        <StarIcon />
      </div>

      <nav className={styles.mainNav}>
        <ul>
          <li>
           <u> <a href="#" className={styles.activeLink}>Home</a></u>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#">
              Updates<span className={styles.updateCount}>64</span>
            </a>
          </li>
          <li>
            <a href="#">FAQ</a>
          </li>
        </ul>
      </nav>
      <div className={styles.headerButtons}>
        <button className={styles.loginBtn}>Log in</button>
        <button className={styles.getStartedBtn}>Get Started</button>
      </div>
    </header>
  );
}

function MobileSidebar({ toggleSidebar }) {
  return (
    <div className={styles.sidebarOverlay}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.menuText}>MENU</span>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#" className={styles.sidebarLink}>
            Home <span className={styles.arrowIcon}>→</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            Pricing <span className={styles.arrowIcon}>→</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            Updates <sup className={styles.updateCount}>64</sup>{" "}
            <span className={styles.arrowIcon}>→</span>
          </a>
          <a href="#" className={styles.sidebarLink}>
            FAQ <span className={styles.arrowIcon}>→</span>
          </a>
        </nav>
        <div className={styles.sidebarButtons}>
          <button className={styles.memberBtn}>Become a member</button>
          <button className={styles.sidebarLoginBtn}>Log In</button>
        </div>
        <div className={styles.sidebarFooter}>
          Osmo came from constantly digging through old projects wondering, 'How
          did I build that again?' It is basically
        </div>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 160 160"
      fill="none"
      className={styles.starIcon}
    >
      <path
        d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
