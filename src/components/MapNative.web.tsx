import { useMemo } from 'react';
import { View } from 'react-native';

export default function MapNative({ region }: any) {
    const src = useMemo(() => {
        if (!region) return '';

        const { latitude, longitude } = region;
        const offset = 0.01;
        const left = longitude - offset;
        const right = longitude + offset;
        const top = latitude + offset;
        const bottom = latitude - offset;

        return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
    }, [region]);

    return (
        <View style={{ flex: 1 }}>
            <iframe
                src={src}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 0,
                }}
                loading="lazy"
            />
        </View>
    );
}
