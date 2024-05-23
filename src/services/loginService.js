import axios from 'axios'
import config from '../utils/config.js'

const baseUrl = `${config.URL_USED}/api/login`

export const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}


