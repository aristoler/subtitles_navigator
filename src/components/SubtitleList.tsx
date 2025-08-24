// components/SubtitleList.tsx
import React from "react";
import { SubtitleItem } from "../App";

interface Props {
  subtitles: SubtitleItem[];
  currentTime: number;
  onSeek: (time: number) => void;
  onEdit: (subs: SubtitleItem[]) => void;
}

const SubtitleList: React.FC<Props> = ({
  subtitles,
  currentTime,
  onSeek,
  onEdit,
}) => {
  const activeRef = React.useRef<HTMLDivElement>(null);

  return (
    <div>
      {subtitles.map((s) => {
        const isActive = currentTime >= s.startTime && currentTime <= s.endTime;
        return (
          <div
            key={s.id}
            ref={isActive ? activeRef : undefined}
            className={`p-2 cursor-pointer ${isActive ? "bg-blue-200" : ""}`}
            onClick={() => onSeek(s.startTime / 1000)}
          >
            <div className="text-xs text-gray-500">
              {s.startFmt} - {s.endFmt}
            </div>
            <div>{s.text}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SubtitleList;
