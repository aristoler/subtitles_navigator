// components/SubtitleList.tsx
import React from "react";
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

  return (
    <div data-subtitle-list>
      {subtitles.map((s) => {
        const isActive = s.id === lastActiveId;
        return (
          <div
            key={s.id}
            ref={isActive ? activeRef : undefined}
            className={`subtitle-panel${isActive ? ' active' : ''}`}
            onClick={() => onSeek(s.startTime / 1000)}
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
  );
};

export default SubtitleList;
