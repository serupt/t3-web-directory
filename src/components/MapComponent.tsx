import { useMemo } from "react";
import mapStyles from "../styles/mapStyles";
import { GoogleMap } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default function MapComponent() {
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
          zoom={16}
          center={center}
          mapContainerStyle={containerStyle}
          options={options}
        ></GoogleMap>
      </div>
    </div>
  );
}
