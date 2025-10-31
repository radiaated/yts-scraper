"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Scraper: () => Scraper
});
module.exports = __toCommonJS(index_exports);

// src/modules/Scraper.ts
var cheerio = __toESM(require("cheerio"));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Scraper
});
