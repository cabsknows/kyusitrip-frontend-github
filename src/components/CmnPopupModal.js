


const CmnPopupModal = ({ message, onClose, textBtn }) => {

  return (
    <div className="common-popup-modal">
      <div className="common-popup-modal-container">
        <div>
          <p> {message} </p>
        </div>
        <div>
          <button onClick={onClose}>{textBtn}</button>
        </div>
      </div>
    </div>
  )
}

export default CmnPopupModal