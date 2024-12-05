import { Geolocation } from '@nativescript/geolocation';

export async function requestLocationPermission(): Promise<void> {
    try {
        await Geolocation.enableLocationRequest();
        console.log('已获取位置权限');
    } catch (error) {
        console.error('请求位置权限时出错:', error);
        throw error;
    }
}