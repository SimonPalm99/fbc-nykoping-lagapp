import React from "react";
import styles from "./SkeletonLoader.module.css";

interface SkeletonLoaderProps {
  type?: "card" | "list" | "profile" | "text" | "activity";
  count?: number;
  height?: string;
}

const HEIGHT_CLASS_MAP: Record<string, string> = {
  '1rem': styles['skeleton-h-1'] ?? '',
  '1.25rem': styles['skeleton-h-1_25'] ?? '',
  '1.5rem': styles['skeleton-h-1_5'] ?? '',
  '4rem': styles['skeleton-h-4'] ?? '',
  'auto': '',
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = "card", 
  count = 1,
  height = "auto"
}) => {
  const getHeightClass = (h: string | undefined) => HEIGHT_CLASS_MAP[h || 'auto'] || '';

  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className={`card ${styles['skeleton-card']} ${getHeightClass(height)}`}>
            <div className={`skeleton ${styles['skeleton-title']}`}></div>
            <div className={`skeleton ${styles['skeleton-text']}`}></div>
            <div className={`skeleton ${styles['skeleton-text']} ${styles['skeleton-text-short']}`}></div>
          </div>
        );

      case "list":
        return (
          <div className={styles['skeleton-list-item']}>
            <div className={`skeleton ${styles['skeleton-avatar']}`}></div>
            <div className={styles['skeleton-list-content']}>
              <div className={`skeleton ${styles['skeleton-text']} ${styles['skeleton-list-text70']}`}></div>
              <div className={`skeleton ${styles['skeleton-text']} ${styles['skeleton-list-text50']}`}></div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className={`card ${styles['skeleton-profile']}`}>
            <div className={`skeleton ${styles['skeleton-profile-avatar']}`}></div>
            <div className={`skeleton ${styles['skeleton-profile-title']}`}></div>
            <div className={`skeleton ${styles['skeleton-profile-text']}`}></div>
          </div>
        );

      case "activity":
        return (
          <div className={`card ${styles['skeleton-activity']}`}>
            <div className={styles['skeleton-activity-row']}>
              <div className={`skeleton ${styles['skeleton-text']} ${styles['skeleton-activity-title']}`}></div>
              <div className={`skeleton ${styles['skeleton-badge']}`}></div>
            </div>
            <div className={`skeleton ${styles['skeleton-text']}`}></div>
            <div className={`skeleton ${styles['skeleton-text']} ${styles['skeleton-activity-text70']}`}></div>
          </div>
        );

      case "text":
        return (
          <div className={`skeleton ${styles['skeleton-text']} ${getHeightClass(height || '1rem')}`}></div>
        );

      default:
        return (
          <div className={`skeleton ${styles['skeleton-default']} ${getHeightClass(height || '4rem')}`}></div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={count > 1 ? styles['skeleton-multi'] : undefined}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
