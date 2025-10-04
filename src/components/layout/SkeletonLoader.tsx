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
      data-width={width}
      data-height={height}
      data-radius={borderRadius}
    />
  );
};

// Activity Card Skeleton
export const ActivityCardSkeleton: React.FC = () => (
  <div className={"activityCardSkeleton"}>
    <div className={"activityCardSkeletonRow"}>
      <Skeleton width="44px" height="44px" borderRadius="12px" />
      <div className={"activityCardSkeletonText"}>
        <Skeleton width="70%" height="1.1rem" />
        <div className={"activityCardSkeletonMargin"}>
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
  <div className={"newsCardSkeleton"}>
    <Skeleton width="40px" height="40px" borderRadius="12px" />
    <div className={"newsCardSkeletonText"}>
      <Skeleton width="80%" height="1rem" />
      <div className={"newsCardSkeletonMargin"}>
        <Skeleton width="90%" height="0.85rem" />
      </div>
      <Skeleton width="30%" height="0.75rem" />
    </div>
  </div>
);

// Goal Progress Skeleton
export const GoalProgressSkeleton: React.FC = () => (
  <div className={"goalProgressSkeleton"}>
    <div className={"goalProgressSkeletonRow"}>
      <Skeleton width="40px" height="40px" borderRadius="50%" />
      <div className={"goalProgressSkeletonText"}>
        <Skeleton width="60%" height="1rem" />
        <div className={"goalProgressSkeletonMargin"}>
          <Skeleton width="40%" height="0.8rem" />
        </div>
      </div>
    </div>
    <Skeleton width="100%" height="8px" borderRadius="4px" />
  </div>
);

// Quick Stats Skeleton
export const QuickStatsSkeleton: React.FC = () => (
  <div className={"quickStatsSkeleton"}>
    <Skeleton width="40%" height="1.1rem" />
    <div className={"quickStatsSkeletonGrid"}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={"quickStatsSkeletonItem"}>
          <Skeleton width="24px" height="24px" borderRadius="50%" className="mx-auto" />
          <div className="quickStatsSkeletonMarginTop">
            <Skeleton width="30px" height="1.5rem" className="mx-auto" />
          </div>
          <div className="quickStatsSkeletonMarginTopSmall">
            <Skeleton width="60px" height="0.8rem" className="mx-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Profile skeleton loaders
export const ProfileHeaderSkeleton: React.FC = () => (
  <div className={"profileHeaderSkeleton"}>
    <div className={"profileHeaderSkeletonRow"}>
      <div className={"profileHeaderSkeletonAvatar"} />
      <div className={"profileHeaderSkeletonText"}>
        <div className={"profileHeaderSkeletonTitle"} />
        <div className={"profileHeaderSkeletonSubtitle"} />
        <div className={"profileHeaderSkeletonStats"}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={"profileHeaderSkeletonStat"} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const ProfileStatsSkeleton: React.FC = () => (
  <div className={"profileStatsSkeleton"}>
    <div className={"profileStatsSkeletonTitle"} />
    <div className={"profileStatsSkeletonGrid"}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={"profileStatsSkeletonItem"}>
          <div className={"profileStatsSkeletonAvatar"} />
          <div className={"profileStatsSkeletonStat"} />
          <div className={"profileStatsSkeletonLabel"} />
        </div>
      ))}
    </div>
  </div>
);

export const ProfileBadgesSkeleton: React.FC = () => (
  <div className={"profileBadgesSkeleton"}>
    <div className={"profileBadgesSkeletonTitle"} />
    <div className={"profileBadgesSkeletonGrid"}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={"profileBadgesSkeletonItem"}>
          <div className={"profileBadgesSkeletonAvatar"} />
          <div className={"profileBadgesSkeletonText"}>
            <div className={"profileBadgesSkeletonLabel"} />
            <div className={"profileBadgesSkeletonDesc"} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
