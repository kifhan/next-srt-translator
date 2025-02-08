import { useGoogleMap } from "@react-google-maps/api";
import { useEffect } from "react";

interface AnchorProps {
    text?: string;
    lat?: number;
    lng?: number;
    zoom?: number;
}
export default function Anchor({ lat, lng, zoom }: AnchorProps) {
    const googleMap = useGoogleMap()
    useEffect(() => {
        setTimeout(() => {
            if (googleMap) {
                if (lat && lng) googleMap.panTo({ lat, lng })
                if (zoom) googleMap.setZoom(zoom)
            }
        }, 100);
    }, [googleMap, lat, lng, zoom])
    return (<></>)
};