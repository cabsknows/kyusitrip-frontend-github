import Route from './Route'


const RouteList = (props) => {

  // Props
  const {
    routes,
    onItinerarySelect,
    selectPlannerCenter,
    selectRouteDetailCenter,
    origin,
    destination
  } = props


  // ------------------------------------------------------------ //
  // Duration Bar
  // ------------------------------------------------------------ //
  let routesDuration = []

  for (let i = 0; i < routes.itineraries.length; i++) {
    routesDuration.push(routes.itineraries[i].duration)
  }
 

  return (
    <div style={{padding: 10}}>
      {routes ? (
        <ul>
          {routes.itineraries.map((itinerary, index) => (
            <div key={index}>
              <Route 
                itinerary={itinerary} 
                routesDuration={routesDuration} 
                index={index}
                onItinerarySelect={onItinerarySelect}
                selectPlannerCenter={selectPlannerCenter}
                selectRouteDetailCenter={selectRouteDetailCenter}
                origin={origin}
                destination={destination}
              />
            </div>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
  )
}

export default RouteList
