import axios from 'axios'
import config from '../utils/config.js'

const baseUrl = `${config.URL_USED}/api/reports`


let token = null


const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const setLogoutToken = logoutToken => {
  token = logoutToken
}

const getToken = () => {
  if (token !== null) {
    return true
  } else {
    return false
  }
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

const reportService = {
  getAll,
  create,
  update,
  setToken,
  setLogoutToken,
  getToken
}


export default reportService