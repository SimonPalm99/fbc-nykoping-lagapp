import React from 'react';
import styles from './SportIcon.module.css';

interface SportIconProps {
  type: 'training' | 'match' | 'profile' | 'stats' | 'forum' | 'fines' | 'tactics' | 'health' | 'awards' | 'league' | 'chat' | 'settings' | 'goals' | 'assists' | 'matches' | 'news' | 'motivation' | 'overview';
  size?: number;
  color?: string;
  className?: string;
}

const SportIcon: React.FC<SportIconProps> = ({ type, size = 24, color = 'currentColor', className = '' }) => {
  const getIconPath = () => {
    switch (type) {
      case 'training':
        return (
          <g>
            <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" fill={color}/>
            <circle cx="12" cy="12" r="2" fill={color}/>
            <path d="M8 12H4M20 12H16M12 8V4M12 20V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'match':
        return (
          <g>
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M12 6L15 12L12 18L9 12Z" fill={color}/>
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
          </g>
        );
      case 'profile':
        return (
          <g>
            <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'stats':
        return (
          <g>
            <path d="M3 17L9 11L13 15L21 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 7L16 7L16 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="17" width="4" height="4" fill={color}/>
            <rect x="9" y="11" width="4" height="10" fill={color}/>
            <rect x="13" y="15" width="4" height="6" fill={color}/>
          </g>
        );
      case 'forum':
        return (
          <g>
            <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.60567 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94695 20.885 8.91565 21 11V11.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        );
      case 'fines':
        return (
          <g>
            <rect x="3" y="4" width="18" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M7 8H17M7 12H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="17" cy="20" r="3" fill={color}/>
            <path d="M16 19L17 20L18 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        );
      case 'tactics':
        return (
          <g>
            <rect x="3" y="3" width="18" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
            <circle cx="8" cy="7" r="1.5" fill={color}/>
            <circle cx="12" cy="11" r="1.5" fill={color}/>
            <circle cx="16" cy="7" r="1.5" fill={color}/>
            <path d="M8 8.5L11 10M13 10L16 8.5" stroke={color} strokeWidth="1.5"/>
            <path d="M3 18L21 18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'health':
        return (
          <g>
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2" fill={color}/>
          </g>
        );
      case 'awards':
        return (
          <g>
            <path d="M7.5 8.5L12 3L16.5 8.5L21 7L18 12L21 17L16.5 15.5L12 21L7.5 15.5L3 17L6 12L3 7L7.5 8.5Z" stroke={color} strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="3" fill={color}/>
          </g>
        );
      case 'league':
        return (
          <g>
            <path d="M6 9L12 15L18 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="4" y="4" width="16" height="3" rx="1" fill={color}/>
            <rect x="6" y="17" width="12" height="3" rx="1" fill={color}/>
            <rect x="8" y="10.5" width="8" height="3" rx="1" fill={color}/>
          </g>
        );
      case 'chat':
        return (
          <g>
            <path d="M8 12H16M8 16H13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M18 8V16L22 20V8C22 6.89543 21.1046 6 20 6H18Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
          </g>
        );
      case 'settings':
        return (
          <g>
            <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.29C19.896 4.47575 20.0435 4.69632 20.1441 4.93912C20.2448 5.18192 20.2966 5.44217 20.2966 5.705C20.2966 5.96783 20.2448 6.22808 20.1441 6.47088C20.0435 6.71368 19.896 6.93425 19.71 7.12L19.65 7.18C19.4195 7.41568 19.2648 7.71502 19.206 8.03941C19.1472 8.36381 19.1869 8.69838 19.32 9V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        );
      case 'goals':
        return (
          <g>
            <path d="M12 2L15.5 8.5L22 9L17 14L18.5 22L12 18.5L5.5 22L7 14L2 9L8.5 8.5L12 2Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3"/>
          </g>
        );
      case 'assists':
        return (
          <g>
            <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2" fill="none"/>
            <circle cx="18" cy="16" r="3" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M9.5 10.5L15 13.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 12L16 14M16 14L14 16M16 14H12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        );
      case 'matches':
        return (
          <g>
            <rect x="3" y="6" width="18" height="12" rx="2" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M3 10H21M8 6V2M16 6V2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="9" cy="14" r="1.5" fill={color}/>
            <circle cx="15" cy="14" r="1.5" fill={color}/>
          </g>
        );
      case 'news':
        return (
          <g>
            <path d="M4 22H20C21.1046 22 22 21.1046 22 20V4C22 2.89543 21.1046 2 20 2H8C6.89543 2 6 2.89543 6 4V20C6 21.1046 5.10457 22 4 22ZM4 22C2.89543 22 2 21.1046 2 20V9C2 7.89543 2.89543 7 4 7H6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 6H10M18 10H10M18 14H10" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'motivation':
        return (
          <g>
            <path d="M19 14C19.5523 14 20 13.5523 20 13V11C20 10.4477 19.5523 10 19 10C18.4477 10 18 10.4477 18 11V13C18 13.5523 18.4477 14 19 14Z" fill={color}/>
            <path d="M5 14C5.55228 14 6 13.5523 6 13V11C6 10.4477 5.55228 10 5 10C4.44772 10 4 10.4477 4 11V13C4 13.5523 4.44772 14 5 14Z" fill={color}/>
            <path d="M12 17C15.3137 17 18 14.3137 18 11V8C18 4.68629 15.3137 2 12 2C8.68629 2 6 4.68629 6 8V11C6 14.3137 8.68629 17 12 17Z" stroke={color} strokeWidth="2" fill="none"/>
            <path d="M12 17V22M8 22H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          </g>
        );
      case 'overview':
        return (
          <g>
            <rect x="3" y="3" width="7" height="7" rx="1" fill={color}/>
            <rect x="14" y="3" width="7" height="7" rx="1" fill={color}/>
            <rect x="3" y="14" width="7" height="7" rx="1" fill={color}/>
            <rect x="14" y="14" width="7" height="7" rx="1" fill={color}/>
          </g>
        );
      default:
        return <circle cx="12" cy="12" r="10" fill={color}/>;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`${styles.sporticon} ${className}`}
    >
      {getIconPath()}
    </svg>
  );
};

export default SportIcon;
