import GoogleMap from "./GoogleMap";
import config from "../../utils/config";
import mapStyle from "./mapStyle.json"
import "../../assets/styles/googlemap.css";

import { useLoadScript } from "@react-google-maps/api";


const GoogleMapApi = (props) => {

  // ------------------------------------------------------------ //
  // Props
  // ------------------------------------------------------------ //
  const {
    centerLat,
    centerLng,
    mapZoom,
    showTrafficLayer,

    // ReportModal
    isMarkLocation,
    onMarkLocation,
    onLocationSelect,

    // PlannerModal
    selectedItinerary,
    originMarker,
    destinationMarker,
    onPinOrigin,
    isPinOrigin,
    onOriginLocationSelect,
    onPinDestination,
    isPinDestination,
    onDestinationLocationSelect
  } = props


  // ------------------------------------------------------------ //
  // useLoadScript for map loading
  // ------------------------------------------------------------ //
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: config.libraries,
  });
  if (!isLoaded) return <div>Loading...</div>;


  // ------------------------------------------------------------ //
  // Map Options
  // ------------------------------------------------------------ //
  const mapOptions = {
    zoom: mapZoom, 
    minZoom: 14,
    maxZoom: 17,
    center: { lat: centerLat, lng: centerLng }, 
    disableDefaultUI: true, 
    restriction: {  
      latLngBounds: {
        north: 14.738183748703542,
        south: 14.58923182582537,
        west: 120.98522186279297,
        east: 121.11127512082325
      }
    },
    styles: mapStyle,
    clickableIcons: false
  };

  
  return (
    <GoogleMap 
      mapOptions={mapOptions} 
      isMarkLocation={isMarkLocation}
      onMarkLocation={onMarkLocation}
      onLocationSelect={onLocationSelect}

      selectedItinerary={selectedItinerary}
      originMarker={originMarker}
      destinationMarker={destinationMarker}

      onPinOrigin={onPinOrigin}
      isPinOrigin={isPinOrigin}
      onOriginLocationSelect={onOriginLocationSelect}

      onPinDestination={onPinDestination}
      isPinDestination={isPinDestination}
      onDestinationLocationSelect={onDestinationLocationSelect}

      showTrafficLayer={showTrafficLayer}
    />
  )
};

export default GoogleMapApi;
