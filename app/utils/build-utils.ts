import { knownFolders, path } from '@nativescript/core';
import { exec } from '@nativescript/core/utils/exec';

export interface BuildConfig {
    platform: 'android' | 'ios';
    release?: boolean;
    keyStorePath?: string;
    keyStorePassword?: string;
    keyStoreAlias?: string;
    keyStoreAliasPassword?: string;
}

export async function buildApp(config: BuildConfig): Promise<string> {
    const buildCommand = getBuildCommand(config);
    try {
        await exec(buildCommand);
        return getOutputPath(config);
    } catch (error) {
        console.error('构建应用时出错:', error);
        throw error;
    }
}

function getBuildCommand(config: BuildConfig): string {
    let command = `ns build ${config.platform}`;
    
    if (config.release) {
        command += ' --release';
        if (config.platform === 'android') {
            command += ` --key-store-path ${config.keyStorePath}`;
            command += ` --key-store-password ${config.keyStorePassword}`;
            command += ` --key-store-alias ${config.keyStoreAlias}`;
            command += ` --key-store-alias-password ${config.keyStoreAliasPassword}`;
        }
    }
    
    return command;
}

function getOutputPath(config: BuildConfig): string {
    const platform = config.platform;
    const appName = 'location-sharing-app';
    
    if (platform === 'android') {
        return path.join(knownFolders.currentApp().path, 'platforms/android/app/build/outputs/apk', 
            config.release ? 'release' : 'debug', 
            `app-${config.release ? 'release' : 'debug'}.apk`);
    } else {
        return path.join(knownFolders.currentApp().path, 'platforms/ios/build/Release-iphoneos', 
            `${appName}.ipa`);
    }
}