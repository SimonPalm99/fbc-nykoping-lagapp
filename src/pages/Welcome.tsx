import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/apiService";
import { useNavigate } from "react-router-dom";

import styles from "./welcome.module.css";

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
  // ...existing code...
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect till Home om inloggad
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
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
  const [registerError, setRegisterError] = useState<string | null>(null);
  const { login } = useAuth();


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
        setLoginError("Felaktiga inloggningsuppgifter. Kontrollera e-post och lösenord.");
      }
    } catch (err: any) {
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
    setRegisterError(null);
    let dataToSend: any = {
      email: registerData.email,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
      role: registerData.role,
      profileImageUrl: imagePreview || registerData.profileImageUrl
    };
    if (registerData.firstName && registerData.lastName) {
      dataToSend.name = `${registerData.firstName} ${registerData.lastName}`;
    } else if (registerData.firstName) {
      dataToSend.name = registerData.firstName;
    } else if (registerData.lastName) {
      dataToSend.name = registerData.lastName;
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
        setRegisterError(res.error || "Registrering misslyckades. Kontrollera dina uppgifter.");
      }
    } catch (err: any) {
      setRegisterError("Tekniskt fel vid registrering. Försök igen senare.");
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
    <div className={styles.welcomeRoot} role="main">
      <div className={styles.welcomeCard}>
        {/* FBC-logga och header */}
        <div className={styles.welcomeHeader}>
          <div className={styles.welcomeHeaderInner}>
            <img src="/fbc-logo.jpg" alt="FBC Nyköping" className={styles.welcomeLogo} />
            <h1 className={styles.welcomeTitle}>
              Välkommen till FBC Nyköping
            </h1>
            {activeTab === 'login' && (
              <p className={styles.welcomeSubtitle}>
                Välkommen till FBC Nyköpings lagapp – här samlas allt för spelare och ledare. Logga in eller skapa ett konto för att ta del av träningar, matcher, statistik och klubbens gemenskap!
              </p>
            )}
          </div>
        </div>

        {/* Tabbar */}
        <div className={styles.welcomeTabBar} role="tablist">
          <button
            role="tab"
            id="login-tab"
            aria-selected={activeTab === 'login' ? 'true' : 'false'}
            aria-controls="login-panel"
            tabIndex={activeTab === 'login' ? 0 : -1}
            onClick={() => setActiveTab('login')}
            className={activeTab === 'login' ? `${styles.welcomeTabBtn} ${styles.active}` : styles.welcomeTabBtn}
          >
            Logga in
          </button>
          <button
            role="tab"
            id="register-tab"
            aria-selected={activeTab === 'register' ? 'true' : 'false'}
            aria-controls="register-panel"
            tabIndex={activeTab === 'register' ? 0 : -1}
            onClick={() => setActiveTab('register')}
            className={activeTab === 'register' ? `${styles.welcomeTabBtn} ${styles.active}` : styles.welcomeTabBtn}
          >
            Registrera
          </button>
        </div>

        {/* Login-formulär */}
        {activeTab === 'login' && !registerSuccess && (
          <form id="login-panel" onSubmit={handleLogin} aria-label="Logga in" className={styles.loginForm}>
            <input
              type="email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="E-post"
              aria-label="E-post"
              tabIndex={0}
              className={styles.inputField}
              required
            />
            <input
              type="password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              placeholder="Lösenord"
              aria-label="Lösenord"
              tabIndex={0}
              className={styles.inputField}
              required
            />
            <div className={styles.rememberMeRow}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className={styles.rememberMeCheckbox}
                aria-label="Kom ihåg mig"
                tabIndex={0}
              />
              <label htmlFor="rememberMe" className={styles.rememberMeLabel}>
                Kom ihåg mig
              </label>
            </div>
            {loginError && (
              <div className={styles.welcomeAlert} role="alert">
                {loginError}
              </div>
            )}
            <button type="submit" className={styles.welcomeLoginBtn} aria-label="Logga in" tabIndex={0} disabled={loading}>
              {loading ? "Loggar in..." : "Logga in"}
            </button>
          </form>
        )}


        {/* Registreringsflöde med validering och utan favoritposition */}
        {activeTab === 'register' && !registerSuccess && (
          <form id="register-panel" onSubmit={handleRegister} aria-label="Registrera">
            {/* Progress-bar för registrering */}
            {activeTab === 'register' && !registerSuccess && (
              <div className={styles.registerProgressBarWrap}>
                <div className={styles.registerProgressBarBg}>
                  <div className={styles.registerProgressBar} data-width={registerStep * 33.33} />
                </div>
                <div className={styles.registerProgressBarLabels}>
                  <span>Profil</span>
                  <span>Spelinfo</span>
                  <span>Nödkontakt</span>
                </div>
              </div>
            )}
            <div className={fade ? styles.registerContainerFade : styles.registerContainer}>
              <h2 className={styles.registerTitle}>Skapa personligt konto</h2>
              <p className={styles.registerDesc}>
                Fyll i all information till din profil. Din ansökan måste godkännas av en ledare innan du får tillgång till appen.
              </p>
              {/* Status på ansökan */}
              <div className={styles.registerStatus}>
                {registerStep === 3 ? "Väntar på ledargodkännande..." : "Fyll i alla steg för att skicka ansökan"}
              </div>
            </div>
            {registerError && (
              <div className={styles.welcomeAlert} role="alert">
                {registerError}
              </div>
            )}
            {registerStep === 1 && (
              <div className={fade ? styles.registerStepFadeVisible : styles.registerStepFade}>
                {/* Profilbilds-uppladdning */}
                <div className={styles.profileImageUploadWrap}>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className={`${styles.profileImageInput} ${styles.hiddenInput}`}
                    onChange={handleImageChange}
                    title="Ladda upp profilbild"
                  />
                  <div
                    className={styles.profileImageUpload}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profilbild" className={styles.profileImagePreview} />
                    ) : (
                      <div className={styles.profileImagePlaceholder}>+</div>
                    )}
                  </div>
                  <div className={styles.profileImageLabel}>Ladda upp profilbild</div>
                </div>
                {/* Roll-väljare */}
                <div className={styles.roleSelectorWrap}>
                  <label className={styles.roleSelectorLabel}>Jag är:</label>
                  <button
                    type="button"
                    onClick={() => setRegisterData({ ...registerData, role: "player" })}
                    className={registerData.role === "player" ? styles.roleButtonActive : styles.roleButton}
                  >Spelare</button>
                  <button
                    type="button"
                    onClick={() => setRegisterData({ ...registerData, role: "leader" })}
                    className={registerData.role === "leader" ? styles.roleButtonActive : styles.roleButton}
                  >Ledare</button>
                </div>
                <div className={styles.registerInputRow}>
                  <div className={styles.registerInputCol}>
                    <input type="text" value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })} placeholder="Förnamn*" required aria-label="Förnamn" tabIndex={0} className={styles.inputField} />
                    <input type="text" value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })} placeholder="Efternamn" required aria-label="Efternamn" tabIndex={0} className={styles.inputField} />
                  </div>
                </div>
                <input type="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} placeholder="E-post" required aria-label="E-post" tabIndex={0} className={styles.inputField} />
                <input type="password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Lösenord" required aria-label="Lösenord" tabIndex={0} className={styles.inputField} />
                <input type="password" value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} placeholder="Bekräfta lösenord" required aria-label="Bekräfta lösenord" tabIndex={0} className={styles.inputField} />
                <input type="text" value={registerData.phone} onChange={e => setRegisterData({ ...registerData, phone: e.target.value })} placeholder="Telefon" required aria-label="Telefon" tabIndex={0} className={styles.inputField} />
                <button type="button" onClick={nextStep} disabled={!validateStep() || loading} className={styles.registerNextButton} aria-label="Nästa" tabIndex={0}>
                  Nästa
                </button>
              </div>
            )}
            {registerStep === 2 && (
              <div className={styles.registerStepFade}>
                <input type="text" value={registerData.jerseyNumber} onChange={e => setRegisterData({ ...registerData, jerseyNumber: e.target.value })} placeholder="Tröjnummer" required aria-label="Tröjnummer" tabIndex={0} className={styles.inputField} />
                <input type="text" value={registerData.position} onChange={e => setRegisterData({ ...registerData, position: e.target.value })} placeholder="Position" required aria-label="Position" tabIndex={0} className={styles.inputField} />
                <textarea value={registerData.aboutMe} onChange={e => setRegisterData({ ...registerData, aboutMe: e.target.value })} placeholder="Om mig" required aria-label="Om mig" tabIndex={0} className={styles.inputField} />
                <div className={styles.registerButtonRow}>
                  <button type="button" onClick={prevStep} className={styles.registerPrevButton} aria-label="Tillbaka" tabIndex={0}>Tillbaka</button>
                  <button type="button" onClick={nextStep} disabled={!validateStep() || loading} className={styles.registerNextButton} aria-label="Nästa" tabIndex={0}>Nästa</button>
                </div>
              </div>
            )}
            {registerStep === 3 && (
              <div className={styles.registerStepFade}>
                <input type="text" value={registerData.emergencyContactName} onChange={e => setRegisterData({ ...registerData, emergencyContactName: e.target.value })} placeholder="Nödkontakt namn" required aria-label="Nödkontakt namn" tabIndex={0} className={styles.inputField} />
                <input type="text" value={registerData.emergencyContactPhone} onChange={e => setRegisterData({ ...registerData, emergencyContactPhone: e.target.value })} placeholder="Nödkontakt telefon" required aria-label="Nödkontakt telefon" tabIndex={0} className={styles.inputField} />
                <input type="text" value={registerData.emergencyContactRelation} onChange={e => setRegisterData({ ...registerData, emergencyContactRelation: e.target.value })} placeholder="Relation" required aria-label="Relation" tabIndex={0} className={styles.inputField} />
                <div className={styles.registerButtonRow}>
                  <button type="button" onClick={prevStep} className={styles.registerPrevButton} aria-label="Tillbaka" tabIndex={0}>Tillbaka</button>
                  <button type="submit" disabled={!validateStep() || loading} className={styles.registerNextButton} aria-label="Skicka ansökan" tabIndex={0}>
                    {loading ? "Skickar..." : "Skicka ansökan"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Bekräftelse-popup/modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Ansökan skickad!</h2>
              <p className={styles.modalText}>Din ansökan är mottagen och väntar på ledargodkännande.</p>
              <p className={styles.modalText}>Du får ett mail när du är godkänd.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
