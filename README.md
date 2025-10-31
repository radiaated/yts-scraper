# YTS Scraper

Fetch YTS movie data by **IMDB ID**

### Usage

```javascript
...
// ESM
import * as ytscpr from "@radiaated/yts-scraper";

// CJS
const ytscpr = require("@radiaated/yts-scraper");

const scraper = new ytscpr.Scraper(imdbId: string);
...
// Access YTS data
const data: ytscpr.YtsData[] | null = await scraper.get();
```

`YtsScraper.get()` method returns an array of objects:

```javascript
[
    {
        quality: string,
        qualityType: string,
        fileSize: string,
        magnetUri: string
    },
    ...
]
```

---

HAPPY HACKING!
