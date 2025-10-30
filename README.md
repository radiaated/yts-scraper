# YTS Scraper

Fetch YTS movie data by **IMDB ID**

### Usage

```javascript
...
const yts = new YtsScraper(imdbId: string);
...
await yts.get();
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
