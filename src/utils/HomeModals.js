import PlannerModal from '../views/PlannerModal'


const HomeModals = (props) => {


  return (
    <>
      {props.routePlannerModal 
        ? <PlannerModal 
          onItinerarySelect={props.onItinerarySelect}
          selectPlannerCenter={props.selectPlannerCenter}
          selectOriginMarker={props.selectOriginMarker}
          selectDestinationMarker={props.selectDestinationMarker}
          selectRouteDetailCenter={props.selectRouteDetailCenter}
          onPinOrigin={props.onPinOrigin}
          originPinData={props.originPinData}
          isPinOrigin={props.isPinOrigin}
          onPinDestination={props.onPinDestination}
          destinationPinData={props.destinationPinData}
          isPinDestination={props.isPinDestination}
        /> 
        : <></>
      }
    </>
  )
}

export default HomeModals
