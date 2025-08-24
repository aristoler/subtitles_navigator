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
  subtitles: Array<{
    id: number;
    startTime: number;
    endTime: number;
    startStr: string;
    endStr: string;
    text: string;
  }>;
}

export interface VideoPlayerHandle {
  seek: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(
  ({ videoUrl, onTimeUpdate, subtitles }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Plyr | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Convert subtitles to WebVTT format
    const generateVtt = () => {
      if (!subtitles || subtitles.length === 0) return "";
      return (
        "WEBVTT\n" +
        subtitles
          .map(
            (s) =>
              `${s.startStr.replace(",", ".")} --> ${s.endStr.replace(",", ".")}\n${s.text}\n`
          )
          .join("\n")
      );
    };

    // Create a blob URL for the VTT track
    const vttUrl = React.useMemo(() => {
      const vtt = generateVtt();
      if (!vtt) return "";
      const blob = new Blob([vtt], { type: "text/vtt" });
      return URL.createObjectURL(blob);
    }, [subtitles]);

    // 初始化 Plyr on container div
    useEffect(() => {
      if (containerRef.current && !playerRef.current) {
        const videoEl = containerRef.current.querySelector("video");
        if (videoEl) {
          playerRef.current = new Plyr(videoEl, {
            controls: [
              "play",
              "progress",
              "current-time",
              "mute",
              "volume",
              "captions"
            ],
            captions: { active: true, update: true, language: 'auto' }
          });

          playerRef.current.on("timeupdate", () => {
            if (playerRef.current) {
              onTimeUpdate(playerRef.current.currentTime * 1000); // ms
            }
          });
        }
      }
    }, [onTimeUpdate, videoUrl, vttUrl]);

    // 暴露 seek 方法
    useImperativeHandle(ref, () => ({
      seek: (time: number) => {
        if (playerRef.current) {
          playerRef.current.currentTime = time;
        }
      },
    }));

    return (
      <div className="h-full relative" ref={containerRef}>
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full"
            controls
            crossOrigin="anonymous"
          >
            {vttUrl && (
              <track
                label="Subtitles"
                kind="subtitles"
                srcLang="zh"
                src={vttUrl}
                default
              />
            )}
          </video>
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