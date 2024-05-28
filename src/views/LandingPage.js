import { useNavigate } from 'react-router-dom';

import '../assets/styles/landing.css';
import logo2 from '../assets/img/LOGO2.svg';


const LandingPage = () => {
  
  // Dependencies
  const navigate = useNavigate();

  return (
    <div className='landing-page' onClick={() => navigate('/kyusitrip-frontend-github/HomePage')}>
      <div className='landing-container'>
        
        <div className='landing-logo'>
          <img src= {logo2} alt="logo" />
        </div>

        <div className='landing-title'>
          <h1><span>K</span>yusi<span>T</span>rip</h1>
        </div>

        <div style={{position: "absolute", bottom: "30px"}}>
          <p>Tap anywhere to continue</p>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
