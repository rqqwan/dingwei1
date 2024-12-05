import { Observable } from '@nativescript/core';
import { LocationService } from '../services/location-service';
import { Location, MapMarker } from '../models/location.model';

export class MapViewModel extends Observable {
    private locationService: LocationService;
    private _latitude: number = 39.9042;  // 默认位置：北京
    private _longitude: number = 116.4074;
    private _zoom: number = 15;
    private _bearing: number = 0;
    private _tilt: number = 0;
    private _padding: number[] = [40, 40, 40, 40];
    private _markers: MapMarker[] = [];

    constructor() {
        super();
        this.locationService = LocationService.getInstance();
        this.initializeLocation();
    }

    async initializeLocation() {
        try {
            const hasPermission = await this.locationService.requestPermissions();
            if (hasPermission) {
                const location = await this.locationService.getCurrentLocation();
                this.updateLocation(location);
                this.addMarker(location);
            }
        } catch (error) {
            console.error('初始化位置时出错:', error);
        }
    }

    private updateLocation(location: Location) {
        this.latitude = location.latitude;
        this.longitude = location.longitude;
    }

    private addMarker(location: Location) {
        const marker: MapMarker = {
            position: {
                lat: location.latitude,
                lng: location.longitude
            },
            title: '当前位置',
            snippet: `更新时间: ${location.timestamp.toLocaleString()}`,
            draggable: true
        };
        this._markers.push(marker);
        this.notifyPropertyChange('markers', this._markers);
    }

    onMarkerSelect(args: any) {
        console.log('选中标记:', args.marker.title);
    }

    onCameraChanged(args: any) {
        console.log('地图视角已更改');
    }

    get latitude(): number {
        return this._latitude;
    }

    set latitude(value: number) {
        if (this._latitude !== value) {
            this._latitude = value;
            this.notifyPropertyChange('latitude', value);
        }
    }

    get longitude(): number {
        return this._longitude;
    }

    set longitude(value: number) {
        if (this._longitude !== value) {
            this._longitude = value;
            this.notifyPropertyChange('longitude', value);
        }
    }

    get zoom(): number {
        return this._zoom;
    }

    set zoom(value: number) {
        if (this._zoom !== value) {
            this._zoom = value;
            this.notifyPropertyChange('zoom', value);
        }
    }

    get bearing(): number {
        return this._bearing;
    }

    set bearing(value: number) {
        if (this._bearing !== value) {
            this._bearing = value;
            this.notifyPropertyChange('bearing', value);
        }
    }

    get tilt(): number {
        return this._tilt;
    }

    set tilt(value: number) {
        if (this._tilt !== value) {
            this._tilt = value;
            this.notifyPropertyChange('tilt', value);
        }
    }

    get padding(): number[] {
        return this._padding;
    }

    get markers(): MapMarker[] {
        return this._markers;
    }
}