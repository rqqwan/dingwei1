import { NativeScriptConfig } from '@nativescript/core';

export default {
    id: 'org.nativescript.locationsharing',
    appPath: 'app',
    appResourcesPath: 'App_Resources',
    android: {
        v8Flags: '--expose_gc',
        markingMode: 'none',
        codeCache: true,
        suppressCallJSMethodExceptions: false
    },
    ios: {
        discardUncaughtJsExceptions: false
    },
    useLegacyWorkflow: false
} as NativeScriptConfig;