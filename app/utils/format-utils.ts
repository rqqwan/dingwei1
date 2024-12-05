export function formatCoordinates(latitude: number, longitude: number): string {
    return `位置坐标：\n纬度 ${latitude.toFixed(4)}\n经度 ${longitude.toFixed(4)}`;
}

export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `移动距离：${meters.toFixed(0)}米`;
    }
    return `移动距离：${(meters / 1000).toFixed(2)}公里`;
}

export function formatTimestamp(date: Date): string {
    return `更新时间：${date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })}`;
}