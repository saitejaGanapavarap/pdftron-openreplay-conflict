import { tracker } from '@openreplay/tracker';
import trackerAssist from '@openreplay/tracker-assist';

export const initializeOpenReplay = () => {
  // Mock configuration similar to production
  const config = {
    open_replay: {
      project_key: 'YOUR_PROJECT_KEY', // Replace with actual key for testing
      ingestPoint: 'https://api.openreplay.com/ingest'
    }
  };

  // Only initialize if not already configured and if we have a valid project key
  if (!tracker.isActive() && config.open_replay.project_key && config.open_replay.project_key !== 'YOUR_PROJECT_KEY') {
    try {
      tracker.configure({
        projectKey: config.open_replay.project_key,
        network: {
          capturePayload: true,
          useProxy: true,  // BUG: This causes blob URL corruption
          // useProxy: false,  // WORKAROUND: Set to false to fix the issue
        },
        ingestPoint: config.open_replay.ingestPoint,
        respectDoNotTrack: false,
        __DISABLE_SECURE_MODE: true,
      });
      
      tracker.setUserID('test-user@example.com');
      tracker.use(trackerAssist({}));
      tracker.start();
      console.log('✅ OpenReplay started');
    } catch (error) {
      console.warn('⚠️ OpenReplay failed to start:', error.message);
    }
  } else if (config.open_replay.project_key === 'YOUR_PROJECT_KEY') {
    console.log('⚠️ OpenReplay not started - Replace YOUR_PROJECT_KEY with actual project key for testing');
  } else if (tracker.isActive()) {
    console.log('✅ OpenReplay already active');
  }
};