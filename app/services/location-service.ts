import { Geolocation } from '@nativescript/geolocation';
import { CoreTypes } from '@nativescript/core';
import { Location } from '../models/location.model';
import { sendLocationNotification } from '../utils/notification-utils';

export class LocationService {
    private static instance: LocationService;
    private currentLocation: Location | null = null;
    private watchId: number | null = null;

    private constructor() {}

    public static getInstance(): LocationService {
        if (!LocationService.instance) {
            LocationService.instance = new LocationService();
        }
        return LocationService.instance;
    }

    async requestPermissions(): Promise<boolean> {
        const hasPermission = await Geolocation.hasPermissions();
        if (!hasPermission) {
            return await Geolocation.requestPermissions();
        }
        return hasPermission;
    }

    async getCurrentLocation(): Promise<Location> {
        try {
            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: CoreTypes.Accuracy.high,
                maximumAge: 5000,
                timeout: 10000
            });

            this.currentLocation = {
                latitude: location.latitude,
                longitude: location.longitude,
                timestamp: new Date()
            };

            await sendLocationNotification(location.latitude, location.longitude);
            return this.currentLocation;
        } catch (error) {
            console.error('获取位置时出错:', error);
            throw error;
        }
    }

    startWatchingLocation(callback: (location: Location) => void): void {
        if (this.watchId !== null) {
            return;
        }

        this.watchId = Geolocation.watchLocation(
            (location) => {
                const newLocation: Location = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    timestamp: new Date()
                };
                callback(newLocation);
            },
            (error) => {
                console.error('监听位置时出错:', error);
            },
            {
                desiredAccuracy: CoreTypes.Accuracy.high,
                updateDistance: 10,
                minimumUpdateTime: 1000
            }
        );
    }

    stopWatchingLocation(): void {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    getLastKnownLocation(): Location | null {
        return this.currentLocation;
    }
}