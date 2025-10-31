/**
 * Represents the metadata for a YTS movie torrent.
 */
type YtsData = {
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

/**
 * A scraper class for fetching magnet URIs of movies from YTS.mx using an IMDb ID.
 *
 * This class:
 *  - Queries YTS's AJAX search API with an IMDb ID to find matching movies.
 *  - Retrieves the first matching movie's page URL.
 *  - Scrapes the YTS movie page to extract torrent magnet links along with
 *    their quality, type, and file size.
 *
 * Updated behavior:
 *  - Throws an error if the IMDb ID is invalid or the movie does not exist on YTS.
 *  - Throws an error if the movie exists but has no torrents available.
 *  - Returns `null` if any fetch or parsing step fails, while logging the error.
 */
declare class Scraper {
    static YTS_QUERY_API: string;
    imdbID: string;
    /**
     * Constructor initializes the scraper with an IMDb ID.
     * @param {string} imdbID - The IMDb ID of the movie (e.g., tt1234567).
     */
    constructor(imdbID: string);
    /**
     * Fetches magnet URIs for the movie associated with the IMDb ID.
     *
     * @returns {Promise<Array<YtsData>>} - Returns an array of objects containing:
     *  - `quality`: The resolution quality (e.g., "720p", "1080p").
     *  - `qualityType`: The video encoding type (e.g., "WEB", "BluRay").
     *  - `fileSize`: The file size of the torrent (e.g., "1.4 GB").
     *  - `magnetUri`: The magnet download URI.
     *
     * Throws descriptive errors if:
     *  - The IMDb ID is invalid or no matching movie is found on YTS.
     *  - The movie exists but has no torrents available.
     *
     * Returns `null` if there is a network or parsing error, with error logged to console.
     */
    get(): Promise<YtsData[] | null>;
}

export { Scraper, type YtsData };
