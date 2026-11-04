export interface Song {
  id: string;
  title: string;
  artist?: string | null;
  youtube_video_id: string;
  lrc: string | null;
  created_at?: string;
}
