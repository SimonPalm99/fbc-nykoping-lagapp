import React, { useState } from "react";
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
    <div style={{
      minHeight: "100vh",
      background: "var(--background-gradient)",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Parallax background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 60%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255, 206, 84, 0.3) 0%, transparent 50%)
        `,
        animation: "parallaxFloat 20s ease-in-out infinite",
        zIndex: 0
      }} />

      {/* Floating particles */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "60px",
        height: "60px",
        background: "rgba(245, 158, 11, 0.2)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        top: "70%",
        right: "15%",
        width: "40px",
        height: "40px",
        background: "rgba(120, 119, 198, 0.3)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite reverse",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        left: "20%",
        width: "80px",
        height: "80px",
        background: "rgba(255, 119, 198, 0.2)",
        borderRadius: "50%",
        animation: "float 10s ease-in-out infinite",
        zIndex: 0
      }} />

      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "3rem 2rem",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
        zIndex: 1
      }}>
        {/* Animated background gradient */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          right: "-50%",
          bottom: "-50%",
          background: "var(--fbc-gradient)",
          opacity: 0.1,
          borderRadius: "50%",
          animation: "rotate 20s linear infinite"
        }} />

        {/* FBC Logo */}
        <div style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 1.5rem",
            background: "var(--fbc-gradient)",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            color: "white",
            boxShadow: "0 15px 35px rgba(245, 158, 11, 0.3)",
            animation: "glow 2s ease-in-out infinite alternate"
          }}>
            🏒
          </div>
          
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            margin: "0 0 0.5rem 0",
            background: "var(--fbc-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center"
          }}>
            FBC Nyköping
          </h1>
          
          <p style={{
            fontSize: "1.1rem",
            margin: 0,
            color: "var(--text-secondary)",
            opacity: 0.9
          }}>
            Logga in i lagappen
          </p>
        </div>

        {/* Inloggningsformulär */}
        <form onSubmit={handleSubmit} style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "0.75rem"
            }}>
              📧 E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                color: "var(--text-primary)",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--fbc-secondary)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              placeholder="din.epost@exempel.se"
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "0.75rem"
            }}>
              🔒 Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "1rem",
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                color: "var(--text-primary)",
                outline: "none",
                transition: "all 0.3s ease",
                boxSizing: "border-box"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--fbc-secondary)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              placeholder="Ditt lösenord"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "1rem 1.25rem",
              borderRadius: "16px",
              border: "none",
              background: isLoading ? "rgba(107, 114, 128, 0.5)" : "var(--fbc-gradient)",
              color: "white",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: isLoading ? "none" : "0 10px 30px rgba(245, 158, 11, 0.3)",
              opacity: isLoading ? 0.7 : 1,
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(245, 158, 11, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(245, 158, 11, 0.3)";
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }} />
                Loggar in...
              </div>
            ) : (
              "🚀 Logga in"
            )}
          </button>
        </form>

        {/* Testanvändare info */}
        <div style={{
          marginTop: "2.5rem",
          padding: "1.5rem",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          zIndex: 1
        }}>
          <h3 style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: "0 0 1rem 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            🧪 Testanvändare:
          </h3>
          <div style={{
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1rem"
          }}>
            <p style={{
              fontSize: "0.9rem",
              color: "var(--text-primary)",
              margin: "0 0 0.5rem 0",
              fontWeight: "500"
            }}>
              📧 E-post: <span style={{ 
                color: "var(--fbc-secondary)", 
                fontWeight: "700",
                fontFamily: "monospace" 
              }}>simon@fbcnykoping.se</span>
            </p>
            <p style={{
              fontSize: "0.9rem",
              color: "var(--text-primary)",
              margin: 0,
              fontWeight: "500"
            }}>
              🔑 Lösenord: <span style={{ 
                color: "var(--fbc-secondary)", 
                fontWeight: "700",
                fontFamily: "monospace" 
              }}>password123</span>
            </p>
          </div>
          <p style={{
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            margin: 0,
            opacity: 0.8,
            fontStyle: "italic"
          }}>
            💡 Kopiera och klistra in uppgifterna ovan för snabb inloggning
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
