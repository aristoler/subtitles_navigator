// App.tsx
import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import SubtitleList from "./components/SubtitleList";
import ControlPanel from "./components/ControlPanel";

// 类型定义
export interface SubtitleItem {
  id: number;
  startTime: number; // 毫秒
  endTime: number;   // 毫秒
  startStr: string;
  endStr: string;
  text: string;
}

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // 播放时间更新
  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const videoPlayerRef = React.useRef<{ seek: (time: number) => void }>(null);

  // 点击字幕 → 跳转到对应时间
  const handleSeekTo = (time: number) => {
    videoPlayerRef.current?.seek(time);
    console.log("seek to", time);
  };

  // Sync button handler: scroll to active subtitle
  const handleSyncSubtitle = () => {
    const subtitleListDiv = document.querySelector('[data-subtitle-list]');
    const activeDiv = subtitleListDiv?.querySelector('.bg-blue-200');
    if (activeDiv) {
      activeDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height: '100vh',overflow: 'hidden'}}>
      {/*Video Player at Top */}
      <div style={{flex:'0 0 0',display:'flex',flexDirection:'column'}}>
        <VideoPlayer
          ref={videoPlayerRef}
          videoUrl={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          subtitles={subtitles}
        />
      </div>

      {/* ControlPanel below video */}
      <div style={{flex: '0 0 48px',display:'flex',alignItems:'right',justifyContent:'right'}}>
        <ControlPanel
          subtitles={subtitles}
          onVideoUpload={setVideoUrl}
          onSubtitleUpload={setSubtitles}
          onSync={handleSyncSubtitle}
        />
      </div>

      {/* SubtitleList*/}
      <div style={{flex:'1 1 0',minHeight:0,display:'flex',flexDirection:'column'}}>
        <div style={{flex: 1, overflowY: 'auto'}} data-subtitle-list>
          <SubtitleList
            subtitles={subtitles}
            currentTime={currentTime}
            onSeek={handleSeekTo}
            onEdit={setSubtitles}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
