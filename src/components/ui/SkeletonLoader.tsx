import React from "react";

interface SkeletonLoaderProps {
  type?: "card" | "list" | "profile" | "text" | "activity";
  count?: number;
  height?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = "card", 
  count = 1,
  height = "auto"
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="card skeleton-card" style={{ height, padding: "2rem" }}>
            <div className="skeleton skeleton-title" style={{ 
              height: "1.5rem", 
              width: "60%", 
              marginBottom: "1rem" 
            }}></div>
            <div className="skeleton skeleton-text" style={{ 
              height: "1rem", 
              width: "100%", 
              marginBottom: "0.5rem" 
            }}></div>
            <div className="skeleton skeleton-text" style={{ 
              height: "1rem", 
              width: "80%" 
            }}></div>
          </div>
        );

      case "list":
        return (
          <div className="skeleton-list-item" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "1rem", 
            padding: "1rem",
            borderBottom: "1px solid #f1f5f9"
          }}>
            <div className="skeleton skeleton-avatar" style={{ 
              width: "48px", 
              height: "48px", 
              borderRadius: "50%" 
            }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" style={{ 
                height: "1rem", 
                width: "70%", 
                marginBottom: "0.5rem" 
              }}></div>
              <div className="skeleton skeleton-text" style={{ 
                height: "0.875rem", 
                width: "50%" 
              }}></div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="card skeleton-profile" style={{ padding: "2rem", textAlign: "center" }}>
            <div className="skeleton skeleton-avatar" style={{ 
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              margin: "0 auto 1rem" 
            }}></div>
            <div className="skeleton skeleton-title" style={{ 
              height: "1.5rem", 
              width: "60%", 
              margin: "0 auto 0.5rem" 
            }}></div>
            <div className="skeleton skeleton-text" style={{ 
              height: "1rem", 
              width: "40%", 
              margin: "0 auto" 
            }}></div>
          </div>
        );

      case "activity":
        return (
          <div className="card skeleton-activity" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div className="skeleton skeleton-text" style={{ 
                height: "1.25rem", 
                width: "50%" 
              }}></div>
              <div className="skeleton skeleton-badge" style={{ 
                height: "1.5rem", 
                width: "60px", 
                borderRadius: "999px" 
              }}></div>
            </div>
            <div className="skeleton skeleton-text" style={{ 
              height: "1rem", 
              width: "100%", 
              marginBottom: "0.5rem" 
            }}></div>
            <div className="skeleton skeleton-text" style={{ 
              height: "1rem", 
              width: "70%" 
            }}></div>
          </div>
        );

      case "text":
        return (
          <div className="skeleton skeleton-text" style={{ 
            height: height || "1rem", 
            width: "100%" 
          }}></div>
        );

      default:
        return (
          <div className="skeleton" style={{ 
            height: height || "4rem", 
            width: "100%", 
            borderRadius: "8px" 
          }}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} style={{ marginBottom: count > 1 ? "1rem" : 0 }}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
