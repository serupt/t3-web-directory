import React, { useMemo } from "react";
import mapStyles from "../styles/mapStyles";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { trpc } from "../utils/trpc";

const containerStyle = {
  height: "100vh",
  width: "100%",
};

export default function MapComponent() {
  const getEntry = trpc.useQuery(["entries.get-all-entries"]);

  const center = useMemo(() => ({ lat: 40.716596, lng: -73.99712 }), []);
  const options = useMemo(
    () => ({
      styles: mapStyles,
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  return (
    <div className="container">
      <div className="map">
        <GoogleMap
          zoom={15}
          center={center}
          mapContainerStyle={containerStyle}
          options={options}
        >
          {getEntry.isFetched
            ? getEntry.data?.map((entry) => (
                <MarkerF
                  key={entry.places_id}
                  position={{
                    lat: parseFloat(entry.coords_lat),
                    lng: parseFloat(entry.coords_lng),
                  }}
                />
              ))
            : null}
        </GoogleMap>
      </div>
    </div>
  );
}
