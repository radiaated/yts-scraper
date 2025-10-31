// src/modules/Scraper.ts
import * as cheerio from "cheerio";
var Scraper = class _Scraper {
  // Base URL for YTS's AJAX search API.
  static YTS_QUERY_API = "https://yts.mx/ajax/search?query";
  imdbID;
  /**
   * Constructor initializes the scraper with an IMDb ID.
   * @param {string} imdbID - The IMDb ID of the movie (e.g., tt1234567).
   */
  constructor(imdbID) {
    this.imdbID = imdbID;
  }
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
  async get() {
    try {
      const movieLinkRes = await fetch(
        `${_Scraper.YTS_QUERY_API}=${this.imdbID}`
      );
      const movieLinkJson = await movieLinkRes.json();
      if (movieLinkJson.status === "false") {
        throw new Error(
          "Movie doesn't exist in YTS. Possibly due to an invalid IMDb ID."
        );
      }
      const movieLink = movieLinkJson.data[0].url;
      const res = await fetch(movieLink);
      const html = await res.text();
      const $ = cheerio.load(html);
      const torrentList = $(".modal-torrent");
      if (torrentList.length === 0) {
        throw new Error("No torrents available for the given IMDb ID.");
      }
      const ytsData = torrentList.toArray().map((modalTorEl) => {
        const quality = $(modalTorEl).find(".modal-quality").attr("id")?.split("-").pop() || null;
        const qualitySizes = $(modalTorEl).find(".quality-size").toArray().map((qualitySizeEl) => $(qualitySizeEl).text().trim());
        const qualityType = qualitySizes[0] || null;
        const fileSize = qualitySizes[1] || null;
        const magnetUri = $(modalTorEl).find(".magnet-download").attr("href");
        if (!magnetUri) {
          throw new Error("Error fetching ytts data");
        }
        return {
          quality,
          qualityType,
          fileSize,
          magnetUri
        };
      });
      return ytsData;
    } catch (ex) {
      console.error(ex);
      return null;
    }
  }
};
export {
  Scraper
};
