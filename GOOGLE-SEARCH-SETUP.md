# Publish the Google Search updates

These files are configured for https://dhaniyal-portfolio.netlify.app/.

## Upload to GitHub

1. Extract `google-search-github-upload.zip` on your computer.
2. Open your existing portfolio repository on GitHub. Upload the extracted files and folders into the repository root, preserving their paths and replacing the matching files. Upload the contents, not the ZIP or its parent folder.
3. Commit the upload. Netlify must deploy this repository and branch. Use `npm run build` as the build command and `dist` as the publish directory.
4. Wait for Netlify's deployment to succeed. If automatic deployment is disabled, trigger a deployment in Netlify.

The update includes `index.html`, the About, Navbar, and Loading components, About styles, two portrait images under `public/images`, `public/robots.txt`, `public/sitemap.xml`, and the original Google verification file under `public`.

`portfolio-google-search-source.zip` is the complete source project for a fresh upload. It includes the package manifest and lockfile; it excludes installed dependencies, build output, previews, and temporary files. For an existing repository, use the smaller update ZIP above.

## Verify and request indexing

1. Open https://search.google.com/search-console/ and select or add the URL-prefix property `https://dhaniyal-portfolio.netlify.app/`.
2. Choose **HTML tag** and click **Verify** after deployment. The exact supplied verification tag is already inside the homepage's `<head>`. Keep it in place after verification.
3. Under **Sitemaps**, submit `sitemap.xml`.
4. Use **URL Inspection** for the homepage, select **Test live URL**, then **Request indexing** if the live test permits it.
5. Confirm these URLs load publicly:
   - https://dhaniyal-portfolio.netlify.app/
   - https://dhaniyal-portfolio.netlify.app/images/dhaniyal-jose-profile.jpg
   - https://dhaniyal-portfolio.netlify.app/images/dhaniyal-jose-profile-avatar.png
   - https://dhaniyal-portfolio.netlify.app/robots.txt
   - https://dhaniyal-portfolio.netlify.app/sitemap.xml

The provided `google5bbc1b6754dca36e.html` is also published at the site root as an alternative HTML-file verification method. The HTML-tag method uses the separate token supplied in chat; the file's filename is not that token.

## What changed on the website

The existing layout, hero character, navigation dimensions, and animations are retained. About Me has a small 64-pixel portrait beside its heading; selecting it opens the full-size photograph. The navigation and loading screen use the supplied circular portrait with their existing display styles. Both photographs use real HTML image elements and descriptive alternative text.

The full portrait is saved as a real JPEG, not a PNG with a changed extension. The circular portrait remains PNG to preserve transparency. Both full-size files are listed in the image sitemap. Metadata identifies Dhaniyal Jose and the preferred professional portrait, and the crawler settings allow indexing.

These changes help Google discover and understand the portfolio and photographs. Google decides whether and when to index them and where to rank them; verification and an indexing request do not guarantee that a search for "Dhaniyal Jose" will show the site or images.

If your public website address changes, update the domain in `index.html`, `public/sitemap.xml`, and `public/robots.txt`, then submit the sitemap for the new Search Console property.

References: [Google image SEO](https://developers.google.com/search/docs/appearance/google-images), [Search Console verification](https://support.google.com/webmasters/answer/9008080), [Request recrawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
