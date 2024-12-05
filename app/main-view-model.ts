import { Observable } from '@nativescript/core';
import { LocationService } from './services/location-service';
import { MapViewModel } from './components/map-view-model';
import { formatCoordinates, formatDistance, formatTimestamp } from './utils/format-utils';
import { Location } from './models/location.model';
import { buildApp, BuildConfig } from './utils/build-utils';
import { createDownloadableZip, saveFile } from './utils/download-utils';
import { isAndroid } from '@nativescript/core/platform';

export class MainViewModel extends Observable {
    private locationService: LocationService;
    private _locationStatus: string = '准备共享位置';
    private _distanceStatus: string = '';
    private _buildStatus: string = '';
    private _mapViewModel: MapViewModel;
    private _isTracking: boolean = false;
    private lastLocation: Location | null = null;

    constructor() {
        super();
        this.locationService = LocationService.getInstance();
        this._mapViewModel = new MapViewModel();
    }

    async updateLocation() {
        try {
            const location = await this.locationService.getCurrentLocation();
            this.updateLocationInfo(location);
        } catch (error) {
            this.locationStatus = '更新位置时出错';
            console.error('更新位置时出错:', error);
        }
    }

    async buildAndDownload() {
        try {
            this.buildStatus = '正在构建应用...';
            
            const config: BuildConfig = {
                platform: isAndroid ? 'android' : 'ios',
                release: true
            };
            
            if (isAndroid) {
                config.keyStorePath = 'my-release-key.keystore';
                config.keyStorePassword = 'my-password';
                config.keyStoreAlias = 'my-alias';
                config.keyStoreAliasPassword = 'my-password';
            }
            
            const outputPath = await buildApp(config);
            this.buildStatus = '应用构建完成，正在准备下载...';
            
            const zipContent = await createDownloadableZip(outputPath);
            const fileName = `location-sharing-app-${config.platform}.zip`;
            saveFile(zipContent, fileName);
            
            this.buildStatus = `应用已打包完成，文件名: ${fileName}`;
        } catch (error) {
            this.buildStatus = '打包过程中出错';
            console.error('打包过程中出错:', error);
        }
    }

    toggleLocationTracking() {
        if (this._isTracking) {
            this.locationService.stopWatchingLocation();
            this._isTracking = false;
        } else {
            this.locationService.startWatchingLocation((location) => {
                this.updateLocationInfo(location);
            });
            this._isTracking = true;
        }
        this.notifyPropertyChange('isTracking', this._isTracking);
    }

    private updateLocationInfo(location: Location) {
        this.locationStatus = `位置已更新: ${formatCoordinates(location.latitude, location.longitude)}
更新时间: ${formatTimestamp(location.timestamp)}`;
        
        if (this.lastLocation) {
            const distance = this.calculateDistance(
                this.lastLocation.latitude,
                this.lastLocation.longitude,
                location.latitude,
                location.longitude
            );
            this.distanceStatus = `距离上次位置: ${formatDistance(distance)}`;
        }
        
        this.lastLocation = location;
        this._mapViewModel.latitude = location.latitude;
        this._mapViewModel.longitude = location.longitude;
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // 地球半径（米）
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    get locationStatus(): string {
        return this._locationStatus;
    }

    set locationStatus(value: string) {
        if (this._locationStatus !== value) {
            this._locationStatus = value;
            this.notifyPropertyChange('locationStatus', value);
        }
    }

    get buildStatus(): string {
        return this._buildStatus;
    }

    set buildStatus(value: string) {
        if (this._buildStatus !== value) {
            this._buildStatus = value;
            this.notifyPropertyChange('buildStatus', value);
        }
    }

    get distanceStatus(): string {
        return this._distanceStatus;
    }

    set distanceStatus(value: string) {
        if (this._distanceStatus !== value) {
            this._distanceStatus = value;
            this.notifyPropertyChange('distanceStatus', value);
        }
    }

    get mapViewModel(): MapViewModel {
        return this._mapViewModel;
    }

    get isTracking(): boolean {
        return this._isTracking;
    }
}