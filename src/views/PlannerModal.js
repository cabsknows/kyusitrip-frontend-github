import { useState, useRef, useEffect } from "react"
import { Autocomplete, useLoadScript } from "@react-google-maps/api"
import Keyboard from "react-simple-keyboard"
import 'react-simple-keyboard/build/css/index.css';
import { library } from "@fortawesome/fontawesome-svg-core"
import * as Icons from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer'

import ModalHeader from "../components/ModalHeader.js"
import routeIcon from "../assets/img/route-modal-map-icon.png"
import loadingPng from "../assets/img/loading.png"
import routePlaceholder from "../assets/img/placeholder.png"
import routeService from "../services/routeService.js"
import RouteList from '../components/planner/RouteList.js'
import config from "../utils/config.js"
import mapPin from "../assets/img/map-pin-fill.svg"
import "../assets/styles/modals.css"
import "../assets/styles/routelist.css"


const RouteModal = (props) => {

  // ------------------------------------------------------------ //
  // Idle Timer
  // ------------------------------------------------------------ //
  const navigate = useNavigate();

  const onIdle = () => {
    navigate('/kyusitrip-frontend-github')
  }
  useIdleTimer({
    onIdle,
    timeout: 180_000
  })

  
  // Props
  const {
    onItinerarySelect,
    selectPlannerCenter,
    selectOriginMarker,
    selectDestinationMarker,
    selectRouteDetailCenter,

    onPinOrigin,
    originPinData,
    isPinOrigin,
    onPinDestination,
    destinationPinData,
    isPinDestination
  } = props


  // ------------------------------------------------------------ //
  // States
  // ------------------------------------------------------------ //
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [routes, setRoutes] = useState(null)
  const [error, setError] = useState("")
  const originInputRef = useRef(null)
  const destinationInputRef = useRef(null)
  const [originCoordinates, setOriginCoordinates] = useState({})
  const [destinationCoordinates, setDestinationCoordinates] = useState({})
  const [showOriginKeyboard, setShowOriginKeyboard] = useState(false)
  const [showDestinationKeyboard, setShowDestinationKeyboard] = useState(false)
  // ************************************************************ //



  // Reset button function
  const handleReset = () => {
    setRoutes(null)
    onItinerarySelect(null)
    originInputRef.current.value = null
    destinationInputRef.current.value = null
    selectOriginMarker(null)
    selectDestinationMarker(null)
    setShowOriginKeyboard(false)
    setShowDestinationKeyboard(false)
  }

  const handleResetClick = () => {
    setRoutes(null)
    onItinerarySelect(null)
    selectOriginMarker(null)
    selectDestinationMarker(null)
  }



  // ------------------------------------------------------------ //
  // Set Origin and Destination from pinned location
  // ------------------------------------------------------------ //
  useEffect(() => {
    if (originPinData) {
      console.log(originPinData)
      originInputRef.current.value = originPinData.address.results[0].formatted_address
      setOriginCoordinates({lat: originPinData.lat, lng: originPinData.lng})
    }
  }, [originPinData])
  useEffect(() => {
    if (destinationPinData) {
      console.log(destinationPinData)
      destinationInputRef.current.value = destinationPinData.address.results[0].formatted_address
      setDestinationCoordinates({lat: destinationPinData.lat, lng: destinationPinData.lng})
    }
  }, [destinationPinData])
  // ************************************************************ //



  // ------------------------------------------------------------ //
  // Make it possible for users to pin on map
  // ------------------------------------------------------------ //
  const handlePinOrigin = () => {
    setError('')
    onPinOrigin(true)
    onPinDestination(false)
    setShowOriginKeyboard(false)
    setShowDestinationKeyboard(false)
  }
  const handlePinDestination = () => {
    setError('')
    onPinOrigin(false)
    onPinDestination(true)
    setShowOriginKeyboard(false)
    setShowDestinationKeyboard(false)
  }
  // ************************************************************ //



  // ------------------------------------------------------------ //
  // Find Routes button function
  // ------------------------------------------------------------ //
  const getRoutes = () => {
    setLoading(true)
    setRoutes(null)
    onItinerarySelect(null)
    setShowOriginKeyboard(false)
    setShowDestinationKeyboard(false)

    if (originInputRef.current.value === '' || destinationInputRef.current.value === '') {
      setRoutes(null)
      setError("Wrong input")
      return;
    }
    
    const data = {
      origin: {
        lat: originCoordinates.lat,
        lng: originCoordinates.lng
      },
      destination: {
        lat: destinationCoordinates.lat,
        lng: destinationCoordinates.lng
      }
    };

    routeService
      .create(data)
      .then((response) => {
        console.log(response.data.otpResponse.plan)

        let filteredItineraries = response.data.otpResponse.plan.itineraries

        if (filteredItineraries.length > 1) {
          filteredItineraries = filteredItineraries.filter((itinerary) => {
            return !(itinerary.legs.length === 1 && itinerary.legs[0].mode === "WALK")
          })
        }

        
        setLoading(false)
        setRoutes(filteredItineraries)
        setError("")
        onItinerarySelect(filteredItineraries[0])
        selectPlannerCenter({
          lat: filteredItineraries[0].legs[0].from.lat,
          lng: filteredItineraries[0].legs[0].from.lon
        })
        selectOriginMarker(null)
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          setRoutes(null);
          setLoading(false)
          setError(error.response.data.message)
        }
      });
  };
  // ************************************************************ //



  // ------------------------------------------------------------ //
  // React-Simple-Keyboard library functions
  // ------------------------------------------------------------ //
  const keyboard = useRef();

  const onChangeOrigin = input => {
    originInputRef.current.value = input;
    setTimeout(() => {
      const event = new Event('input', { bubbles: true });
      originInputRef.current.dispatchEvent(event);
    }, 0);
  };
  const onKeyPressOrigin = button => {
    if (button === '{enter}') {
      setShowOriginKeyboard(false)
    }
    if (showOriginKeyboard) { originInputRef.current.focus(); }
  };

  const onChangeDestination = input => {
    destinationInputRef.current.value = input;
    setTimeout(() => {
      const event = new Event('input', { bubbles: true });
      destinationInputRef.current.dispatchEvent(event);
    }, 0);
  };
  const onKeyPressDestination = button => {
    if (button === '{enter}') {
      setShowDestinationKeyboard(false)
    }
    if (showDestinationKeyboard) { destinationInputRef.current.focus(); }
  };
  // ************************************************************ //



  // ------------------------------------------------------------ //
  // Run this function when user selects location from autocomplete places API
  // ------------------------------------------------------------ //
  const onPlaceOriginChanged = (origin) => {
    if (origin !== null) {
      const places = {
        lat: origin.getPlace().geometry.location.lat(),
        lng: origin.getPlace().geometry.location.lng()
      };
      selectOriginMarker(places)
      selectPlannerCenter({lat: places.lat, lng: places.lng})
      setOriginCoordinates({lat: places.lat, lng: places.lng})
    }
    setError("");
    destinationInputRef.current.focus()
    setShowOriginKeyboard(false)
    setShowDestinationKeyboard(true)

  };
  const onPlaceDestinationChanged = (destination) => {
    if (destination !== null) {
      const places = {
        lat: destination.getPlace().geometry.location.lat(),
        lng: destination.getPlace().geometry.location.lng()
      };
      selectDestinationMarker(places)
      selectPlannerCenter({lat: places.lat, lng: places.lng})
      setDestinationCoordinates({lat: places.lat, lng: places.lng})
    }
    setError("");
  };
  // ************************************************************ //



  // ------------------------------------------------------------ //
  // Google Maps Places API functions and options
  // ------------------------------------------------------------ //
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: config.libraries,
  });

  const options = {
    componentRestrictions: { 
      country: "ph" ,
    },  
    fields: ["geometry"],
  };

  if (!isLoaded) {
    return <div>Loading...</div>
  }
  // ************************************************************ //



  return (
    <>
      <ModalHeader title="Planner" />

      <div className="route-modal-top">
        <div className="route-modal-top-title">
          <h3 style={{fontSize: "20px"}}>Find your Public Transportation Route within Quezon City</h3>
        </div>

        <div className="route-modal-search">
          <div className="route-modal-top-left">
            <img
              className="route-modal-icon"
              src={routeIcon}
              alt="route-icon"
            />

            <div className="route-modal-search-box">
              <Autocomplete
                onPlaceChanged={() => onPlaceOriginChanged(origin)}
                options={options}
                onLoad={(autocomplete) => setOrigin(autocomplete)}
              >
                <input
                  id="Origin"
                  type="text"
                  placeholder="Origin"
                  className="route-modal-combo-box"
                  onClick={() => {
                    onPinOrigin(false)
                    setShowOriginKeyboard(true)
                    setShowDestinationKeyboard(false)
                    originInputRef.current.select()
                    if (routes) {
                      handleResetClick()
                    }
                  }}
                  // onFocus={() => {
                  //   setShowOriginKeyboard(true)
                  //   setShowDestinationKeyboard(false)
                  // }}
                  ref={originInputRef}
                />
              </Autocomplete>

              {showOriginKeyboard &&
                <div className="virtual-keyboard">
                  <Keyboard 
                    keyboardRef={r => (keyboard.current = r)}
                    layoutName={"default"}
                    layout={{
                      default: [
                        "1 2 3 4 5 6 7 8 9 0 {bksp}",
                        "Q W E R T Y U I O P",
                        "A S D F G H J K L",
                        "Z X C V B N M {enter}",
                        "{space}"
                      ]
                    }}
                    display={{
                      '{bksp}': 'backspace',
                      '{space}': 'space',
                      '{shift}': 'shift',
                      '{enter}': 'close'
                    }}
                    onChange={onChangeOrigin}
                    onKeyPress={onKeyPressOrigin}
                    useMouseEvents={true}
                    maxLength={25}
                    disableButtonHold={true}
                  />
                </div>
              }
              

              <Autocomplete
                onPlaceChanged={() => onPlaceDestinationChanged(destination)}
                options={options}
                onLoad={(autocomplete) => setDestination(autocomplete)}
              >
                <input
                  id="Destination"
                  type="text"
                  placeholder="Destination"
                  className="route-modal-combo-box"
                  onClick={() => {
                    setShowOriginKeyboard(false)
                    setShowDestinationKeyboard(true)
                    onPinDestination(false)
                    destinationInputRef.current.select()
                    if (routes) {
                      handleResetClick()
                    }
                  }}
                  // onFocus={() => {
                  //   setShowOriginKeyboard(false)
                  //   setShowDestinationKeyboard(true)
                  // }}
                  ref={destinationInputRef}
                />
              </Autocomplete>

              {showDestinationKeyboard &&
                <div className="virtual-keyboard">
                  <Keyboard 
                    keyboardRef={r => (keyboard.current = r)}
                    layoutName={"default"}
                    layout={{
                      default: [
                        "1 2 3 4 5 6 7 8 9 0 {bksp}",
                        "Q W E R T Y U I O P",
                        "A S D F G H J K L",
                        "Z X C V B N M {enter}",
                        "{space}"
                      ]
                    }}
                    display={{
                      '{bksp}': 'backspace',
                      '{space}': 'space',
                      '{shift}': 'shift',
                      '{enter}': 'close'
                    }}
                    onChange={onChangeDestination}
                    onKeyPress={onKeyPressDestination}
                    useMouseEvents={true}
                    maxLength={15}
                    disableButtonHold={true}
                  />
                </div>
              }
            </div>


            <div className="route-modal-pin-location">
              <button 
                className="route-modal-pin-location-buttons"
                // onClick={handlePinOrigin}
                onClick={() => {
                  if (!isPinOrigin) {
                    if (routes) {
                      handleResetClick()
                    }
                    handlePinOrigin()
                  } else {
                    onPinOrigin(false)
                    originInputRef.current.select()
                  }
                }}
              >
                {isPinOrigin ? "SEARCH INSTEAD" : "PIN ORIGIN"}
              </button>

              <button 
                className="route-modal-pin-location-buttons"
                // onClick={handlePinDestination}
                onClick={() => {
                  if (!isPinDestination) {
                    if (routes) {
                      handleResetClick()
                    }
                    handlePinDestination()
                  } else {
                    onPinDestination(false)
                    destinationInputRef.current.select()
                  }
                }}
              >
                {isPinDestination ? "SEARCH INSTEAD" : "PIN DEST."}
              </button>
            </div>
          </div>
        </div>

        {isPinOrigin && 
          <div className="pinMessage">
            <p>Click on the map to choose your starting point</p>
            <img src={mapPin} alt='pin' style={{height: "30px"}}/>
          </div>
        }

        {isPinDestination && 
          <div className="pinMessage">
            <p>Click on the map to choose your destination point</p>
            <img src={mapPin} alt='pin' style={{height: "30px"}}/>
          </div>
        }

        {error && <div className="error-msg">{error}</div>}

        <div className="route-modal-button">
          <button className="route-modal-btn" onClick={getRoutes}>
            Find Route
          </button>
        </div>

        <div className="route-modal-bottom">
          {loading ? (
            <div className="route-modal-bottom-nonexist">
              <img
                className="route-modal-bottom-placeholder"
                src={loadingPng}
                alt="loading"
              ></img>
              <p>Calculating your route, just a moment...</p>
            </div>
          ) : (
            <>
              {!routes ? (
                <div className="route-modal-bottom-nonexist">
                  <img
                    className="route-modal-bottom-placeholder"
                    src={routePlaceholder}
                    alt="route"
                  ></img>
                  <p>Please enter both origin and destination.</p>
                </div>
              ) : (
                <div className="route-modal-list">
                  <div>
                    <h4 className="route-modal-suggestedroutes">
                      Suggested Routes
                    </h4>
                    <div className="route-modal-button-reset">
                      <button onClick={handleReset} className="route-modal-btn-reset">CLEAR ALL</button>
                    </div>
                  </div>
                  <div style={{marginLeft: "10px", fontSize: "14px"}}>Note: ETA may vary depending on traffic and PUV's waiting time</div>
                  <div>
                    <RouteList 
                      routes={routes} 
                      origin={originInputRef.current.value}
                      destination={destinationInputRef.current.value}
                      onItinerarySelect={onItinerarySelect}
                      selectPlannerCenter={selectPlannerCenter}
                      selectRouteDetailCenter={selectRouteDetailCenter}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RouteModal;

const iconList = Object.keys(Icons)
  .filter((key) => key !== "fas" && key !== "prefix")
  .map((icon) => Icons[icon]);
library.add(...iconList);