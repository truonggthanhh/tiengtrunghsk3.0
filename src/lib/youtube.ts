export interface YouTubePlayer {
  destroy(): void;
  playVideo(): void;
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
}
interface YouTubeApi {
  Player: new (element: HTMLElement, options: { videoId: string; playerVars?: Record<string, number>; events?: { onReady?: (event: { target: YouTubePlayer }) => void; onStateChange?: (event: { data: number; target: YouTubePlayer }) => void } }) => YouTubePlayer;
  PlayerState: { PLAYING: number };
}
declare global {
  interface Window { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void; }
}
let pending: Promise<YouTubeApi> | undefined;
export function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise<YouTubeApi>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement('script');
    const finish = () => {
      clearTimeout(timeout);
      if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = previous;
    };
    const ready = () => {
      finish();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YouTube player API unavailable'));
      previous?.();
    };
    const timeout = setTimeout(() => { finish(); script.remove(); reject(new Error('YouTube player API timed out')); }, 15000);
    window.onYouTubeIframeAPIReady = ready;
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { finish(); script.remove(); reject(new Error('YouTube player API failed to load')); };
    document.head.appendChild(script);
  }).catch(error => { pending = undefined; throw error; });
  return pending;
}
