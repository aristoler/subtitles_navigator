// ControlPanel.tsx
import React, { useRef } from "react";
import { SubtitleItem } from "../App";
import SrtParser from "srt-parser-2";

interface Props {
  subtitles: SubtitleItem[];
  onVideoUpload: (url: string) => void;
  onSubtitleUpload: (subs: SubtitleItem[]) => void;
  onSync?: () => void;
  autoSync?: boolean;
}


const ControlPanel: React.FC<Props> = ({ subtitles, onVideoUpload, onSubtitleUpload, onSync, autoSync }) => {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const srtInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onVideoUpload(url);
    }
  };

  const handleSubtitleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parser = new SrtParser();
    const parsed = parser.fromSrt(text);
    const subs: SubtitleItem[] = parsed.map((item: any, index: number) => ({
      id: index + 1,
      startTime: srtTimeToMs(item.startTime),
      endTime: srtTimeToMs(item.endTime),
      startStr: item.startTime,
      endStr: item.endTime,
      text: item.text,
    }));
    onSubtitleUpload(subs);
  };

  function srtTimeToMs(timeStr: string) {
    const [hms, ms] = timeStr.split(",");
    const [h, m, s] = hms.split(":").map(Number);
    return h * 3600000 + m * 60000 + s * 1000 + Number(ms);
  }

  return (
    <div className="control-panel">
      <input
        type="file"
        accept="video/*,.mp4,.webm,.ogg,.mov,.avi,.mkv,.flv,.wmv"
        style={{ display: "none" }}
        ref={videoInputRef}
        onChange={handleVideoUpload}
      />
      <input
        type="file"
        accept=".srt"
        style={{ display: "none" }}
        ref={srtInputRef}
        onChange={handleSubtitleUpload}
      />
      <button className="cp-btn video" onClick={() => videoInputRef.current?.click()}>
        Video
      </button>
      <button className="cp-btn srt" onClick={() => srtInputRef.current?.click()}>
        SRT
      </button>
      <button className="cp-btn sync" onClick={onSync}>
        {autoSync ? "Syncing" : "Sync"}
      </button>
    </div>
  );
};

export default ControlPanel;
