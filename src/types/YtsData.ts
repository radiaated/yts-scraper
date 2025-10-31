/**
 * Represents the metadata for a YTS movie torrent.
 */
export type YtsData = {
  /**
   * The video quality of the torrent (e.g., "720p", "1080p").
   * Can be null if the quality information is unavailable.
   */
  quality: string | null;

  /**
   * The type of quality, usually describing the source or encoding (e.g., "BluRay", "WebRip").
   * Can be null if the quality type is not specified.
   */
  qualityType: string | null;

  /**
   * The size of the torrent file as a human-readable string (e.g., "1.2 GB").
   * Can be null if the file size is unknown.
   */
  fileSize: string | null;

  /**
   * The magnet URI used to download the torrent.
   * This field is mandatory.
   */
  magnetUri: string;
};
