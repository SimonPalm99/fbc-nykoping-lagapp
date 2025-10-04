import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTitle } from "../hooks/useTitle";
import { useToast } from "../components/ui/Toast";

const Login: React.FC = () => {
  useTitle("Logga in | FBC Nyköping");
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        toast.success("Välkommen till FBC Nyköping!");
        navigate("/");
      } else {
        toast.error("Felaktiga inloggningsuppgifter");
      }
    } catch (error) {
      toast.error("Problem vid inloggning");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginRoot}>
      {/* Parallax background */}
      <div className={styles.loginParallax} />

      {/* Floating particles */}
      <div className={styles.loginParticle1} />
      <div className={styles.loginParticle2} />
      <div className={styles.loginParticle3} />

      <div className={styles.loginCard}>
        {/* Animated background gradient */}
        <div className={styles.loginCardGradient} />

        {/* FBC Logo */}
        <div className={styles.loginLogo}>
          <div className={styles.loginLogoIcon}>
            🏒
          </div>
          
          <h1 className={styles.loginLogoTitle}>
            FBC Nyköping
          </h1>
          
          <p className={styles.loginLogoSubtitle}>
            Logga in i lagappen
          </p>
        </div>

        {/* Inloggningsformulär */}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.loginFormGroup}>
            <label className={styles.loginFormLabel}>
              📧 E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.loginFormInput}
              placeholder="din.epost@exempel.se"
            />
          </div>

          <div className={styles.loginFormGroupPassword}>
            <label className={styles.loginFormLabel}>
              🔒 Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.loginFormInput}
              placeholder="Ditt lösenord"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.loginButton}
          >
            {isLoading ? (
              <div className={styles.loginButtonLoading}>
                <div className={styles.loginButtonSpinner} />
                Loggar in...
              </div>
            ) : (
              "🚀 Logga in"
            )}
          </button>
        </form>

        {/* Testanvändare info */}
        <div className={styles.loginTestUser}>
          <h3 className={styles.loginTestUserTitle}>
            🧪 Testanvändare:
          </h3>
          <div className={styles.loginTestUserBox}>
            <p className={styles.loginTestUserEmail}>
              📧 E-post: <span>simon@fbcnykoping.se</span>
            </p>
            <p className={styles.loginTestUserPassword}>
              🔑 Lösenord: <span>password123</span>
            </p>
          </div>
          <p className={styles.loginTestUserHint}>
            💡 Kopiera och klistra in uppgifterna ovan för snabb inloggning
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
