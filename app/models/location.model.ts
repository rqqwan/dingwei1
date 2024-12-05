export interface Location {
    latitude: number;
    longitude: number;
    timestamp: Date;
}

export interface MapMarker {
    position: {
        lat: number;
        lng: number;
    };
    title: string;
    snippet: string;
    draggable: boolean;
}