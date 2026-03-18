'use client';

import { PageConfig } from '@/types';
import MusicPlayer from './MusicPlayer';

interface PublicPageProps {
  config: PageConfig;
  isPreview?: boolean;
  viewCount?: number;
}

export default function PublicPage({ config, isPreview = false, viewCount }: PublicPageProps) {
  const getBgStyle = () => {
    if (config.background.type === 'gradient' && config.background.gradient) {
      const { from, to, direction } = config.background.gradient;
      return { background: `linear-gradient(${direction}, ${from}, ${to})` };
    }
    if (config.background.type === 'image' && config.background.value) {
      return {
        backgroundImage: `url(${config.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    return { backgroundColor: config.background.value || '#ffffff' };
  };

  const getFontClass = () => {
    const fontMap: Record<string, string> = {
      'Inter': 'font-inter',
      'Poppins': 'font-poppins',
      'Roboto': 'font-roboto',
      'Playfair Display': 'font-playfair',
    };
    return fontMap[config.font] || 'font-inter';
  };

  const getButtonClass = () => {
    switch (config.buttonStyle) {
      case 'pill': return 'rounded-full';
      case 'rounded': return 'rounded-xl';
      case 'square': return 'rounded-none';
      case 'outline': return 'rounded-xl border-2 !bg-transparent';
      default: return 'rounded-full';
    }
  };

  return (
    <div
      className={`min-h-full w-full ${getFontClass()}`}
      style={{ ...getBgStyle(), color: config.textColor }}
    >
      <div className="flex flex-col items-center px-6 pt-12 pb-8 min-h-screen">
        {/* Profile Image */}
        {config.profileImage ? (
          <img
            src={config.profileImage}
            alt={config.title}
            className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-lg mb-4"
            style={{ backgroundColor: `${config.primaryColor}33`, color: config.primaryColor }}
          >
            {config.title.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: config.textColor }}>
          {config.title}
        </h1>
        
        {/* Bio */}
        {config.bio && (
          <p className="text-sm opacity-80 text-center max-w-xs mb-6 leading-relaxed" style={{ color: config.textColor }}>
            {config.bio}
          </p>
        )}
        
        {/* Links */}
        <div className="w-full max-w-xs space-y-3">
          {config.links.map((link, index) => (
            <a
              key={link.id}
              href={isPreview ? '#' : link.url}
              target={isPreview ? undefined : '_blank'}
              rel={isPreview ? undefined : 'noopener noreferrer'}
              onClick={(e) => isPreview && e.preventDefault()}
              className={`block w-full py-3 px-5 text-center font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${getButtonClass()}`}
              style={{
                backgroundColor: config.buttonStyle === 'outline' ? 'transparent' : (link.backgroundColor || config.primaryColor),
                color: config.buttonStyle === 'outline' ? config.textColor : (link.color || '#ffffff'),
                borderColor: config.buttonStyle === 'outline' ? config.textColor : undefined,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {link.title}
            </a>
          ))}
        </div>
        
        {/* Music Player */}
        {config.music?.url && (
          <div className="mt-6 w-full max-w-xs">
            <MusicPlayer
              url={config.music.url}
              title={config.music.title}
              autoplay={config.music.autoplay && !isPreview}
              textColor={config.textColor}
              primaryColor={config.primaryColor}
            />
          </div>
        )}
        
        {/* View count */}
        {viewCount !== undefined && (
          <div className="mt-8 flex items-center gap-1.5 opacity-50 text-xs" style={{ color: config.textColor }}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {viewCount} views
          </div>
        )}
        
        {/* Branding */}
        {!isPreview && (
          <div className="mt-auto pt-8">
            <a href="/" className="flex items-center gap-1.5 opacity-40 hover:opacity-60 transition-opacity">
              <div className="w-4 h-4 bg-current rounded-sm" />
              <span className="text-xs font-medium" style={{ color: config.textColor }}>Made with LinkTree</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
