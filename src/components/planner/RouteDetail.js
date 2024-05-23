import '../../assets/styles/routelist.css'


const RouteDetail = ({ leg, selectRouteDetailCenter }) => {

  // ------------------------------------------------------------ //
  // Color coding of the mode of transportation
  // ------------------------------------------------------------ //
  const modeContainer = () => {
    let color = 'black'
    if(leg.mode === 'WALK') {
      color = '#FF7F7F'
    } else if (leg.mode === 'BUS') {
      if(leg.route.gtfsId.includes("PUJ")) {
        color = "#397822"
      } else {
        color = "#45B6FE"
      }   
    } else if (leg.mode === 'RAIL') {
      color = '#FFA756'
    }
    return color;
  }


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

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    // Formatting with leading zeros for minutes
    const formattedMinutes = ('0' + minutes).substr(-2);

    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  }


  // ------------------------------------------------------------ //
  // Distance Formatter
  // ------------------------------------------------------------ //
  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`
    } else if (distance > 1000) {
      return `${(distance/1000).toFixed(2)} km`
    }
  }

  
  return (
    <div onClick={() => selectRouteDetailCenter({lat: leg.from.lat, lng: leg.from.lon, zoom: 18})}>
      <div className="route-detail-leg">
        <div className='route-detail-top'>
          <div>
            <p style={{
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: modeContainer(), 
              width: 60,
              height: 25,
              color: 'white',
              fontWeight: 'bold',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5
            }}>
              {(leg.mode === "BUS" && leg.route && leg.route.gtfsId && leg.route.gtfsId.includes("PUJ")) ? "JEEP" : leg.mode}
            </p>
          </div>
          <div>
            <p style={{
              fontWeight: 'bold'
            }}>
              {formatDuration(leg.duration)}
            </p>
          </div>
        </div>
        <div className="distance-bar-div">
          <div className="distance-bar">
            <div className="distance-marker">
            
            </div>
            <div className="distance-marker">

            </div>
          </div>
        </div>
        <div className='distance-time'>
          <p>{formatTime(leg.startTime)}</p>
          <p style={{fontSize: 12}}>{formatDistance(leg.distance)}</p>
          <p>{formatTime(leg.endTime)}</p>
        </div>
        <div className='origin-and-destination'>

          <div className='origin-and-destination-from'>
            <div>
              <p className='origin-and-destination-subtitle'>FROM: </p>
            </div>
            <div>
              <p className='origin-and-destination-name'>{leg.from.name}</p>
            </div>
          </div>

          <div className='dot-dot-dot'>
            <div className='dot'></div>
            <div className='dot'></div>
          </div>

          <div className='origin-and-destination-from'>
            <div>
              <p className='origin-and-destination-subtitle'>TO: </p>
            </div>
            <div>
              <p className='origin-and-destination-name'>{leg.to.name}</p>
            </div>
          </div>

          {leg.mode !== "WALK" ? (
            <div className='dot-dot-dot'>
              <div className='dot'></div>
              <div className='dot'></div>
            </div>
          ) : (
            <></>
          )}
  
            {leg.mode !== "WALK" ? (
              <div className='route-detail-route'>
                <div>
                  <p className='route-detail-route-subtitle'>ROUTE:</p>
                </div>
                <div>
                  <p className='route-detail-route-name'>{leg.route.longName}</p>
                </div>
              </div>
            ) : (
              <></>
            )}


        </div>
      </div>
  </div>
  )
}

export default RouteDetail