import { 
  HashRouter as Router,
  Routes, 
  Route
} from 'react-router-dom'
import LandingPage from "../views/LandingPage"
import HomePage from "../views/HomePage"
import EmailVerify from "../views/EmailVerify"
import PasswordReset from "../views/PasswordReset"


const Routing = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/kyusitrip-frontend-github' element={<LandingPage />}></Route>
          <Route path='/kyusitrip-frontend-github/HomePage' element={<HomePage />}></Route>
          <Route path='/kyusitrip-frontend-github/users/:id/verify/:token' element={<EmailVerify />}></Route>
          <Route path='/kyusitrip-frontend-github/password-reset/:id/:token' element={<PasswordReset />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default Routing
