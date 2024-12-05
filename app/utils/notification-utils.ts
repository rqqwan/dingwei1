import { LocalNotifications } from '@nativescript/local-notifications';

export async function setupNotifications(): Promise<void> {
    try {
        const hasPermission = await LocalNotifications.requestPermission();
        if (hasPermission) {
            console.log('通知权限已获取');
            await LocalNotifications.schedule([{
                id: 0,
                title: '位置共享助手',
                body: '应用已准备就绪，可以开始使用',
                badge: 1,
                at: new Date()
            }]);
        } else {
            console.log('用户拒绝了通知权限');
        }
    } catch (error) {
        console.error('设置通知时出错:', error);
    }
}

export async function sendLocationNotification(latitude: number, longitude: number): Promise<void> {
    try {
        await LocalNotifications.schedule([{
            id: 1,
            title: '位置信息更新',
            body: `已更新到最新位置:\n纬度 ${latitude.toFixed(4)}\n经度 ${longitude.toFixed(4)}`,
            badge: 1,
            at: new Date(),
            sound: 'notification',
            forceShowWhenInForeground: true
        }]);
    } catch (error) {
        console.error('发送通知时出错:', error);
    }
}