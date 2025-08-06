import React, { useEffect, useRef, useState } from 'react';

const PDFViewer = ({ pdfSrc, width = 800, height = '600px' }) => {
  const containerRef = useRef(null);
  const [instance, setInstance] = useState(null);
  const [error, setError] = useState(null);

  // Utility function to format WebViewer path (same as production)
  const formatUrl = (url) => {
    if (!url) return '/webviewer';
    return `${url.endsWith('/') ? url : `${url}/`}webviewer`;
  };

  useEffect(() => {
    const container = containerRef.current;
    let WebViewer;

    (async function () {
      try {
        // If instance already exists and we have a new PDF, just load it
        if (instance) {
          if (pdfSrc) {
            console.log('🔄 Loading document:', pdfSrc?.substring(0, 100));
            instance.UI?.loadDocument(pdfSrc, { filename: 'sample.pdf' });
          }
          return;
        }

        console.log('🔄 Starting WebViewer initialization...');
        
        // Import and initialize WebViewer (EXACT same pattern as production)
        WebViewer = await import('@pdftron/webviewer');
        const localInstance = await WebViewer.default(
          {
            // Use the exact same path format as Worklist-2
            path: formatUrl(window.location.origin)
          },
          container
        );

        console.log('✅ WebViewer instance created');

        // Initial setup - load null document first (same as production)
        localInstance.UI.loadDocument(null, { onLoadingProgress: true });

        // Configure UI (simplified version of production setup)
        const { FitMode } = localInstance.UI;
        localInstance.UI.setFitMode(FitMode.FitWidth);
        localInstance.UI.disableElements([
          'header',
          'toolsHeader',
          'pageNavOverlay'
        ]);

        setInstance(localInstance);
      } catch (error) {
        console.error('❌ Failed to initialize WebViewer:', error);
        setError(error.message);
      }
    })();

    return () => {
      if (instance) {
        instance.UI.closeDocument();
      }
    };
  }, []);

  // Load document when pdfSrc changes (same pattern as production)
  useEffect(() => {
    if (instance && pdfSrc) {
      console.log('🔄 Loading document:', pdfSrc?.substring(0, 100));
      instance.UI.loadDocument(pdfSrc, { filename: 'sample.pdf' });
    }
  }, [pdfSrc, instance]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', border: '1px solid red' }}>
        <h3>WebViewer Error:</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ width, height, border: '1px solid #ccc' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default PDFViewer;