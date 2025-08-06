# OpenReplay + PDFTron WebViewer Bug Reproduction

## Issue Description

**Bug**: `TypeError: w is not a function` occurs when PDFTron WebViewer loads PDFs from blob URLs while OpenReplay's network tracking is enabled with `useProxy: true`.

**Root Cause**: OpenReplay's `ResponseProxyHandler` intercepts `response.arrayBuffer()` calls and corrupts binary data during string conversion for logging purposes.

**Error Details**:
```
Corrupted reserved bit
Uncaught TypeError: w is not a function
    at Object.p [as decompressFunction] (webviewer-core.min.js:1:978857)
```
<img width="1018" height="577" alt="image" src="https://github.com/user-attachments/assets/3917a6ea-6b0f-4163-9868-23851eda4c77" />
**Affected Configuration**:
- OpenReplay with `useProxy: true` (default)
- PDFTron WebViewer loading PDFs from blob URLs
- Production builds only (development works fine)

## Workaround

Set `useProxy: false` in OpenReplay network configuration:

```javascript
tracker.configure({
  projectKey: 'your-project-key',
  network: {
    capturePayload: true,
    useProxy: false  // Prevents blob corruption
  }
});
```

## Test Application

This minimal React app demonstrates the issue pattern used in our production application:

1. OpenReplay initialization with network tracking
2. PDFTron WebViewer component similar to production implementation
3. PDF loading from blob URLs (production scenario)

## Running the Test

```bash
npm install
npm run build
npm run serve
```

**Note**: The issue only manifests in production builds, not development mode.

## Technical Analysis

The bug occurs in OpenReplay's network proxy chain:
1. `FetchProxyHandler` intercepts blob URL requests
2. `ResponseProxyHandler` wraps the response object
3. When WebViewer calls `response.arrayBuffer()`, the proxy corrupts the binary data
4. WebViewer's decompression function fails with "w is not a function"

Files involved in OpenReplay codebase:
- `networkProxy/src/fetchProxy.ts` (ResponseProxyHandler.get method)
- `networkProxy/src/utils.ts` (getStringResponseByType function)
