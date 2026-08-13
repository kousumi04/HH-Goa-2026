## Local setup

```bash
npm install
```

## Vercel deployment

1. Import this repository into Vercel.
2. Keep the project root set to the repository root.
3. Create a Vercel Blob store from the project's **Storage** tab and make it public. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.
4. Deploy the project.

The X share action rasterizes the profile card, uploads the PNG to Vercel Blob, and opens an X browser composer with the caption and a share URL. The share URL returns server-rendered Open Graph and 
`twitter:card=summary_large_image` metadata, so X can render the generated graphic as the link preview.

The Download button continues to download the PNG directly.

For local development, the API endpoints require `BLOB_READ_WRITE_TOKEN`. Pull Vercel's environment variables with the Vercel CLI or create a `.env` file containing that token. Public link previews can only be verified after deployment because X's crawler must be able to reach the HTTPS URL.
