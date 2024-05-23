import { useState } from 'react'
import RouteDetail from './RouteDetail'
import "../../assets/styles/routelist.css"

const Route = (props) => {

  // ------------------------------------------------------------ //
  // Props
  // ------------------------------------------------------------ //
  const {
    itinerary,
    routesDuration,
    onItinerarySelect,
    selectPlannerCenter,
    selectRouteDetailCenter,
  } = props

  // ------------------------------------------------------------ //
  // States
  // ------------------------------------------------------------ //
  const [showDetails, setShowDetails] = useState(null)
  const longestDuration = Math.max(...routesDuration)
  const adjustedWidth = (itinerary.duration/longestDuration * 100) + '%'

  // ------------------------------------------------------------ //
  // Duration Formatter
  // ------------------------------------------------------------ //
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    seconds %= 3600
    const minutes = Math.floor(seconds / 60)
  
    let formattedDuration = ''
  
    if (hours > 0) {
        formattedDuration += `${hours} hr`
        if (hours > 1) formattedDuration += 's'
    }
  
    if (minutes > 0) {
        if (formattedDuration !== '') formattedDuration += ' '
        formattedDuration += `${minutes} min`
        if (minutes > 1) formattedDuration += 's'
    }
    return formattedDuration;
  }

  // ------------------------------------------------------------ //
  // Time Formatter
  // ------------------------------------------------------------ //
  const formatTime = (date) => {
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    const formattedMinutes = ('0' + minutes).substr(-2);
    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  }

  // ------------------------------------------------------------ //
  // One of the Itinerary Click function
  // ------------------------------------------------------------ //
  const handleItineraryClick = () => {
    console.log(itinerary)
    onItinerarySelect(itinerary)
    setShowDetails(!showDetails)
    selectPlannerCenter({lat: itinerary.legs[0].from.lat, lng: itinerary.legs[0].from.lon, zoom: 15})
  }


  // ------------------------------------------------------------ //
  // For Duration Bar
  // ------------------------------------------------------------ //
  const markerPosition = (distance) => {
    let totalDistance = 0;
    for(let i = 0; i < itinerary.legs.length; i++) {
      totalDistance += itinerary.legs[i].distance
    }
    const position = ((distance/totalDistance) * 100) + '%'
    return position;
  }


  // ------------------------------------------------------------ //
  // Color coding of the mode of transportation
  // ------------------------------------------------------------ //
  const legColors = (leg) => {
    let legColor = "black"
    if(leg.mode === "WALK"){
      legColor = "#FF7F7F"
    } else if(leg.mode === "BUS") {
      if(leg.route.gtfsId.includes("PUJ")) {
        legColor = "#397822"
      } else {
        legColor = "#45B6FE"
      }     
    } else if(leg.mode === "RAIL") {
      legColor = "#FFA756"
    }
    return legColor
  }
  
  
  return (
    <>
      {!itinerary ? (
        <></>
      ) : (
        <div>
          <div onClick={handleItineraryClick} className='main-grid'>
            <div style={styles.mainGridHeader}>
              <p style={{fontWeight: 'bold'}}>ETA: {formatDuration(itinerary.duration)}</p>
              <ul style={styles.modeOfTranspo}>
                {itinerary.legs
                  .filter(leg => leg.mode !== "WALK")
                  .map((leg, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 30,
                      width: 60,
                      backgroundColor: legColors(leg),
                      margin: 2,
                      padding: 2,
                      borderRadius: 6,
                      fontWeight: 'bold',
                      color: 'white'}}>
                      {(leg.route.gtfsId.includes("PUJ")) ? "JEEP" : leg.mode}
                    </div>
                  ))
                }
              </ul>
            </div>
            <div className='distance-time' style={{fontSize: 13, marginBottom: 5, marginTop: 5}}>
              <p>{formatTime(itinerary.startTime)}</p>
              <p>{formatTime(itinerary.endTime)}</p>
            </div>
            <div style={styles.grayBar}>
              <div style={{ 
                width: adjustedWidth, 
                height: '100%', 
                backgroundColor: '#880015', 
                borderRadius: 10}}>
                  <ul style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    {itinerary.legs.map((leg, index) => (
                      <div key={index} style={{width: markerPosition(leg.distance), height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <div key={index} style={{width: 10, height: 10, backgroundColor: '#880015', borderRadius: '50%', top: -2, position: 'relative'}}>
                          &nbsp;
                        </div>
                      </div>
                    ))}
                  </ul>
              </div>
            </div>
          </div>
          {showDetails ? (
            <div>
              <ul>
                {itinerary.legs.map((leg, index) => (
                  <RouteDetail 
                    key={index} 
                    leg={leg}
                    selectRouteDetailCenter={selectRouteDetailCenter}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  )
}

export default Route

const styles = {
  mainGrid: {
    display: 'flex',
    backgroundColor: 'lightblue',
    padding: 10,
    marginTop: 5,
    marginBottom: 5,

    height: 120,
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

    borderRadius: 10
  },

  modeOfTranspo: {
    display: 'flex',
    flexDirection: 'row'
  },

  mainGridHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center'
  },

  grayBar: {
    backgroundColor: "gray",

    height: '5%',
    width: '90%',

    borderRadius: 10
  },

  circleMarker: {
    width: 20,
    height: '100%',
    backgroundColor: 'white',

    borderRadius: '50%',

    position: 'relative',
    right: 0
  }
}