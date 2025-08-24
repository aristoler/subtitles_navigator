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
  const [autoSync, setAutoSync] = useState(false);

  const handleTimeUpdate = (time: number) => setCurrentTime(time);

  const videoPlayerRef = React.useRef<{ seek: (time: number) => void }>(null);

  const handleSeekTo = (time: number) => {
    videoPlayerRef.current?.seek(time);
  };

  const handleSyncSubtitle = () => {
    if (!autoSync) {
      // First click: scroll once and enable auto-sync
      const subtitleListDiv = document.querySelector('[data-subtitle-list]');
      const activeDiv = subtitleListDiv?.querySelector('.active');
      if (activeDiv) {
        activeDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setAutoSync(true);
    } else {
      // If already auto-syncing, disable auto-sync
      setAutoSync(false);
    }
  };
  // Auto-sync: scroll active subtitle on time update
  React.useEffect(() => {
    if (!autoSync) return;
    const subtitleListDiv = document.querySelector('[data-subtitle-list]');
    const activeDiv = subtitleListDiv?.querySelector('.active');
    if (activeDiv) {
      activeDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentTime, autoSync]);

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
      <div style={{flex: '0 0 48px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <ControlPanel
          subtitles={subtitles}
          onVideoUpload={setVideoUrl}
          onSubtitleUpload={setSubtitles}
          onSync={handleSyncSubtitle}
          autoSync={autoSync}
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
