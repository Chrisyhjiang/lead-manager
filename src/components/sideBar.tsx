import styles from "../styles/sidebar.module.css";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"], // Adjust weight for bold effect
});

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      {/* Logo at the top */}
      <div className={styles.logoContainer}>
        <h1 className={`${styles.logo} ${poppins.className}`}>alma</h1>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul>
          <li>
            <Link href="/leads">
              <span className={styles.navLink}>Leads</span>
            </Link>
          </li>
          <li>
            <Link href="/settings">
              <span className={styles.navLink}>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
