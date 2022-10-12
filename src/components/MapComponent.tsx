import React, { useCallback, useMemo, useRef } from "react";
import mapStyles from "../styles/mapStyles";
import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { MapProps } from "./DisplayMap";
import { Text } from "@mantine/core";

const containerStyle = {
  height: "100vh",
  width: "100%",
};

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export default function MapComponent({
  entryData,
  selectedEntry,
  setSelectedEntry,
  selectedTag,
}: MapProps) {
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 40.716596, lng: -73.99712 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      styles: mapStyles,
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  function markerIcon(category: string) {
    if (category === "Food & Drinks") {
      return {
        url: "/food.svg",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      };
    } else {
      return {
        url: "/building.svg",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      };
    }
  }

  return (
    <div className="container">
      <div className="map">
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerStyle={containerStyle}
          options={options}
        >
          {selectedTag !== ""
            ? entryData
                .filter((e) => e.tags.includes(selectedTag))
                .map((entry) => (
                  <MarkerF
                    key={entry.places_id}
                    position={{
                      lat: parseFloat(entry.coords_lat),
                      lng: parseFloat(entry.coords_lng),
                    }}
                    onClick={() => {
                      setSelectedEntry(entry);
                    }}
                    icon={markerIcon(entry.category)}
                  />
                ))
            : entryData.map((entry) => (
                <MarkerF
                  key={entry.places_id}
                  position={{
                    lat: parseFloat(entry.coords_lat),
                    lng: parseFloat(entry.coords_lng),
                  }}
                  onClick={() => {
                    setSelectedEntry(entry);
                  }}
                  icon={markerIcon(entry.category)}
                />
              ))}
          {selectedEntry ? (
            <InfoWindowF
              position={{
                lat: parseFloat(selectedEntry.coords_lat),
                lng: parseFloat(selectedEntry.coords_lng),
              }}
              onCloseClick={() => {
                setSelectedEntry(undefined);
              }}
            >
              <div>
                <Text color={"dark"} size={"lg"} weight={"bold"}>
                  {selectedEntry.name}
                </Text>
              </div>
            </InfoWindowF>
          ) : null}
        </GoogleMap>
      </div>
    </div>
  );
}
