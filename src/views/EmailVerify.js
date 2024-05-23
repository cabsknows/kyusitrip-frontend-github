import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import config from '../utils/config.js'
import success from "../assets/img/success.png"
import "../assets/styles/emailverify.css"



const EmailVerify = () => {

	// Declarations
	const navigate = useNavigate()
	const param = useParams()

	// States
	const [validUrl, setValidUrl] = useState(true)


	useEffect(() => { // Once the screen loads, it will verify the account through axios.get(url)
		const verifyEmailUrl = async () => {
			try {
				const url = `${config.URL_USED}/api/users/${param.id}/verify/${param.token}`
				const { data } = await axios.get(url)
				console.log(data)
				setValidUrl(true)
			} catch (error) {
				console.log(error)
				setValidUrl(false)
			}
		};
		verifyEmailUrl();
	}, [param]);


	return (
		<>
			{validUrl ? (
				<div className="email-verify-container">
					<img src={success} alt="success_img" className="email-verify-success"/>
					<h1>Email verified successfully</h1>
					<button onClick={() => navigate('/LoginPage')} className="email-verify-btn">Login</button>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</>
	);
};

export default EmailVerify;