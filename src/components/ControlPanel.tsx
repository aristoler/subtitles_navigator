// components/ControlPanel.tsx
import React from "react";
import { SubtitleItem } from "../App";
import SrtParser from "srt-parser-2";

interface Props {
  subtitles: SubtitleItem[];
  onVideoUpload: (url: string) => void;
  onSubtitleUpload: (subs: SubtitleItem[]) => void;
  onSync?: () => void;
}

const ControlPanel: React.FC<Props> = ({ subtitles, onVideoUpload, onSubtitleUpload, onSync }) => {
  // 上传视频
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onVideoUpload(url);
    }
  };

  // 上传 SRT 字幕
  const handleSubtitleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parser = new SrtParser();
    const parsed = parser.fromSrt(text); // 浏览器兼容

    const subs: SubtitleItem[] = parsed.map((item: any, index: number) => ({
      id: index + 1,
      startTime: srtTimeToMs(item.startTime),
      endTime: srtTimeToMs(item.endTime),
      startStr: item.startTime,
      endStr:  item.endTime,
      text: item.text,
    }));

    onSubtitleUpload(subs);
  };

  // 导出 SRT
  const handleExport = () => {
    const srtContent = subtitles
      .map((s) => {
        const start = msToSrtTime(s.startTime);
        const end = msToSrtTime(s.endTime);
        return `${s.id}\n${start} --> ${end}\n${s.text}\n`;
      })
      .join("\n");

    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="px-2 py-1 border rounded"
      />
      <input
        type="file"
        accept=".srt"
        onChange={handleSubtitleUpload}
        className="px-2 py-1 border rounded"
      />
      <button
        onClick={handleExport}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        导出字幕
      </button>
      <button
        onClick={onSync}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Sync
      </button>
    </div>
  );
};

// 工具函数：毫秒 → SRT 时间格式
function msToSrtTime(ms: number) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const msPart = String(ms % 1000).padStart(3, "0");
  return `${h}:${m}:${s},${msPart}`;
}

// 工具函数：SRT 时间格式 → 毫秒
function srtTimeToMs(timeStr: string) {
  // 例如 "00:01:15,300"
  const [hms, ms] = timeStr.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600000 + m * 60000 + s * 1000 + Number(ms);
}

export default ControlPanel;
