/*global google*/
import "../../assets/styles/googlemap.css"
import reportService from '../../services/reportService'
import busIcon from '../../assets/img/map-bus.png'
import originIcon from '../../assets/img/map-origin.png'
import destinationIcon from '../../assets/img/map-destination.png'
import walkIcon from '../../assets/img/map-walk.png'
import railIcon from '../../assets/img/map-rail.png'
import jeepIcon from '../../assets/img/map-jeep.png'
import trafficIcon from '../../assets/img/traffic-jam-icon.svg'
import accidentIcon from '../../assets/img/accident-icon.svg'
import repairIcon from '../../assets/img/road-repair-icon.svg'
import floodIcon from '../../assets/img/flood-icon.svg'
import closureIcon from '../../assets/img/closure-icon.svg'
import addressInfo from '../../assets/img/info-address.png'
import descriptionInfo from '../../assets/img/info-description.png'
import timeInfo from '../../assets/img/info-time.png'
import userInfo from '../../assets/img/info-user.png'

import { useState, useEffect } from 'react'
import { GoogleMap, Marker, Polyline, InfoWindow, TrafficLayer } from "@react-google-maps/api"
import decodePolyline from 'decode-google-map-polyline'
import { geocode, RequestType } from 'react-geocode'
import io from "socket.io-client"

