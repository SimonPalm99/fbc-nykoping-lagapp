import React, { useState, useEffect } from "react";
import { AdminApproveUsers } from "../components/profile";
import { useAuth } from "../context/AuthContext";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { useToast } from "../components/ui/Toast";

const AdminUsers: React.FC = () => {
  const { user: currentUser, isAuthenticated, getPendingUsers, approveUser, isLeader, isAdmin } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadPendingUsers = async () => {
    try {
      setIsLoading(true);
      const users = getPendingUsers();
      setPendingUsers(users);
      if (users.length > 0) {
        toast.success("Användardata uppdaterad!");
      }
    } catch (error) {
      console.error('Fel vid hämtning av väntande användare:', error);
      toast.error("Kunde inte ladda användare");
    } finally {
      setIsLoading(false);
    }
  };

  const pullToRefresh = usePullToRefresh({
    onRefresh: loadPendingUsers,
    enabled: !isLoading && isAuthenticated && (isLeader() || isAdmin())
  });

  useEffect(() => {
    if (isAuthenticated && (isLeader() || isAdmin())) {
      loadPendingUsers();
    }
  }, [isAuthenticated]);

  const handleApproveUser = async (userId: string) => {
    try {
      const success = await approveUser(userId);
      if (success) {
        toast.success("Användare godkänd!");
        // Uppdatera listan
        await loadPendingUsers();
      }
    } catch (error) {
      console.error('Fel vid godkännande av användare:', error);
      toast.error("Kunde inte godkänna användare");
    }
  };

  const handleRejectUser = async (userId: string, reason: string) => {
    try {
      // TODO: Implementera reject-funktionalitet
      console.log('Avvisar användare:', userId, 'Anledning:', reason);
      // För nu, ta bara bort från listan
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      toast.success("Användare avvisad");
    } catch (error) {
      console.error('Fel vid avvisning av användare:', error);
      toast.error("Kunde inte avvisa användare");
    }
  };

  // Kontrollera behörighet
  if (!isAuthenticated || !currentUser) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "3rem",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "400px",
          width: "100%"
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            opacity: 0.8
          }}>
            🔒
          </div>
          <h2 style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1rem"
          }}>
            Inte inloggad
          </h2>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: "1.6"
          }}>
            Du måste logga in för att se denna sida.
          </p>
        </div>
      </div>
    );
  }

  if (!isLeader() && !isAdmin()) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "3rem",
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "400px",
          width: "100%"
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            opacity: 0.8
          }}>
            🚫
          </div>
          <h2 style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "700",
            marginBottom: "1rem"
          }}>
            Åtkomst nekad
          </h2>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: "1.6"
          }}>
            Du har inte behörighet att se denna sida. Endast ledare och administratörer har åtkomst.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pullToRefresh.containerRef}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        top: "60%",
        right: "10%",
        width: "200px",
        height: "200px",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite reverse"
      }} />

      {/* Pull to refresh indicator */}
      {pullToRefresh.isPulling && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: `translateX(-50%) ${pullToRefresh.pullIndicatorStyle.transform || ''}`,
            opacity: pullToRefresh.pullIndicatorStyle.opacity,
            transition: pullToRefresh.pullIndicatorStyle.transition,
            zIndex: 10
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '12px 20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            color: 'white',
            fontWeight: '600'
          }}>
            <div style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: pullToRefresh.isOverThreshold ? 'spin 1s linear infinite' : 'none'
            }}></div>
            {pullToRefresh.isOverThreshold ? 'Släpp för att uppdatera' : 'Dra för att uppdatera'}
          </div>
        </div>
      )}

      <div style={{
        padding: "2rem",
        paddingTop: "6rem",
        position: "relative",
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          marginBottom: "3rem",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            opacity: 0.9
          }}>
            👥
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "900",
            margin: "0 0 1rem 0",
            background: "linear-gradient(135deg, #22c55e, #16a34a, #059669)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center"
          }}>
            Användarhantering
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "1.125rem",
            margin: 0,
            lineHeight: "1.6"
          }}>
            Granska och godkänn nya medlemmar i FBC Nyköping
          </p>
        </div>

        {/* Stats Card */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <h3 style={{
                color: "white",
                fontSize: "1.25rem",
                fontWeight: "700",
                margin: "0 0 0.5rem 0"
              }}>
                Väntande användare
              </h3>
              <p style={{
                color: "rgba(255, 255, 255, 0.7)",
                margin: 0,
                fontSize: "0.875rem"
              }}>
                {pendingUsers.length} användare väntar på godkännande
              </p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              fontSize: "1.5rem",
              fontWeight: "900",
              minWidth: "60px",
              textAlign: "center"
            }}>
              {pendingUsers.length}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "3rem",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "2rem"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              borderTop: "3px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto"
            }}></div>
            <p style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1.125rem",
              margin: 0
            }}>
              Laddar användare...
            </p>
          </div>
        )}

        {/* Admin Approve Users Component */}
        {!isLoading && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "2rem",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
          }}>
            <AdminApproveUsers
              users={pendingUsers}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && pendingUsers.length === 0 && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "3rem",
            textAlign: "center",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              opacity: 0.7
            }}>
              ✅
            </div>
            <h3 style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "700",
              margin: "0 0 1rem 0"
            }}>
              Inga väntande användare
            </h3>
            <p style={{
              color: "rgba(255, 255, 255, 0.7)",
              margin: 0,
              lineHeight: "1.6"
            }}>
              Alla nya medlemmar är redan godkända. Bra jobbat!
            </p>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .admin-users-container {
              padding: 1rem !important;
              padding-top: 5rem !important;
            }
            
            .admin-users-header h1 {
              font-size: 2rem !important;
            }
            
            .admin-users-header p {
              font-size: 1rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminUsers;
