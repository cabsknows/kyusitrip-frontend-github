import { useNavigate } from 'react-router-dom';

import '../assets/styles/landing.css';
import logo2 from '../assets/img/LOGO2.svg';


const LandingPage = () => {
  
  // Dependencies
  const navigate = useNavigate();

  return (
    <div className='landing-page' onClick={() => navigate('/kyusitrip-frontend-github/HomePage')}>
      <div className='landing-container'>
        
        <div className='landing-logo' style={{marginTop: "-50px"}}>
          <img style={{width: "300px"}} src= {logo2} alt="logo" />
        </div>

        <div className='landing-title'>
          <h1><span>K</span>yusi<span>T</span>rip</h1>
        </div>

        <div>
          <h1>Plan your Public Transportation Route within Quezon City</h1>
        </div>

        <div style={{position: "absolute", bottom: "30px"}}>
          <p style={{fontSize: "22px"}}>Tap anywhere to proceed</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