const Map = (props) => {

  // Declarations
  const socket = io.connect("http://localhost:3001")

  // ------------------------------------------------------------ //
  // Props
  // ------------------------------------------------------------ //
  const {
    mapOptions,
    showTrafficLayer,

    isMarkLocation,
    onMarkLocation,
    onLocationSelect,

    // PlannerModal
    selectedItinerary,
    originMarker,
    destinationMarker,
    isPinOrigin,
    onPinOrigin,
    onOriginLocationSelect,
    onPinDestination,
    isPinDestination,
    onDestinationLocationSelect
  } = props
  

  // ------------------------------------------------------------ //
  // Icons in Map based on mode of transpo
  // ------------------------------------------------------------ //
  const modeIcons = (leg) => {
    if (leg.mode === "WALK") {
      return `${walkIcon}`
    } else if (leg.mode === "RAIL") {
      return `${railIcon}`
    } else if (leg.mode === "BUS") {
      if (leg.route.gtfsId.includes("PUJ")) {
        return `${jeepIcon}`
      } else {
        return `${busIcon}`
      }
    }
  };


  // ------------------------------------------------------------ //
  // ISO 8601 date string converter
  // ------------------------------------------------------------ //
  const isoDateConverter = (iso) => {
    const now = new Date()
    const createdAt = new Date(iso)
    const diffInMilliseconds = now - createdAt
    const diffInMinutes = Math.round(diffInMilliseconds / (60 * 1000))
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes === 1) {
      return '1 minute ago';
    } else if (diffInMinutes <= 60){
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes > 60 && diffInMinutes < 120) {
      return '1 hour ago'
    } else {
      return `${Math.round(diffInMinutes/60)} hours ago`
    }
  }


  // ------------------------------------------------------------ //
  // Get all the reports from the database
  // ------------------------------------------------------------ //
  const [reports, setReports] = useState(null)

  useEffect(() => {
    reportService
    .getAll()
    .then((response) => {
      console.log(response.data)
      // const reportCoordinates = response.data.map((report) => report.latLng);
      setReports(response.data)
    })
    .catch ((error) => {
      console.log(error)
    })
  }, []);

  useEffect(() => {
    socket.on("receive_message", () => {
      reportService
      .getAll()
      .then((response) => {
        console.log(response.data)
        // const reportCoordinates = response.data.map((report) => report.latLng);
        setReports(response.data)
      })
      .catch ((error) => {
        console.log(error)
      })
    })
  }, [socket])


  // ------------------------------------------------------------ //
  // Planner Modal - Render the markers of the legs of the chosen itinerary
  // ------------------------------------------------------------ //
  const renderLegStartMarkers = () => {
    if (selectedItinerary && selectedItinerary.legs) {
      return selectedItinerary.legs.map((leg, index) => (
        <Marker
          key={index}
          position={{ lat: leg.from.lat, lng: leg.from.lon }}
          icon={{
            url: modeIcons(leg),
            scaledSize: new google.maps.Size(35, 35)
          }}
        />
      ));
    }
    return null;
  };


  // ------------------------------------------------------------ //
  // Planner Modal - Render the polylines of the chosen itinerary
  // ------------------------------------------------------------ //
  const renderPolylines = () => {
    if (selectedItinerary && selectedItinerary.legs) {
      return selectedItinerary.legs.map((leg, index) => {
        const path = decodePolyline(leg.legGeometry.points); 
        let color = "black"

        if(leg.mode === "WALK"){
          color = "#FF7F7F"
        } else if (leg.mode === "BUS") {
          if(leg.route.gtfsId.includes("PUJ")) {
            color = "#397822"
          } else {
            color = "#45B6FE"
          }    
        } else if (leg.mode === "RAIL") {
          color = "#FFA756"
        }
        return <Polyline 
          key={index} 
          path={path} 
          options={{
            strokeColor: color,
            strokeWeight: 7,
            strokeOpacity: 0.95
          }} 
        />;
      });
    }
    return null;
  };


  // ------------------------------------------------------------ //
  // Planner Modal - Render the itinerary's destination marker
  // ------------------------------------------------------------ //
  const renderDestinationMarker = () => {
    if (selectedItinerary && selectedItinerary.legs.length > 0) {
      const lastLeg = selectedItinerary.legs[selectedItinerary.legs.length - 1];
      return (
        <Marker
          position={{ lat: lastLeg.to.lat, lng: lastLeg.to.lon }}
          icon={{
            url: `${destinationIcon}`,
            scaledSize: new google.maps.Size(35, 45)
          }}
        />
      );
    }
    return null;
  };


  // ------------------------------------------------------------ //
  // Planner Modal - Render the marker of origin
  // ------------------------------------------------------------ //
  const renderStartMarker = () => {
    if (originMarker) {
      return (
        <Marker
          position={{ lat: originMarker.lat, lng: originMarker.lng }}
          icon={{
            url: `${originIcon}`,
            scaledSize: new google.maps.Size(35, 45)
          }}
        />
      );
    }
    return null;
  };


  // ------------------------------------------------------------ //
  // Planner Modal - Render the marker of destination
  // ------------------------------------------------------------ //
  const renderEndMarker = () => {
    if (destinationMarker) {
      return (
        <Marker
          position={{ lat: destinationMarker.lat, lng: destinationMarker.lng }}
          icon={{
            url: `${destinationIcon}`,
            scaledSize: new google.maps.Size(35, 45)
          }}
        />
      );
    }
    return null;
  };


  // ------------------------------------------------------------ //
  // Report Modal - Render all the reports on the map
  // ------------------------------------------------------------ //
  const [selectedReport, setSelectedReport] = useState(null);

  const renderReports = () => {
    const handleMarkerClick = (report) => {
      setSelectedReport(report);
    };
    const handleInfoWindowClose = () => {
      setSelectedReport(null);
    };

    if (reports) {
      return reports.map((report, index) => {
        let marker = closureIcon

        if(report.category.label === 'Accident'){
          marker = accidentIcon
        } else if (report.category.label === 'Traffic') {
          marker = trafficIcon
        } else if (report.category.label === 'Hazard') {
          marker = repairIcon
        } else if (report.category.label === 'Flood') {
          marker = floodIcon
        } else if (report.category.label === 'Closure') {
          marker = closureIcon
        }

        return (
          <Marker
            key={index}
            position={report.latLng}
            icon={{
              url: marker,
              scaledSize: new google.maps.Size(45, 45)
            }}
            onClick={() => handleMarkerClick(report)}
          >
            {selectedReport === report && (
              <div>
                <InfoWindow
                  position={report.latLng}
                  onCloseClick={handleInfoWindowClose}
                >
                  {/* -----------------------Content of the InfoWindow------------------------- */}
                  <div className="infowindow"> 
                    <h2 style={{color: '#000'}}>{report.category.label}</h2>
                    <hr/>
                    <div className="infowindow-div infowindow-div-align">
                      <img className="infowindow-icon" src={timeInfo} alt="time"/>
                      <p>{isoDateConverter(report.createdAt)}</p>
                    </div>
                    <div className="infowindow-div infowindow-div-align">
                      <img className="infowindow-icon" src={descriptionInfo} alt="description"/>
                      <p>{report.description}</p>
                    </div>
                    <div className="infowindow-div">
                      <img className="infowindow-icon" src={addressInfo} alt="address"/>
                      <p>{report.address}</p>
                    </div>
                    <div className="infowindow-div infowindow-div-align">
                      <img className="infowindow-icon" src={userInfo} alt="user"/>
                      <p>{report.user.name}</p>
                    </div>
                  </div>
                </InfoWindow>
              </div>
            )}
          </Marker>
        )
      });
    }
    return null;
  };


  // ------------------------------------------------------------ //
  // Report Modal - Callback function when marking a location on map
  // ------------------------------------------------------------ //
  const mapClickHandler = async (event) => {
    console.log("test")
    if (isMarkLocation) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const address = await geocode(
        RequestType.LATLNG,
        `${lat},${lng}`,
        { language: "en", region: "es", key: process.env.REACT_APP_API_KEY }
      )
      
      onLocationSelect({ lat, lng, address });
      onMarkLocation(false)
    }

    else if (isPinOrigin){
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const address = await geocode(
        RequestType.LATLNG,
        `${lat},${lng}`,
        { language: "en", region: "es", key: process.env.REACT_APP_API_KEY }
      )
      
      onOriginLocationSelect({ lat, lng, address });
      onPinOrigin(false)
    }

    else if (isPinDestination){
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const address = await geocode(
        RequestType.LATLNG,
        `${lat},${lng}`,
        { language: "en", region: "es", key: process.env.REACT_APP_API_KEY }
      )
      
      onDestinationLocationSelect({ lat, lng, address });
      onPinDestination(false)
    }
  };
  


  return (
    <GoogleMap 
      options={mapOptions}
      mapContainerClassName="map-container"
      onClick={mapClickHandler}
    >
      {showTrafficLayer && <TrafficLayer />}
      {renderReports()}

      {renderStartMarker()}
      {renderEndMarker()}

      {renderDestinationMarker()}
      {renderLegStartMarkers()}
      {renderPolylines()}
    
    </GoogleMap>
  )
}

export default Map