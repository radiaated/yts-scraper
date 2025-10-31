import * as cheerio from "cheerio";

import type { YtsData } from "../types/YtsData";

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
export class Scraper {
  // Base URL for YTS's AJAX search API.
  static YTS_QUERY_API = "https://yts.mx/ajax/search?query";

  imdbID: string;
  /**
   * Constructor initializes the scraper with an IMDb ID.
   * @param {string} imdbID - The IMDb ID of the movie (e.g., tt1234567).
   */
  constructor(imdbID: string) {
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
  async get(): Promise<YtsData[] | null> {
    try {
      // Step 1: Query YTS API with the IMDb ID to find the corresponding YTS movie URL.
      const movieLinkRes = await fetch(
        `${Scraper.YTS_QUERY_API}=${this.imdbID}`
      );

      const movieLinkJson = await movieLinkRes.json();

      // Step 2: Validate response — handle case where the IMDb ID is invalid or not found.
      if (movieLinkJson.status === "false") {
        throw new Error(
          "Movie doesn't exist in YTS. Possibly due to an invalid IMDb ID."
        );
      }

      // Extract the first movie result's URL from the API response.
      const movieLink = movieLinkJson.data[0].url;

      // Step 3: Fetch the movie page HTML content from YTS.
      const res = await fetch(movieLink);
      const html = await res.text();

      // Step 4: Load the HTML using Cheerio for DOM parsing.
      const $ = cheerio.load(html);

      // Step 5: Select all torrent modal elements from the page.
      const torrentList = $(".modal-torrent");

      // If no torrents are found, handle gracefully.
      if (torrentList.length === 0) {
        throw new Error("No torrents available for the given IMDb ID.");
      }

      // Step 6: Extract relevant torrent data from each modal.
      const ytsData = torrentList.toArray().map((modalTorEl) => {
        // Extract quality (e.g., "720p", "1080p", "2160p").
        const quality = $(modalTorEl).find(".modal-quality").attr("id") || null;

        // Extract both quality type and file size.
        const qualitySizes = $(modalTorEl)
          .find(".quality-size")
          .toArray()
          .map((qualitySizeEl) => $(qualitySizeEl).text().trim());

        const qualityType = qualitySizes[0] || null;

        const fileSize = qualitySizes[1] || null; // e.g., "1.4 GB"

        // Extract the magnet download link.
        const magnetUri = $(modalTorEl).find(".magnet-download").attr("href");

        if (!magnetUri) {
          throw new Error("Error fetching ytts data");
        }

        return {
          quality,
          qualityType,
          fileSize,
          magnetUri,
        };
      });

      // Step 7: Return structured list of magnet URIs.
      return ytsData;
    } catch (ex) {
      // Log errors for debugging; return null on failure.
      console.error(ex);
      return null;
    }
  }
}
