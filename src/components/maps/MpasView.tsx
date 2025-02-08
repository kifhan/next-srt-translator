"use client";

import React, { useRef, useState } from 'react'
import {
    GoogleMap, Marker, StandaloneSearchBox, InfoWindow
} from '@react-google-maps/api'
import Anchor from './Anchor';
import { MarkerData } from '@/types';
import { markerIcons } from '@/assets/markerIcon';

interface Props {
    markers: Array<MarkerData>;
    width?: string;
    height?: string;
    mapCenter: { lat: number, lng: number },
    anchoring?: { marker: MarkerData, lat: number, lng: number, zoom: number };
    playTime: number;
    userId: string;
    isUserOwner: boolean;
    videoId: string;
    onMarkerPlayClick?: (marker: MarkerData) => void;
    onPostNewMarker: (marker: MarkerData) => void;
    onEditMarker: (marker: MarkerData) => void;
    onEditVideoItem: (data: any) => void;
    onRemoveVideoItem: () => void;
    onRemoveMarker: (marker: MarkerData) => void;
}

export default function MpasView({
    markers,
    width="100%",
    height="100%",
    mapCenter,
    anchoring,
    playTime,
    userId,
    isUserOwner,
    videoId,
    onMarkerPlayClick,
    onPostNewMarker,
    onEditMarker,
    onEditVideoItem,
    onRemoveVideoItem,
    onRemoveMarker
}: Props) {
    const [anchor, setAnchor] = useState({ ...mapCenter, zoom: 11 })
    // const { lat, lng, zoom } = anchoring || {lat:0, lng:0, zoom:0}
    const [infomarker, setinfomarker] = useState<MarkerData>({ location: {
        lat: 0,
        lng: 0
    }, title: "", type: "info", seekto: "00:00" })
    const searchBox = useRef<any>(null)
    const googlemap = useRef<any>(null)
    const infoWindow = useRef<any>({})
    const [currentMapCenter, setCurrentMapCenter] = useState({ lat: 0, lng: 0 })
    const [markerPostButtonHover, setMarkerPostButtonHover] = useState<Boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <GoogleMap
            onLoad={(ref: any) => { googlemap.current = ref }}
            // ref={googlemap} // not working
            mapContainerStyle={{...styles.container, width: width, height: height}}
            center={mapCenter}
            // center={{lat: 0, lng: 0}}
            zoom={12}
            onCenterChanged={() => {
                if (googlemap.current) {
                    // console.log("map center: " + googlemap.current.center.lat() + ", " + googlemap.current.center.lng())
                    setCurrentMapCenter({ lat: googlemap.current.center.lat(), lng: googlemap.current.center.lng() })
                }
            }}
        >
            { /* Child components, such as markers, info windows, etc. */
                markers.map((marker, i) => (
                    <Marker
                        key={`${videoId}.${i}.${marker.seekto}`}
                        title={marker.title}
                        icon={markerIcons[marker.type].icon}
                        options={{ map: googlemap.current }}
                        onClick={() => {
                            if (googlemap.current && infoWindow.current) {
                                // console.log("marker clicked: " + marker.title)
                                setinfomarker(marker)
                                infoWindow.current.open(googlemap.current)
                            }
                        }}
                        position={marker.location} />
                ))}
            <Anchor {...anchor} />
            <InfoWindow
                onLoad={ref => {
                    infoWindow.current = ref;
                    if (!infomarker.title) infoWindow.current.close()
                }}
                position={infomarker.location}
            >
                <div style={{
                    width: 260,
                    // backgroundColor: 'white', opacity: 1, padding: 8, borderRadius: 8, border: "1px solid #a2a2a2",
                    display: "flex", flexDirection: "column", justifyContent: "flex-start"
                }}>
                    <div className={`infomarker ${infomarker.id} ${infomarker.uid}`} style={{ fontSize: 16, color: `#08233B`, fontWeight: "bold", marginBottom: 8 }}>
                        {infomarker.title}
                    </div>
                    {/* {(userId && userId === infomarker.uid) && <div style={{ position: "absolute", right: 10, paddingTop: 2 }}>
                        <MarkerEditModal
                            marker={infomarker}
                            icons={Object.keys(markerIcons) as MarkerIconType[]}
                            onSubmit={(marker, title, description, type, imgurl) => {
                                onEditMarker({
                                    id: marker.id,
                                    uid: marker.uid,
                                    position: marker.position,
                                    seekto: marker.seekto,
                                    type: type,
                                    title,
                                    description,
                                    imgurl
                                })
                            }} onRemove={onRemoveMarker} />
                    </div>} */}
                    <div style={{
                        fontSize: 16, color: `#08233B`,
                        display: "flex", flexDirection: "row", justifyContent: "flex-start"
                    }}>
                        {/* <div style={{}}>
                                            <img width="32px" src="https://yt3.ggpht.com/ytc/AKedOLRL6Bdx5Md5D2PRXnHCS8e8qekWx8r2UmPLRTUV=s88-c-k-c0x00ffffff-no-rj" alt="happysaea said" />
                                        </div> */}
                        <div style={{ paddingLeft: 12, paddingTop: 6 }}>
                            {infomarker.imgurl && <img width="220px" src={infomarker.imgurl} alt="marker content" />}
                            <span>{infomarker.description || "_"}</span>
                        </div>
                        {/* <div style={{ position: "absolute", right: 14, paddingTop: 8 }}>
                            {infomarker.type === "info" && <FontAwesomeIcon onClick={() => { if (onMarkerPlayClick) onMarkerPlayClick(infomarker) }} icon={faPlay} size="1x" color="#d34836" style={{ width: "16px", height: "16px", cursor: "pointer" }} />}
                        </div> */}
                    </div>
                </div>
            </InfoWindow>
            <StandaloneSearchBox
                onLoad={ref => { searchBox.current = ref }}
                onPlacesChanged={() => {
                    const outer: any = searchBox.current;
                    const places = outer.getPlaces();
                    // console.log(outer.getPlaces());
                    if (places.length) googlemap.current.panTo({
                        lat: places[0].geometry.location.lat(),
                        lng: places[0].geometry.location.lng()
                    })
                }}
            >
                <input
                    type="text"
                    placeholder="Search a place for set the center of map."
                    style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `280px`,
                        height: `50px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `14px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-140px",
                        marginTop: "10px",
                    }}
                />
            </StandaloneSearchBox>
        </GoogleMap>
    )
}


const styles = {
    container: { height: '100%', width: '100%' },
    speechBubble: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: '8px',
    },
    speechBubblePointer: {
        position: 'absolute',
        width: 0,
        height: 0,
        border: '26px solid transparent',
        borderLeftColor: '#fff',
        borderRight: 0,
        top: '50%',
        right: '0',
        marginTop: '-26px',
        marginRight: '-26px',
    },
};

