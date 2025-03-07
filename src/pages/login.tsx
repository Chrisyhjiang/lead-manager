import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../utils/auth";
import styles from "../styles/login.module.css";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Validate credentials
    const isLoggedIn = login(username, password);
    if (isLoggedIn) {
      router.push("/leads"); // Redirect to the protected page
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <form onSubmit={handleLogin} className={styles["login-box"]}>
        <h1 className={styles["title"]}>Login</h1>
        {error && <p className={styles["error-message"]}>{error}</p>}
        <div className={styles["form-group"]}>
          <label htmlFor="username" className={styles["label"]}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className={styles["input"]}
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="password" className={styles["label"]}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={styles["input"]}
          />
        </div>
        <button type="submit" className={styles["login-button"]}>
          Log In
        </button>
      </form>
    </div>
  );
}
