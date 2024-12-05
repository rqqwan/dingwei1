import { Application } from '@nativescript/core';
import { initializeGoogleMaps } from './utils/map-utils';
import { requestLocationPermission } from './utils/permissions-utils';
import { setupNotifications } from './utils/notification-utils';

Application.on(Application.launchEvent, () => {
    const googleApiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    initializeGoogleMaps(googleApiKey);
    
    Promise.all([
        requestLocationPermission(),
        setupNotifications()
    ]).catch(error => {
        console.error('初始化错误:', error);
    });
});

Application.run({ moduleName: 'app-root' });