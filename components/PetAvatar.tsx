import React from 'react';
import { PetType } from '../types';

interface PetAvatarProps {
  type: PetType;
  color: string;
  secondaryColor?: string;
  mood: 'happy' | 'neutral' | 'sad';
  accessoryId?: string; // New prop
  size?: number;
  className?: string;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({ 
  type, 
  color, 
  secondaryColor = '#ffffff', 
  mood, 
  accessoryId,
  size = 100,
  className = ''
}) => {
  // Styles for the leg animation
  const styles = `
    @keyframes swingLeft {
      0%, 100% { transform: rotate(5deg); }
      50% { transform: rotate(-5deg); }
    }
    @keyframes swingRight {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }
    .leg-left { transform-origin: top center; animation: swingLeft 2s infinite ease-in-out; }
    .leg-right { transform-origin: top center; animation: swingRight 2s infinite ease-in-out; }
    .sad .leg-left, .sad .leg-right { animation: none; transform: rotate(0); }
    .happy .leg-left, .happy .leg-right { animation-duration: 1s; }
  `;

  // Face Elements
  const getEyes = () => {
    // If wearing sunglasses/mask that covers eyes
    if (['acc_glasses_sun', 'acc_glasses_3d', 'acc_mask_hero', 'acc_glasses_vr'].includes(accessoryId || '')) return null;

    if (mood === 'sad') {
      return (
        <g fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round">
          <path d="M35 45 Q 40 40 45 45" />
          <path d="M55 45 Q 60 40 65 45" />
          <path d="M48 50 L 48 55" strokeWidth="1" opacity="0.5" /> 
        </g>
      );
    }
    if (mood === 'happy') {
      return (
        <g fill="none" stroke="#374151" strokeWidth="3" strokeLinecap="round">
          <path d="M35 45 Q 40 40 45 45" />
          <path d="M55 45 Q 60 40 65 45" />
        </g>
      );
    }
    // Neutral
    return (
      <g fill="#374151">
        <circle cx="40" cy="45" r="3" />
        <circle cx="60" cy="45" r="3" />
      </g>
    );
  };

  const getMouth = () => {
    if (['acc_mustache', 'acc_beard', 'acc_mask_medical', 'acc_pacifier'].includes(accessoryId || '')) return null;

    // Owl beak overrides mouth
    if (type === 'owl' || type === 'penguin') {
        return <polygon points="45,55 55,55 50,62" fill="#f59e0b" stroke="#d97706" strokeWidth="1"/>;
    }

    if (mood === 'sad') {
      return <path d="M45 60 Q 50 55 55 60" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />;
    }
    if (mood === 'happy') {
       return <path d="M45 55 Q 50 65 55 55" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" />;
    }
    return <line x1="48" y1="58" x2="52" y2="58" stroke="#374151" strokeWidth="2" strokeLinecap="round" />;
  };

  // Ear Types / Head Features
  const getEars = () => {
    switch (type) {
      case 'cat':
      case 'tiger':
        return (
          <>
            <path d="M25 35 L 20 10 L 45 25 Z" fill={color} />
            <path d="M75 35 L 80 10 L 55 25 Z" fill={color} />
            <path d="M26 30 L 23 15 L 40 25 Z" fill={secondaryColor} opacity="0.6" />
            <path d="M74 30 L 77 15 L 60 25 Z" fill={secondaryColor} opacity="0.6" />
          </>
        );
      case 'bunny':
        return (
          <>
             <ellipse cx="35" cy="15" rx="8" ry="20" fill={color} />
             <ellipse cx="65" cy="15" rx="8" ry="20" fill={color} />
             <ellipse cx="35" cy="15" rx="4" ry="12" fill={secondaryColor} opacity="0.6" />
             <ellipse cx="65" cy="15" rx="4" ry="12" fill={secondaryColor} opacity="0.6" />
          </>
        );
      case 'bear':
      case 'panda':
      case 'hamster':
      case 'lion':
        return (
          <>
            <circle cx="20" cy="25" r="12" fill={color} />
            <circle cx="80" cy="25" r="12" fill={color} />
            <circle cx="20" cy="25" r="6" fill={secondaryColor} opacity="0.6" />
            <circle cx="80" cy="25" r="6" fill={secondaryColor} opacity="0.6" />
          </>
        );
      case 'fox':
      case 'raccoon':
        return (
           <>
            <path d="M20 35 L 15 5 L 50 25 Z" fill={color} />
            <path d="M80 35 L 85 5 L 50 25 Z" fill={color} />
           </>
        );
      case 'dog':
        return (
            <>
                <path d="M25 25 Q 10 30 15 55" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
                <path d="M75 25 Q 90 30 85 55" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
            </>
        );
      case 'koala':
          return (
            <>
                <circle cx="15" cy="35" r="15" fill={color} />
                <circle cx="85" cy="35" r="15" fill={color} />
                <circle cx="15" cy="35" r="10" fill="#e5e7eb" opacity="0.5" />
                <circle cx="85" cy="35" r="10" fill="#e5e7eb" opacity="0.5" />
            </>
          );
      case 'pig':
          return (
            <>
                 <path d="M25 25 L 20 10 L 35 20 Z" fill={color} />
                 <path d="M75 25 L 80 10 L 65 20 Z" fill={color} />
                 {/* Folded ear tip */}
                 <path d="M20 10 L 25 15 L 30 10 Z" fill={secondaryColor} opacity="0.5" />
                 <path d="M80 10 L 75 15 L 70 10 Z" fill={secondaryColor} opacity="0.5" />
            </>
          );
      case 'frog':
          // Eyes stick out
          return (
              <>
                 <circle cx="30" cy="25" r="12" fill={color} />
                 <circle cx="70" cy="25" r="12" fill={color} />
              </>
          );
      case 'owl':
           return (
               <>
                 <path d="M30 25 L 20 10 L 40 25 Z" fill={color} />
                 <path d="M70 25 L 80 10 L 60 25 Z" fill={color} />
               </>
           );
      default:
        return null;
    }
  };

  const getExtras = () => {
      // Animal specific facial features
      switch(type) {
        case 'panda':
             return (
              <>
                <ellipse cx="38" cy="45" rx="7" ry="5" fill="#374151" opacity="0.2" transform="rotate(-15 38 45)" />
                <ellipse cx="62" cy="45" rx="7" ry="5" fill="#374151" opacity="0.2" transform="rotate(15 62 45)" />
              </>
            );
        case 'axolotl':
             return (
               <>
                 <path d="M15 45 Q 5 40 15 35" stroke={secondaryColor} strokeWidth="3" fill="none" />
                 <path d="M15 55 Q 5 50 15 45" stroke={secondaryColor} strokeWidth="3" fill="none" />
                 <path d="M85 45 Q 95 40 85 35" stroke={secondaryColor} strokeWidth="3" fill="none" />
                 <path d="M85 55 Q 95 50 85 45" stroke={secondaryColor} strokeWidth="3" fill="none" />
               </>
            );
        case 'pig':
            return <ellipse cx="50" cy="55" rx="8" ry="6" fill={secondaryColor} />;
        case 'koala':
            return <ellipse cx="50" cy="48" rx="8" ry="10" fill="#374151" />;
        case 'raccoon':
            return (
                <path d="M20 45 Q 50 55 80 45 L 85 55 Q 50 65 15 55 Z" fill="#374151" opacity="0.8" />
            );
        case 'tiger':
            return (
                <>
                    <path d="M50 25 L 48 35 L 52 35 Z" fill="#374151" />
                    <path d="M20 55 L 30 55" stroke="#374151" strokeWidth="1" />
                    <path d="M20 60 L 30 60" stroke="#374151" strokeWidth="1" />
                    <path d="M80 55 L 70 55" stroke="#374151" strokeWidth="1" />
                    <path d="M80 60 L 70 60" stroke="#374151" strokeWidth="1" />
                </>
            );
        case 'lion':
             return (
                 // Mane
                 <circle cx="50" cy="50" r="45" fill="none" stroke={secondaryColor} strokeWidth="10" strokeDasharray="5,5" opacity="0.8" />
             );
        case 'hamster':
             return (
                <>
                 <circle cx="30" cy="55" r="5" fill={secondaryColor} opacity="0.5" />
                 <circle cx="70" cy="55" r="5" fill={secondaryColor} opacity="0.5" />
                </>
             );
        default:
            return null;
      }
  }

  // Accessories
  const getAccessory = () => {
      if (!accessoryId) return null;

      switch (accessoryId) {
          // --- HATS ---
          case 'acc_hat_top':
              return (
                  <g transform="translate(0, -5)">
                      <rect x="35" y="5" width="30" height="25" fill="#1f2937" />
                      <rect x="25" y="30" width="50" height="5" fill="#1f2937" />
                      <rect x="35" y="25" width="30" height="3" fill="#ef4444" />
                  </g>
              );
          case 'acc_hat_party':
              return (
                  <g>
                      <polygon points="50,5 30,35 70,35" fill="#f472b6" />
                      <circle cx="50" cy="5" r="3" fill="#facc15" />
                      <circle cx="45" cy="20" r="2" fill="#fff" opacity="0.5" />
                      <circle cx="55" cy="28" r="2" fill="#fff" opacity="0.5" />
                  </g>
              );
          case 'acc_hat_crown':
              return (
                 <g transform="translate(0, -2)">
                    <path d="M30 30 L 30 15 L 40 25 L 50 10 L 60 25 L 70 15 L 70 30 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                 </g>
              );
          case 'acc_hat_cowboy':
              return (
                  <g transform="translate(0, -5)">
                      <ellipse cx="50" cy="30" rx="40" ry="8" fill="#92400e" />
                      <path d="M35 30 Q 35 5 50 5 Q 65 5 65 30" fill="#92400e" />
                      <path d="M35 25 Q 50 35 65 25" fill="none" stroke="#78350f" strokeWidth="2" />
                  </g>
              );
          case 'acc_hat_viking':
              return (
                  <g transform="translate(0, -5)">
                      <path d="M30 35 Q 50 15 70 35" fill="#9ca3af" stroke="#4b5563" strokeWidth="2" />
                      <path d="M30 30 L 20 15" stroke="#fff" strokeWidth="4" fill="none" />
                      <path d="M70 30 L 80 15" stroke="#fff" strokeWidth="4" fill="none" />
                  </g>
              );
          case 'acc_hat_pirate':
              return (
                  <g transform="translate(0, -8)">
                      <path d="M20 35 Q 50 15 80 35 L 75 25 L 50 15 L 25 25 Z" fill="#1f2937" />
                      <path d="M48 25 L 52 25 M 50 23 L 50 27" stroke="#fff" strokeWidth="2" /> 
                  </g>
              );
          case 'acc_hat_wizard':
               return (
                   <g transform="translate(0, -15)">
                       <polygon points="50,5 25,40 75,40" fill="#4c1d95" />
                       <ellipse cx="50" cy="40" rx="30" ry="5" fill="#5b21b6" />
                       <path d="M45 20 L 50 25 L 55 15" fill="none" stroke="#facc15" strokeWidth="1" />
                   </g>
               );
          case 'acc_hat_chef':
               return (
                   <g transform="translate(0, -10)">
                        <rect x="35" y="25" width="30" height="10" fill="#fff" stroke="#e5e7eb" />
                        <path d="M35 25 Q 30 5 50 5 Q 70 5 65 25" fill="#fff" stroke="#e5e7eb" />
                   </g>
               );
          case 'acc_hat_santa':
               return (
                   <g transform="translate(0, -5)">
                        <path d="M30 30 Q 50 5 70 30" fill="#dc2626" />
                        <circle cx="70" cy="30" r="5" fill="#fff" />
                        <rect x="30" y="30" width="40" height="8" rx="4" fill="#fff" />
                   </g>
               );
           case 'acc_hat_sombrero':
                return (
                    <g transform="translate(0, -5)">
                         <ellipse cx="50" cy="35" rx="45" ry="10" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                         <path d="M40 35 Q 50 10 60 35" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                    </g>
                );
           case 'acc_halo':
                return (
                     <ellipse cx="50" cy="15" rx="25" ry="5" fill="none" stroke="#facc15" strokeWidth="3" />
                );
            case 'acc_horns':
                 return (
                     <g>
                         <path d="M35 25 Q 30 15 25 20" stroke="#dc2626" strokeWidth="4" fill="none" />
                         <path d="M65 25 Q 70 15 75 20" stroke="#dc2626" strokeWidth="4" fill="none" />
                     </g>
                 );
            case 'acc_ears_bunny': // Fake bunny ears
                 return (
                    <g transform="translate(0, -5)">
                        <path d="M40 30 L 35 10 L 45 30" fill="#fbcfe8" />
                        <path d="M60 30 L 65 10 L 55 30" fill="#fbcfe8" />
                    </g>
                 );
            case 'acc_flower':
              return (
                  <g transform="translate(65, 20)">
                       <circle cx="0" cy="0" r="5" fill="#facc15" />
                       <circle cx="0" cy="-7" r="5" fill="#f472b6" />
                       <circle cx="6" cy="-4" r="5" fill="#f472b6" />
                       <circle cx="6" cy="4" r="5" fill="#f472b6" />
                       <circle cx="0" cy="7" r="5" fill="#f472b6" />
                       <circle cx="-6" cy="4" r="5" fill="#f472b6" />
                       <circle cx="-6" cy="-4" r="5" fill="#f472b6" />
                  </g>
              );
            case 'acc_headphones':
                return (
                    <g>
                        <path d="M25 45 Q 25 10 50 10 Q 75 10 75 45" fill="none" stroke="#4b5563" strokeWidth="4" />
                        <rect x="15" y="40" width="12" height="20" rx="4" fill="#ef4444" />
                        <rect x="73" y="40" width="12" height="20" rx="4" fill="#ef4444" />
                    </g>
                );
            case 'acc_headband_ninja':
                 return (
                     <g>
                         <rect x="25" y="25" width="50" height="8" fill="#1f2937" />
                         <circle cx="50" cy="29" r="2" fill="#ef4444" />
                     </g>
                 );

          // --- GLASSES ---
          case 'acc_glasses_nerd':
              return (
                  <g>
                      <circle cx="40" cy="45" r="8" fill="rgba(255,255,255,0.3)" stroke="#000" strokeWidth="2" />
                      <circle cx="60" cy="45" r="8" fill="rgba(255,255,255,0.3)" stroke="#000" strokeWidth="2" />
                      <line x1="48" y1="45" x2="52" y2="45" stroke="#000" strokeWidth="2" />
                  </g>
              );
           case 'acc_glasses_sun':
              return (
                  <g>
                      <path d="M30 40 H 48 V 50 Q 39 55 30 50 Z" fill="#111" />
                      <path d="M52 40 H 70 V 50 Q 61 55 52 50 Z" fill="#111" />
                      <line x1="48" y1="43" x2="52" y2="43" stroke="#111" strokeWidth="2" />
                  </g>
              );
            case 'acc_glasses_3d':
              return (
                  <g>
                       <rect x="30" y="40" width="18" height="12" fill="rgba(239, 68, 68, 0.5)" stroke="black" strokeWidth="1" />
                       <rect x="52" y="40" width="18" height="12" fill="rgba(59, 130, 246, 0.5)" stroke="black" strokeWidth="1" />
                       <line x1="48" y1="46" x2="52" y2="46" stroke="black" strokeWidth="1" />
                       <line x1="25" y1="43" x2="30" y2="43" stroke="black" strokeWidth="1" />
                       <line x1="70" y1="43" x2="75" y2="43" stroke="black" strokeWidth="1" />
                  </g>
              );
            case 'acc_monocle':
                return (
                    <g>
                         <circle cx="60" cy="45" r="8" fill="#fff" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                         <path d="M68 45 Q 75 55 70 80" fill="none" stroke="#f59e0b" strokeWidth="1" />
                    </g>
                );
            case 'acc_eyepatch':
                 return (
                     <g>
                         <path d="M30 45 L 70 25" stroke="#000" strokeWidth="1" />
                         <circle cx="40" cy="45" r="9" fill="#000" />
                     </g>
                 );
            case 'acc_glasses_vr':
                 return (
                     <rect x="25" y="40" width="50" height="15" rx="2" fill="#000" />
                 );
            case 'acc_mask_hero':
                 return (
                     <path d="M25 45 Q 50 55 75 45 L 75 35 Q 50 45 25 35 Z" fill="#3b82f6" />
                 );

            // --- NECK / FACE ---
            case 'acc_bow_tie':
                return (
                    <g transform="translate(0, 15)">
                        <polygon points="50,60 35,55 35,65" fill="#ef4444" />
                        <polygon points="50,60 65,55 65,65" fill="#ef4444" />
                        <circle cx="50" cy="60" r="3" fill="#b91c1c" />
                    </g>
                );
            case 'acc_bow_head':
                return (
                     <g transform="translate(0, -10)">
                        <path d="M50 25 C 30 15, 30 40, 50 30 C 70 40, 70 15, 50 25" fill="#f472b6" />
                        <circle cx="50" cy="28" r="3" fill="#db2777" />
                    </g>
                );
            case 'acc_scarf':
                return (
                    <g>
                        <path d="M30 65 Q 50 75 70 65" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" />
                        <path d="M65 65 L 65 85" stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round" />
                    </g>
                );
            case 'acc_mustache':
                return (
                    <g transform="translate(0, 3)">
                        <path d="M50 52 Q 60 52 65 58 Q 60 55 52 55 L 50 55 L 48 55 Q 40 55 35 58 Q 40 52 50 52" fill="#374151" />
                    </g>
                );
            case 'acc_beard':
                 return (
                     <path d="M30 55 Q 50 80 70 55" fill="#9ca3af" />
                 );
            case 'acc_mask_medical':
                 return (
                     <g>
                        <rect x="30" y="50" width="40" height="20" rx="5" fill="#bfdbfe" />
                        <path d="M30 55 L 20 50" stroke="#fff" strokeWidth="1" />
                        <path d="M70 55 L 80 50" stroke="#fff" strokeWidth="1" />
                     </g>
                 );
            case 'acc_chain_gold':
                 return (
                     <path d="M35 65 Q 50 75 65 65" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="2,2" />
                 );
            case 'acc_pacifier':
                 return (
                     <g transform="translate(0, 5)">
                         <circle cx="50" cy="55" r="5" fill="#60a5fa" />
                         <circle cx="50" cy="55" r="8" fill="none" stroke="#93c5fd" strokeWidth="2" />
                         <rect x="48" y="58" width="4" height="6" fill="#60a5fa" />
                     </g>
                 );
            case 'acc_clown_nose':
                 return <circle cx="50" cy="48" r="6" fill="#dc2626" />;
            case 'acc_pipe':
                 return (
                     <g>
                         <path d="M55 58 L 65 58 Q 70 58 70 53 L 70 50" fill="none" stroke="#78350f" strokeWidth="3" />
                         <rect x="68" y="45" width="5" height="8" fill="#78350f" />
                     </g>
                 );

          default:
              return null;
      }
  }

  // Blush for happy
  const getBlush = () => {
    if (mood === 'happy') {
      return (
        <>
          <ellipse cx="25" cy="55" rx="5" ry="3" fill="#ffb7b2" opacity="0.6" />
          <ellipse cx="75" cy="55" rx="5" ry="3" fill="#ffb7b2" opacity="0.6" />
        </>
      )
    }
    return null;
  };

  return (
    <div className={`${className} ${mood}`} style={{ width: size, height: size }}>
      <style>{styles}</style>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Legs (Behind Body) */}
        <g className="legs-container">
            <rect className="leg-left" x="35" y="70" width="10" height="25" rx="5" fill={color} />
            <rect className="leg-right" x="55" y="70" width="10" height="25" rx="5" fill={color} />
        </g>
        
        {/* Ears (Behind Body) */}
        {getEars()}

        {/* Body */}
        <ellipse cx="50" cy="55" rx="40" ry="35" fill={color} />
        
        {/* Belly/Face Area Highlight (Optional for some types) */}
        {(type === 'bear' || type === 'fox' || type === 'cat' || type === 'dog' || type === 'koala' || type === 'penguin') && (
            <ellipse cx="50" cy="65" rx="25" ry="20" fill="#ffffff" opacity="0.3" />
        )}

        {/* Face */}
        {getExtras()}
        {getBlush()}
        {getEyes()}
        {getMouth()}
        
        {/* Accessory Layer */}
        {getAccessory()}
        
      </svg>
    </div>
  );
};