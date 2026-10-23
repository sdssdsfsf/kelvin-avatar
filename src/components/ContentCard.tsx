import Link from "next/link";
import { publicImageUrl } from "@/lib/storage";

interface ContentCardProps {
  item: {
    id: string;
    name: string;
    type: string;
    bannerKey?: string | null;
    imageKey?: string | null;
    avatarKey?: string | null;
    thumbnailUrl?: string;
    views: number;
    downloads: number;
    creator?: { username: string };
    likes?: any[];
  };
}

export function ContentCard({ item }: ContentCardProps) {
  const banner = item.bannerKey
    ? publicImageUrl(item.bannerKey)
    : item.imageKey
    ? publicImageUrl(item.imageKey)
    : item.thumbnailUrl;

  const avatar = item.avatarKey ? publicImageUrl(item.avatarKey) : null;
  const isProfile = item.type === "PROFILE";
  const likesCount = item.likes ? item.likes.length : 0;

  return (
    <article className="card">
      <Link
        href={isProfile ? `/profiles/${item.id}` : `/wallpapers/${item.id}`}
        style={{ display: "block", textDecoration: "none" }}
      >
        <div className="thumb">
          {isProfile ? (
            <div className="profile-preview-container">
              {/* Blurred Background Layer */}
              <div aria-hidden className="profile-blur-bg">
                {banner ? <img src={banner} alt="" className="blur-img" /> : null}
                {avatar ? <img src={avatar} alt="" className="blur-avatar" /> : null}
                <div className="blur-overlay" />
              </div>

              {/* Foreground Content */}
              <div className="profile-inner-content">
                <div className="profile-banner-box">
                  {banner ? (
                    <img src={banner} alt={item.name} className="banner-img" />
                  ) : (
                    <span className="fallback-icon">✦</span>
                  )}
                </div>
                {avatar ? (
                  <img src={avatar} alt={item.name} className="profile-avatar-img" />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="wallpaper-preview-container">
              {banner ? (
                <img loading="lazy" src={banner} alt={item.name} className="wallpaper-img" />
              ) : (
                <span className="fallback-icon">✦</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="card-body">
        <Link
          href={isProfile ? `/profiles/${item.id}` : `/wallpapers/${item.id}`}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <h3>{item.name}</h3>
        </Link>
        {item.creator?.username && (
          <div className="muted">بواسطة {item.creator.username}</div>
        )}
        <div className="meta">
          <span>♡ {likesCount} إعجاب</span>
          <span>◉ {item.views} مشاهدة</span>
          <span>↓ {item.downloads} تنزيل</span>
        </div>
      </div>

      <style jsx>{`
        .card {
          background: #0f0a1c;
          border: 1.5px solid #a855f7;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.15);
        }

        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.35);
        }

        .thumb {
          position: relative;
          overflow: hidden;
        }

        /* Profile Container with Padding for Center Avatar */
        .profile-preview-container {
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          padding: 12px 12px 45px;
          background: #150d27;
        }

        .profile-blur-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .blur-img,
        .blur-avatar {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(18px) saturate(1.2);
          transform: scale(1.3);
          opacity: 0.3;
        }

        .blur-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.2);
        }

        .profile-inner-content {
          position: relative;
          z-index: 2;
        }

        .profile-banner-box {
          aspect-ratio: 16/9;
          width: 100%;
          overflow: hidden;
          border-radius: 14px;
          border: 2px solid #111;
          background: #1a102f;
        }

        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .profile-avatar-img {
          width: 76px;
          height: 76px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #0f0a1c;
          background: #fff;
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
        }

        .wallpaper-preview-container {
          width: 100%;
          height: 190px;
          overflow: hidden;
          background: #1f1438;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallpaper-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .fallback-icon {
          font-size: 44px;
          color: rgba(255, 255, 255, 0.3);
        }

        .card-body {
          padding: 16px;
          text-align: center;
        }

        .card-body h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          line-height: 1.35;
          color: #ffffff;
        }

        .muted {
          margin-top: 5px;
          font-size: 13px;
          color: #a78bfa;
        }

        .meta {
          margin-top: 12px;
          font-size: 12px;
          display: flex;
          justify-content: space-around;
          color: #9ca3af;
        }
      `}</style>
    </article>
  );
}