import '../assets/styles/modals.css'
import modalLogo from '../assets/img/modal-logo.svg'


const ModalHeader = ({ title, isRoute = true }) => {
  return (
    <>
      <div className="header-modal">
        <div className='header-modal-col1'>
          <div className='header-modal-col1-title'>
            <img className='header-logo' src={modalLogo} alt="logo" />
          </div>
          <div>
            <h2 style={{fontSize: "30px"}}><span>Kyusi</span>Trip</h2>
          </div>
        </div>
        <div className='header-modal-col2'>
          <div>
            {isRoute ? (<h4 style={{fontSize: "20px"}}>Kyusi<span>{ title }</span></h4>)
            : <h4><span>{ title }</span></h4>
            }
          </div>
          <div>
            <p>Accurate Routes, Save Time</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalHeader
