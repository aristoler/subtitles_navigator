// components/VideoPlayer.tsx
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface Props {
  videoUrl: string | null;
  onTimeUpdate: (time: number) => void;
  subtitleText?: string;
}

export interface VideoPlayerHandle {
  seek: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(
  ({ videoUrl, onTimeUpdate, subtitleText }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<Plyr | null>(null);

    // 初始化 Plyr
    useEffect(() => {
      if (videoRef.current && !playerRef.current) {
        playerRef.current = new Plyr(videoRef.current, {
          controls: [
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
          ],
        });

        playerRef.current.on("timeupdate", () => {
          if (playerRef.current) {
            onTimeUpdate(playerRef.current.currentTime * 1000); // ms
          }
        });
      }
    }, [onTimeUpdate]);

    // 暴露 seek 方法
    useImperativeHandle(ref, () => ({
      seek: (time: number) => {
        if (playerRef.current) {
          playerRef.current.currentTime = time;
        }
      },
    }));

    return (
      <div className="h-full relative">
        {videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
            />
            {subtitleText && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  width: '100%',
                  textAlign: 'center',
                  color: 'white',
                  textShadow: '0 0 2px black',
                  fontSize: '18px',
                  pointerEvents: 'none',
                  padding: '0.5rem 1rem',
                }}
              >
                {subtitleText}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-white">
            请上传视频
          </div>
        )}
      </div>
    );
  }
);
export default VideoPlayer;