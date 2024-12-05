import { Application } from '@nativescript/core';

export function initializeGoogleMaps(apiKey: string): void {
    if (global.isAndroid) {
        com.google.android.gms.maps.MapsInitializer.initialize(Application.android.context);
    } else if (global.isIOS) {
        GMSServices.provideAPIKey(apiKey);
    }
}