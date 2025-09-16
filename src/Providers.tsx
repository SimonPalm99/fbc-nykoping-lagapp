import React, { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { ActivityProvider } from "./context/ActivityContext";
import { FineProvider } from "./context/FineContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ForumProvider } from "./context/ForumContext";
import { DrawingProvider } from "./context/DrawingContext";
import { OpponentProvider } from "./context/OpponentContext";
import { LeagueProvider } from "./context/LeagueContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LiveProvider } from "./context/LiveContext";
import { ToastProvider } from "./components/ui/Toast";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Samlad Provider-komponent som wrapprar alla context providers
 * för att hålla App.tsx och index.tsx rena
 */
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ToastProvider>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            <LiveProvider>
              <ActivityProvider>
                <FineProvider>
                  <GamificationProvider>
                    <ForumProvider>
                      <DrawingProvider>
                        <OpponentProvider>
                          <LeagueProvider>
                            {children}
                          </LeagueProvider>
                        </OpponentProvider>
                      </DrawingProvider>
                    </ForumProvider>
                  </GamificationProvider>
                </FineProvider>
              </ActivityProvider>
            </LiveProvider>
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default Providers;
