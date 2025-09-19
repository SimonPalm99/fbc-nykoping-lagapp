import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/apiService";
import { useNavigate } from "react-router-dom";

const initialRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  jerseyNumber: "",
  position: "",
  aboutMe: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelation: "",
  role: "player", // Nytt fält för roll
  profileImageUrl: "", // Nytt fält för profilbild
};

const Welcome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerData, setRegisterData] = useState<typeof initialRegister>(initialRegister);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fade, setFade] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();


  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      const success = await login({ email: loginEmail, password: loginPassword });
      if (success) {
        if (rememberMe) {
          localStorage.setItem("fbc_rememberMe", "true");
        } else {
          localStorage.removeItem("fbc_rememberMe");
        }
        navigate("/");
      } else {
        setLoginError("Felaktiga inloggningsuppgifter. Försök igen.");
      }
    } catch (err) {
      setLoginError("Tekniskt fel. Försök igen senare.");
    }
    setLoading(false);
  };

  // Validering för att gå vidare/skicka
  const validateStep = () => {
    if (registerStep === 1) {
      return (
        registerData.firstName.trim() &&
        registerData.lastName.trim() &&
        registerData.email.trim() &&
        registerData.password.trim() &&
        registerData.confirmPassword.trim() &&
        registerData.phone.trim()
      );
    }
    if (registerStep === 2) {
      return (
        registerData.jerseyNumber.trim() &&
        registerData.position.trim() &&
        registerData.aboutMe.trim()
      );
    }
    if (registerStep === 3) {
      return (
        registerData.emergencyContactName.trim() &&
        registerData.emergencyContactPhone.trim() &&
        registerData.emergencyContactRelation.trim()
      );
    }
    return false;
  };

  // Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    let dataToSend = { ...registerData };
    if (imagePreview) {
      dataToSend.profileImageUrl = imagePreview;
    }
    try {
      const res = await authAPI.register(dataToSend);
      if (res.success) {
        setRegisterSuccess(true);
        setShowModal(true);
        setTimeout(() => {
          setRegisterSuccess(false);
          setShowModal(false);
          setActiveTab('login');
        }, 3000);
      } else {
        alert('Registrering misslyckades: ' + (res.error || 'Okänt fel'));
      }
    } catch (err) {
      alert('Tekniskt fel vid registrering. Försök igen senare.');
    }
    setLoading(false);
  };

  // Animation vid stegbyte
  const nextStep = () => {
    setFade(false);
    setTimeout(() => {
      setRegisterStep(s => Math.min(s + 1, 3));
      setFade(true);
    }, 250);
  };
  const prevStep = () => {
    setFade(false);
    setTimeout(() => {
      setRegisterStep(s => Math.max(s - 1, 1));
      setFade(true);
    }, 250);
  };

  // Profilbilds-uppladdning
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #101820 0%, #1b5e20 60%, #263238 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2vw"
    }} role="main">
      <div style={{
        background: "rgba(16,32,16,0.85)",
        borderRadius: "32px",
        boxShadow: "0 12px 48px rgba(27,94,32,0.18), 0 2px 8px #101820",
        padding: "3.5rem 2.5rem 2.5rem 2.5rem",
        maxWidth: "440px",
        width: "100%",
        position: "relative",
        border: "2px solid #1b5e20"
      }}>
        {/* FBC-logga och header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <img src="/fbc-logo.jpg" alt="FBC Nyköping" style={{ width: 110, height: 110, borderRadius: 28, boxShadow: "0 6px 24px #1b5e20, 0 2px 8px #101820" }} />
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, margin: "1rem 0 0.5rem 0", color: "#fff", letterSpacing: "-0.02em", textShadow: "0 2px 8px #1b5e20, 0 1px 2px #101820" }}>
              Välkommen till FBC Nyköping
            </h1>
            <p style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 600, textShadow: "0 1px 2px #1b5e20" }}>
              Välkommen till FBC Nyköpings lagapp – här samlas allt för spelare och ledare. Logga in eller skapa ett konto för att ta del av träningar, matcher, statistik och klubbens gemenskap!
            </p>
          </div>
        </div>

        {/* Tabbar */}
        <div style={{ display: "flex", marginBottom: "2rem", gap: "1rem" }} role="tablist">
          <button
            aria-label="Logga in"
            tabIndex={0}
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "16px",
              border: "none",
              background: activeTab === 'login' ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "rgba(255,255,255,0.08)",
              color: activeTab === 'login' ? "#fff" : "rgba(255,255,255,0.8)",
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
          >
            Logga in
          </button>
          <button
            aria-label="Registrera"
            tabIndex={0}
            onClick={() => setActiveTab('register')}
            style={{
              flex: 1,
              padding: "1rem",
              borderRadius: "16px",
              border: "none",
              background: activeTab === 'register' ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "rgba(255,255,255,0.08)",
              color: activeTab === 'register' ? "#fff" : "rgba(255,255,255,0.8)",
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
          >
            Registrera
          </button>
        </div>

        {/* Login-formulär */}
        {activeTab === 'login' && !registerSuccess && (
          <form onSubmit={handleLogin} aria-label="Logga in" role="form">
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="E-post"
              aria-label="E-post"
              tabIndex={0}
              style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "14px", border: "1.5px solid #1b5e20", fontSize: "1rem", background: "rgba(255,255,255,0.08)", color: "#fff", boxShadow: "0 1px 4px #101820" }}
              required
            />
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              placeholder="Lösenord"
              aria-label="Lösenord"
              tabIndex={0}
              style={{ width: "100%", padding: "1rem", marginBottom: "1.5rem", borderRadius: "14px", border: "1.5px solid #1b5e20", fontSize: "1rem", background: "rgba(255,255,255,0.08)", color: "#fff", boxShadow: "0 1px 4px #101820" }}
              required
            />
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ marginRight: 8 }}
                aria-label="Kom ihåg mig"
                tabIndex={0}
              />
              <label htmlFor="rememberMe" style={{ color: "#fff", fontSize: "1rem", fontWeight: 600 }}>
                Kom ihåg mig
              </label>
            </div>
            {loginError && (
              <div style={{ color: "#FFD600", fontWeight: 700, marginBottom: "1rem" }} role="alert">
                {loginError}
              </div>
            )}
            <button type="submit" style={{ width: "100%", padding: "1.2rem", borderRadius: "18px", background: "linear-gradient(135deg, #1b5e20 0%, #263238 100%)", color: "#fff", fontWeight: 900, fontSize: "1.15rem", border: "none", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px #101820", transition: "background 0.2s" }} aria-label="Logga in" tabIndex={0} disabled={loading}>
              {loading ? "Loggar in..." : "Logga in"}
            </button>
          </form>
        )}


        {/* Registreringsflöde med validering och utan favoritposition */}
        {activeTab === 'register' && !registerSuccess && (
          <form onSubmit={handleRegister} aria-label="Registrera" role="form">
            {/* Progress-bar för registrering */}
            {activeTab === 'register' && !registerSuccess && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ height: 8, background: "rgba(255,255,255,0.15)", borderRadius: 8 }}>
                  <div style={{
                    width: `${registerStep * 33.33}%`,
                    height: 8,
                    background: "linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%)",
                    borderRadius: 8,
                    transition: "width 0.3s"
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#fff", marginTop: 4 }}>
                  <span>Profil</span>
                  <span>Spelinfo</span>
                  <span>Nödkontakt</span>
                </div>
              </div>
            )}
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
              color: "#fff",
              marginBottom: "1rem",
              boxShadow: fade ? "0 2px 12px rgba(76,175,80,0.12)" : "none",
              opacity: fade ? 1 : 0,
              transition: "opacity 0.25s"
            }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Skapa personligt konto</h2>
              <p style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                Fyll i all information till din profil. Din ansökan måste godkännas av en ledare innan du får tillgång till appen.
              </p>
              {/* Status på ansökan */}
              <div style={{ margin: "0.5rem 0 1rem 0", color: "#FFD600", fontWeight: 700, fontSize: "0.95rem" }}>
                {registerStep === 3 ? "Väntar på ledargodkännande..." : "Fyll i alla steg för att skicka ansökan"}
              </div>
            </div>
            {registerStep === 1 && (
              <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.25s" }}>
                {/* Profilbilds-uppladdning */}
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <div
                    style={{ cursor: "pointer", display: "inline-block" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profilbild" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 8px rgba(76,175,80,0.18)" }} />
                    ) : (
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#4CAF50" }}>
                        +
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#fff", marginTop: 4 }}>Ladda upp profilbild</div>
                </div>
                {/* Roll-väljare */}
                <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                  <label style={{ color: "#fff", fontWeight: 700, marginRight: "1rem" }}>Jag är:</label>
                  <button
                    type="button"
                    onClick={() => setRegisterData({ ...registerData, role: "player" })}
                    style={{
                      padding: "0.7rem 1.2rem",
                      borderRadius: "10px",
                      background: registerData.role === "player" ? "#2E7D32" : "#263238",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      marginRight: "0.5rem",
                      cursor: "pointer"
                    }}
                  >Spelare</button>
                  <button
                    type="button"
                    onClick={() => setRegisterData({ ...registerData, role: "leader" })}
                    style={{
                      padding: "0.7rem 1.2rem",
                      borderRadius: "10px",
                      background: registerData.role === "leader" ? "#2E7D32" : "#263238",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      cursor: "pointer"
                    }}
                  >Ledare</button>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <input type="text" value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })} placeholder="Förnamn*" required aria-label="Förnamn" tabIndex={0} style={{ flex: 1, padding: "1rem", borderRadius: "12px", border: "none" }} />
                  <input type="text" value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })} placeholder="Efternamn" required aria-label="Efternamn" tabIndex={0} style={{ flex: 1, padding: "1rem", borderRadius: "12px", border: "none" }} />
                </div>
                <input type="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} placeholder="E-post" required aria-label="E-post" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "12px", border: "none" }} />
                <input type="password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Lösenord" required aria-label="Lösenord" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "12px", border: "none" }} />
                <input type="password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} placeholder="Bekräfta lösenord" required aria-label="Bekräfta lösenord" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1.5rem", borderRadius: "12px", border: "none" }} />
                <input type="text" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} placeholder="Telefon" required aria-label="Telefon" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1.5rem", borderRadius: "12px", border: "none" }} />
                <button type="button" onClick={nextStep} disabled={!validateStep() || loading} style={{ width: "100%", padding: "1rem", borderRadius: "14px", background: validateStep() && !loading ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "#aaa", color: "#fff", fontWeight: 700, border: "none", marginBottom: "1rem", cursor: validateStep() && !loading ? "pointer" : "not-allowed" }} aria-label="Nästa" tabIndex={0}>
                  Nästa
                </button>
              </div>
            )}
            {registerStep === 2 && (
              <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.25s" }}>
                <input type="text" value={registerData.jerseyNumber} onChange={e => setRegisterData({ ...registerData, jerseyNumber: e.target.value })} placeholder="Tröjnummer" required aria-label="Tröjnummer" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "12px", border: "none" }} />
                <input type="text" value={registerData.position} onChange={e => setRegisterData({ ...registerData, position: e.target.value })} placeholder="Position" required aria-label="Position" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "12px", border: "none" }} />
                <textarea value={registerData.aboutMe} onChange={e => setRegisterData({ ...registerData, aboutMe: e.target.value })} placeholder="Om mig" required aria-label="Om mig" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1.5rem", borderRadius: "12px", border: "none" }} />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="button" onClick={prevStep} style={{ flex: 1, padding: "1rem", borderRadius: "14px", background: "rgba(189,189,189,0.6)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }} aria-label="Tillbaka" tabIndex={0}>Tillbaka</button>
                  <button type="button" onClick={nextStep} disabled={!validateStep() || loading} style={{ flex: 1, padding: "1rem", borderRadius: "14px", background: validateStep() && !loading ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "#aaa", color: "#fff", fontWeight: 700, border: "none", cursor: validateStep() && !loading ? "pointer" : "not-allowed" }} aria-label="Nästa" tabIndex={0}>Nästa</button>
                </div>
              </div>
            )}
            {registerStep === 3 && (
              <div style={{ opacity: fade ? 1 : 0, transition: "opacity 0.25s" }}>
                <input type="text" value={registerData.emergencyContactName} onChange={e => setRegisterData({ ...registerData, emergencyContactName: e.target.value })} placeholder="Nödkontakt namn" required aria-label="Nödkontakt namn" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "12px", border: "none" }} />
                <input type="text" value={registerData.emergencyContactPhone} onChange={e => setRegisterData({ ...registerData, emergencyContactPhone: e.target.value })} placeholder="Nödkontakt telefon" required aria-label="Nödkontakt telefon" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1rem", borderRadius: "12px", border: "none" }} />
                <input type="text" value={registerData.emergencyContactRelation} onChange={e => setRegisterData({ ...registerData, emergencyContactRelation: e.target.value })} placeholder="Relation" required aria-label="Relation" tabIndex={0} style={{ width: "100%", padding: "1rem", marginBottom: "1.5rem", borderRadius: "12px", border: "none" }} />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="button" onClick={prevStep} style={{ flex: 1, padding: "1rem", borderRadius: "14px", background: "rgba(189,189,189,0.6)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }} aria-label="Tillbaka" tabIndex={0}>Tillbaka</button>
                  <button type="submit" disabled={!validateStep() || loading} style={{ flex: 1, padding: "1rem", borderRadius: "14px", background: validateStep() && !loading ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)" : "#aaa", color: "#fff", fontWeight: 700, border: "none", cursor: validateStep() && !loading ? "pointer" : "not-allowed" }} aria-label="Skicka ansökan" tabIndex={0}>
                    {loading ? "Skickar..." : "Skicka ansökan"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Bekräftelse-popup/modal */}
        {showModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "#fff",
              borderRadius: 24,
              padding: "2.5rem 2rem",
              boxShadow: "0 8px 32px rgba(76,175,80,0.18)",
              textAlign: "center",
              minWidth: 280
            }}>
              <h2 style={{ color: "#4CAF50", fontWeight: 900, marginBottom: 12 }}>Ansökan skickad!</h2>
              <p style={{ color: "#333", fontSize: "1.1rem", marginBottom: 8 }}>Din ansökan är mottagen och väntar på ledargodkännande.</p>
              <p style={{ color: "#333", fontSize: "1rem" }}>Du får ett mail när du är godkänd.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
