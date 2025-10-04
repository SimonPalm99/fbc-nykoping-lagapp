import React, { useState, useEffect } from "react";
import { AdminApproveUsers } from "../components/profile";
import { useAuth } from "../context/AuthContext";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { useToast } from "../components/ui/Toast";
import styles from "./AdminUsers.module.css";

const AdminUsers: React.FC = () => {
  const { user: currentUser, isAuthenticated, getPendingUsers, approveUser, isLeader, isAdmin } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const loadPendingUsers = React.useCallback(async () => {
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
  }, [getPendingUsers, toast]);

  const pullToRefresh = usePullToRefresh({
    onRefresh: loadPendingUsers,
    enabled: !isLoading && isAuthenticated && (isLeader() || isAdmin())
  });

  useEffect(() => {
    if (isAuthenticated && (isLeader() || isAdmin())) {
      loadPendingUsers();
    }
  }, [isAuthenticated, isLeader, isAdmin, loadPendingUsers]);

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
      <div className={styles.adminUsersWrapper}>
        <div className={styles.adminUsersAuthCard}>
          <div className={styles.adminUsersIcon}>🔒</div>
          <h2 className={styles.adminUsersAuthTitle}>Inte inloggad</h2>
          <p className={styles.adminUsersAuthText}>Du måste logga in för att se denna sida.</p>
        </div>
      </div>
    );
  }

  if (!isLeader() && !isAdmin()) {
    return (
      <div className={styles.adminUsersWrapper}>
        <div className={styles.adminUsersDeniedCard}>
          <div className={styles.adminUsersDeniedIcon}>🚫</div>
          <h2 className={styles.adminUsersDeniedTitle}>Åtkomst nekad</h2>
          <p className={styles.adminUsersDeniedText}>Du har inte behörighet att se denna sida. Endast ledare och administratörer har åtkomst.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={pullToRefresh.containerRef} className={styles.adminUsersWrapper}>
      <div className={styles.adminUsersBgGreen} />
      <div className={styles.adminUsersBgBlue} />

      {pullToRefresh.isPulling && (
        <div
          className={
            `${styles.adminUsersPullIndicator} ` +
            (pullToRefresh.isOverThreshold ? styles.isOverThreshold : styles.isPulling)
          }
        >
          <div className={styles.adminUsersPullIndicatorInner}>
            <div
              className={
                `${styles.adminUsersPullIndicatorSpinner} ` +
                (pullToRefresh.isOverThreshold ? styles.spin : styles.noSpin)
              }
            ></div>
            {pullToRefresh.isOverThreshold ? 'Släpp för att uppdatera' : 'Dra för att uppdatera'}
          </div>
        </div>
      )}

      <div className={styles.adminUsersContainer}>
        <div className={styles.adminUsersHeader}>
          <div className={styles.adminUsersHeaderIcon}>👥</div>
          <h1 className={styles.adminUsersHeaderTitle}>Användarhantering</h1>
          <p className={styles.adminUsersHeaderText}>
            Granska och godkänn nya medlemmar i FBC Nyköping
          </p>
        </div>

        <div className={styles.adminUsersStatsCard}>
          <div className={styles.adminUsersStatsRow}>
            <div>
              <h3 className={styles.adminUsersStatsTitle}>Väntande användare</h3>
              <p className={styles.adminUsersStatsText}>
                {pendingUsers.length} användare väntar på godkännande
              </p>
            </div>
            <div className={styles.adminUsersStatsCount}>{pendingUsers.length}</div>
          </div>
        </div>

        {isLoading && (
          <div className={styles.adminUsersLoadingCard}>
            <div className={styles.adminUsersLoadingSpinner}></div>
            <p className={styles.adminUsersLoadingText}>Laddar användare...</p>
          </div>
        )}

        {!isLoading && (
          <div className={styles.adminUsersApproveCard}>
            <AdminApproveUsers
              users={pendingUsers}
              onApprove={handleApproveUser}
              onReject={handleRejectUser}
            />
          </div>
        )}

        {!isLoading && pendingUsers.length === 0 && (
          <div className={styles.adminUsersEmptyCard}>
            <div className={styles.adminUsersEmptyIcon}>✅</div>
            <h3 className={styles.adminUsersEmptyTitle}>Inga väntande användare</h3>
            <p className={styles.adminUsersEmptyText}>
              Alla nya medlemmar är redan godkända. Bra jobbat!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
