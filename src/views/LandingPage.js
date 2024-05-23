import { useNavigate } from 'react-router-dom';

import '../assets/styles/landing.css';
import logo2 from '../assets/img/LOGO2.svg';


const LandingPage = () => {
  
  // Dependencies
  const navigate = useNavigate();

  return (
    <div className='landing-page'>
      <div className='landing-container'>
        
        <div className='landing-logo'>
          <img src= {logo2} alt="logo" />
        </div>

        <div className='landing-title'>
          <h1><span>K</span>yusi<span>T</span>rip</h1>
        </div>

        <div className='landing-btn'>
          <button onClick={() => navigate('/LoginPage')}>Log in</button>
          <button onClick={() => navigate('/HomePage')}>Continue as Guest</button>
        </div>

        <div className='landing-txt'>
          <h5>No Account? <span onClick={() => navigate('/SignupPage')}>Create One</span></h5>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
