import { isAndroid } from '@nativescript/core/platform';

export const buildConfig = {
    android: {
        appName: '位置共享助手',
        appId: 'org.nativescript.locationsharing',
        version: '1.0.0',
        versionCode: 1,
        keystore: {
            path: 'my-release-key.keystore',
            password: 'my-password',
            alias: 'my-alias',
            aliasPassword: 'my-password'
        }
    },
    ios: {
        appName: 'LocationSharingApp',
        appId: 'org.nativescript.locationsharing',
        version: '1.0.0',
        buildNumber: '1'
    }
};

export function getCurrentPlatformConfig() {
    return isAndroid ? buildConfig.android : buildConfig.ios;
}