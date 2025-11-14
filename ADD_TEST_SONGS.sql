-- ================================================================
-- TEST SONGS FOR YOUTUBE LYRICS SYNC
-- Add sample songs for Mandarin and Cantonese
-- ================================================================

-- NOTE: Replace with actual LRC content from legal sources
-- You can find LRC files from:
-- - LRCLib.net
-- - Megalobiz.com/lrc
-- - Or create your own

-- Example INSERT for Mandarin Song (Replace VIDEO_ID and LRC)
INSERT INTO songs (title, artist, youtube_video_id, lrc, created_at)
VALUES (
  '七里香',
  'Jay Chou 周杰倫',
  'OlFeoi-9Ahs',  -- Replace with actual YouTube video ID
  '[00:00.00]七里香 - 周杰倫
[00:12.50][Lyrics line 1 - Get from LRCLib.net or similar]
[00:16.30][Lyrics line 2]
[00:20.00][Lyrics line 3]
[00:24.00][Continue with full LRC content...]',
  NOW()
);

-- Example INSERT for Cantonese Song (Replace VIDEO_ID and LRC)
INSERT INTO songs (title, artist, youtube_video_id, lrc, created_at)
VALUES (
  '喜歡你',
  'Beyond',
  'dODi8MLvdvk',  -- Replace with actual YouTube video ID
  '[00:00.00]喜歡你 - Beyond
[00:24.00][Lyrics line 1 - Get from LRCLib.net or similar]
[00:29.50][Lyrics line 2]
[00:35.00][Lyrics line 3]
[00:38.00][Continue with full LRC content...]',
  NOW()
);

-- Verify insertion
SELECT id, title, artist,
       substring(youtube_video_id, 1, 20) as video_id,
       length(lrc) as lrc_length,
       created_at
FROM songs
ORDER BY created_at DESC
LIMIT 2;
