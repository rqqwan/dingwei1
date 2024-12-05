import { exec } from '@nativescript/core/utils/exec';
import { getCurrentPlatformConfig } from './build-config';
import { isAndroid } from '@nativescript/core/platform';

export class BuildService {
    async buildRelease(): Promise<string> {
        const config = getCurrentPlatformConfig();
        let buildCommand = '';

        if (isAndroid) {
            buildCommand = `ns build android --release --key-store-path ${config.keystore.path} ` +
                `--key-store-password ${config.keystore.password} ` +
                `--key-store-alias ${config.keystore.alias} ` +
                `--key-store-alias-password ${config.keystore.aliasPassword}`;
        } else {
            buildCommand = 'ns build ios --release';
        }

        try {
            console.log('开始构建应用...');
            await exec(buildCommand);
            console.log('应用构建完成');
            return isAndroid ? 'platforms/android/app/build/outputs/apk/release/app-release.apk' 
                           : `platforms/ios/build/Release-iphoneos/${config.appName}.ipa`;
        } catch (error) {
            console.error('构建失败:', error);
            throw new Error('应用构建失败');
        }
    }
}