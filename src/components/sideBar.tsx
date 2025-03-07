// src/components/Sidebar.tsx
import styles from "../styles/sidebar.module.css";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <Link href="/leads">Leads</Link>
          </li>
          <li>
            <Link href="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
