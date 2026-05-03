import MapView, { Marker } from 'react-native-maps';

export default function MapNative({ region, setRegion, updateAddress }: any) {
    return (
        <MapView
            style={{ flex: 1 }}
            region={region}
            onRegionChangeComplete={(r) => {
                setRegion(r);
                updateAddress(r);
            }}
        >
            <Marker
                coordinate={region}
                draggable
                onDragEnd={(e) => {
                    const coords = e.nativeEvent.coordinate;
                    setRegion({ ...region, ...coords });
                    updateAddress(coords);
                }}
            />
        </MapView>
    );
}