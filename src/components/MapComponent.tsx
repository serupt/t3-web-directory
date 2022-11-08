import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";
import mapStyles from "../styles/mapStyles";
import { MapProps } from "./DisplayMap";

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
    if (
      category.toLocaleLowerCase().includes("food") ||
      category.toLocaleLowerCase().includes("drink")
    ) {
      return {
        url: "/food.svg",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      };
    } else if (category.toLocaleLowerCase().includes("store")) {
      return {
        url: "/store.svg",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      };
    } else if (category.toLocaleLowerCase().includes("office")) {
      return {
        url: "/building.svg",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      };
    } else {
      return {
        url: "/default.svg",
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(15, 15),
      };
    }
  }

  return (
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
                key={entry.id}
                position={{
                  lat: entry.latitude,
                  lng: entry.longitude,
                }}
                onClick={() => {
                  setSelectedEntry(entry);
                }}
                icon={markerIcon(entry.category)}
              />
            ))
        : entryData.map((entry) => (
            <MarkerF
              key={entry.id}
              position={{
                lat: entry.latitude,
                lng: entry.longitude,
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
            lat: selectedEntry.latitude,
            lng: selectedEntry.longitude,
          }}
          onCloseClick={() => {
            setSelectedEntry(undefined);
          }}
        >
          <div>
            <h1 className="text-lg font-bold text-black">
              {selectedEntry.name}
            </h1>
          </div>
        </InfoWindowF>
      ) : null}
    </GoogleMap>
  );
}
