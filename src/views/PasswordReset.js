import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

import "../assets/styles/passwordreset.css"
import config from '../utils/config'


const PasswordReset = () => {

	// Dependencies
	const param = useParams()
	const navigate = useNavigate()

	// Declarations
	const url = `${config.URL_USED}/api/password-reset/${param.id}/${param.token}`
	
  // ------------------------------------------------------------ //
  // States
  // ------------------------------------------------------------ //
	const [validUrl, setValidUrl] = useState(false)
	const [password, setPassword] = useState("")
	const [msg, setMsg] = useState("")
	const [error, setError] = useState("")
	// ************************************************************ //


	useEffect(() => {
		const verifyUrl = async () => {
			try {
				await axios.get(url)
				setValidUrl(true)
			} catch (error) {
				setValidUrl(false)
			}
		};
		verifyUrl()
	}, [param, url])
	

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const { data } = await axios.post(url, { password })
			setMsg(data.message)
			setError("")
			window.location = "/LoginPage"
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message)
				setMsg("")
			}
		}
	};


	return (
		<>
			{validUrl ? (
				<div className="password-reset-container">
					<form className="password-reset-form-container" onSubmit={handleSubmit}>
						<h1>New Password</h1>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={e => {
                setPassword(e.target.value)
                setMsg('')
                setError('')
              }} 
							value={password}
							required
							className="password-reset-input"
						/>
						{error && <div className="password-reset-error-msg">{error}</div>}
						{msg && <div className="password-reset-success-msg">{msg}</div>}
						<button type="submit" className="password-reset-btn">
							Submit
						</button>
					</form>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
			<div className='back-button-div'>
				<button className='back-btn' onClick={() => navigate('/')}>Back</button>
			</div>
		</>
	);
};

export default PasswordReset;