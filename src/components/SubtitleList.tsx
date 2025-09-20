// components/SubtitleList.tsx
import React, { useState } from "react";
import { SubtitleItem } from "../App";

interface Props {
  subtitles: SubtitleItem[];
  currentTime: number;
  onSeek: (time: number) => void;
  onEdit: (subs: SubtitleItem[]) => void; // If not used, consider removing
}

const SubtitleList: React.FC<Props> = ({
  subtitles,
  currentTime,
  onSeek,
  // onEdit,
}) => {
  const activeRef = React.useRef<HTMLDivElement>(null);

  // Find the last subtitle whose startTime is <= currentTime
  let lastActiveId: number | null = null;
  for (let i = 0; i < subtitles.length; i++) {
    if (currentTime >= subtitles[i].startTime) {
      lastActiveId = subtitles[i].id;
    }
    if (currentTime < subtitles[i].endTime) {
      break;
    }
  }

  const [toast, setToast] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(true);
      setTimeout(() => setToast(false), 1200);
    } catch (e) {
      // fallback: do nothing
    }
  };

  return (
    <>
      <div data-subtitle-list>
        {subtitles.map((s) => {
          const isActive = s.id === lastActiveId;
          return (
            <div
              key={s.id}
              ref={isActive ? activeRef : undefined}
              className={`subtitle-panel${isActive ? ' active' : ''}`}
              onClick={() => onSeek(s.startTime / 1000)}
              onDoubleClick={() => handleCopy(s.text)}
              style={{ position: 'relative' }}
            >
              <div className="subtitle-time">
                {s.startStr} - {s.endStr}
              </div>
              <div className="subtitle-text">
                {s.text}
              </div>
            </div>
          );
        })}
      </div>
      {toast && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '48px',
            transform: 'translateX(-50%)',
            background: '#333',
            color: '#fff',
            padding: '8px 24px',
            borderRadius: '8px',
            fontSize: '1em',
            zIndex: 9999,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'opacity 0.8s',
            pointerEvents: 'none',
          }}
        >
          copied
        </div>
      )}
    </>
  );
};

export default SubtitleList;
