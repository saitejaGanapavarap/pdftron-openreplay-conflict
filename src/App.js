import React, { useState, useEffect } from 'react';
import PDFViewer from './components/PDFViewer';
import { initializeOpenReplay } from './utils/initializeOpenReplay';

function App() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [status, setStatus] = useState('Ready');

  // Initialize OpenReplay on mount (same as production)
  useEffect(() => {
    initializeOpenReplay();
  }, []);

  // Create a sample PDF blob URL (simulates production scenario)
  const createSamplePdfBlob = async () => {
    try {
      setStatus('Creating PDF blob...');
      
      // Create a minimal PDF content (this simulates how production gets PDF data)
      const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 44>>stream
BT /F1 12 Tf 100 700 Td (Hello World) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f
0000000010 00000 n
0000000054 00000 n
0000000100 00000 n
0000000178 00000 n
trailer<</Size 5/Root 1 0 R>>
startxref
273
%%EOF`;
      
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      console.log('📄 Created PDF blob URL:', blobUrl);
      setPdfUrl(blobUrl);
      setStatus('PDF loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to create PDF blob:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>OpenReplay + PDFTron WebViewer Implementation Sample</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
        <h3>Bug Description:</h3>
        <p><strong>Issue:</strong> PDFTron WebViewer fails with "w is not a function" error when OpenReplay network tracking uses useProxy: true</p>
        <p><strong>Environment:</strong> Production builds with blob URL PDF loading</p>
        <p><strong>Workaround:</strong> Set useProxy: false in OpenReplay network configuration</p>
        <p><strong>Current Status:</strong> {status}</p>
        <p><strong>OpenReplay Active:</strong> {window.tracker?.isActive?.() ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={createSamplePdfBlob}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#007cba', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Load Sample PDF
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Technical Details:</h3>
        <ul>
          <li>This app demonstrates the same implementation pattern as our production application</li>
          <li>OpenReplay network tracking with payload capture enabled</li>
          <li>PDFTron WebViewer component similar to production setup</li>
          <li>PDF loading from blob URLs (typical production scenario)</li>
          <li>Bug manifests only in production builds, not development mode</li>
        </ul>
      </div>

      {pdfUrl && (
        <div>
          <h3>PDF Viewer:</h3>
          <PDFViewer pdfSrc={pdfUrl} />
        </div>
      )}
    </div>
  );
}

export default App;