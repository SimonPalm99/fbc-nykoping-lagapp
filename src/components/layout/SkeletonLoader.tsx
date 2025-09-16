import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '8px',
  className = ''
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        opacity: 0.7
      }}
    />
  );
};

// Activity Card Skeleton
export const ActivityCardSkeleton: React.FC = () => (
  <div style={{
    background: 'var(--card-background)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Skeleton width="44px" height="44px" borderRadius="12px" />
      <div style={{ flex: 1 }}>
        <Skeleton width="70%" height="1.1rem" />
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton width="50%" height="0.85rem" />
        </div>
      </div>
    </div>
    <Skeleton width="60%" height="0.9rem" />
    <Skeleton width="80%" height="0.9rem" />
  </div>
);

// News Card Skeleton
export const NewsCardSkeleton: React.FC = () => (
  <div style={{
    background: 'var(--card-background)',
    borderRadius: '16px',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid var(--border-color)'
  }}>
    <Skeleton width="40px" height="40px" borderRadius="12px" />
    <div style={{ flex: 1 }}>
      <Skeleton width="80%" height="1rem" />
      <div style={{ margin: '0.5rem 0' }}>
        <Skeleton width="90%" height="0.85rem" />
      </div>
      <Skeleton width="30%" height="0.75rem" />
    </div>
  </div>
);

// Goal Progress Skeleton
export const GoalProgressSkeleton: React.FC = () => (
  <div style={{
    background: 'var(--card-background)',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="1rem" />
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton width="40%" height="0.8rem" />
        </div>
      </div>
    </div>
    <Skeleton width="100%" height="8px" borderRadius="4px" />
  </div>
);

// Quick Stats Skeleton
export const QuickStatsSkeleton: React.FC = () => (
  <div style={{
    background: 'var(--card-background)',
    borderRadius: '16px',
    padding: '1.5rem',
    border: '1px solid var(--border-color)'
  }}>
    <Skeleton width="40%" height="1.1rem" />
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '1rem',
      marginTop: '1rem'
    }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          textAlign: 'center',
          padding: '1rem 0.5rem',
          borderRadius: '12px',
          background: 'rgba(0,0,0,0.02)'
        }}>
          <Skeleton width="24px" height="24px" borderRadius="50%" className="mx-auto" />
          <div style={{ marginTop: '0.5rem' }}>
            <Skeleton width="30px" height="1.5rem" className="mx-auto" />
          </div>
          <div style={{ marginTop: '0.25rem' }}>
            <Skeleton width="60px" height="0.8rem" className="mx-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Profile skeleton loaders
export const ProfileHeaderSkeleton: React.FC = () => (
  <div style={{
    background: "var(--card-background)",
    borderRadius: "20px",
    padding: "2rem",
    marginBottom: "2rem",
    border: "1px solid var(--border-color)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.6s ease-out"
  }}>
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-accent) 50%, var(--bg-tertiary) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite"
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          width: "200px",
          height: "32px",
          borderRadius: "8px",
          background: "linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-accent) 50%, var(--bg-tertiary) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          marginBottom: "1rem"
        }} />
        <div style={{
          width: "150px",
          height: "20px",
          borderRadius: "6px",
          background: "linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-accent) 50%, var(--bg-tertiary) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          marginBottom: "1.5rem"
        }} />
        <div style={{ display: "flex", gap: "2rem" }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{
              width: "60px",
              height: "60px",
              borderRadius: "12px",
              background: "linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-accent) 50%, var(--bg-tertiary) 100%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.5s infinite ${index * 0.2}s`
            }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ProfileStatsSkeleton: React.FC = () => (
  <div style={{
    background: "var(--card-background)",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid var(--border-color)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.6s ease-out 0.2s both"
  }}>
    <div style={{
      width: "120px",
      height: "24px",
      borderRadius: "6px",
      background: "linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-accent) 50%, var(--bg-tertiary) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      marginBottom: "1rem"
    }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem" }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} style={{
          textAlign: "center",
          padding: "1rem",
          borderRadius: "12px",
          background: "var(--bg-tertiary)"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(90deg, var(--bg-accent) 0%, var(--border-primary) 50%, var(--bg-accent) 100%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.5s infinite ${index * 0.1}s`,
            margin: "0 auto 0.5rem auto"
          }} />
          <div style={{
            width: "30px",
            height: "20px",
            borderRadius: "4px",
            background: "linear-gradient(90deg, var(--bg-accent) 0%, var(--border-primary) 50%, var(--bg-accent) 100%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.5s infinite ${index * 0.1}s`,
            margin: "0 auto 0.25rem auto"
          }} />
          <div style={{
            width: "50px",
            height: "16px",
            borderRadius: "4px",
            background: "linear-gradient(90deg, var(--bg-accent) 0%, var(--border-primary) 50%, var(--bg-accent) 100%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.5s infinite ${index * 0.1}s`,
            margin: "0 auto"
          }} />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileBadgesSkeleton: React.FC = () => (
  <div style={{
    background: "var(--card-background)",
    borderRadius: "16px",
    padding: "1.5rem",
    border: "1px solid var(--border-color)",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    animation: "fadeIn 0.6s ease-out 0.4s both"
  }}>
    <div style={{
      width: "150px",
      height: "24px",
      borderRadius: "6px",
      background: "linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-accent) 50%, var(--bg-tertiary) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      marginBottom: "1rem"
    }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          borderRadius: "12px",
          background: "var(--bg-tertiary)"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: "linear-gradient(90deg, var(--bg-accent) 0%, var(--border-primary) 50%, var(--bg-accent) 100%)",
            backgroundSize: "200% 100%",
            animation: `shimmer 1.5s infinite ${index * 0.1}s`
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              width: "100px",
              height: "18px",
              borderRadius: "4px",
              background: "linear-gradient(90deg, var(--bg-accent) 0%, var(--border-primary) 50%, var(--bg-accent) 100%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.5s infinite ${index * 0.1}s`,
              marginBottom: "0.5rem"
            }} />
            <div style={{
              width: "80px",
              height: "14px",
              borderRadius: "4px",
              background: "linear-gradient(90deg, var(--bg-accent) 0%, var(--border-primary) 50%, var,--bg-accent) 100%)",
              backgroundSize: "200% 100%",
              animation: `shimmer 1.5s infinite ${index * 0.1}s`
            }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
