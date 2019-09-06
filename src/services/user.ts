import request from './request'
import { SERVER } from '../constants';

export const login = (code: string) => {
  return request.post(`${SERVER.host}/login`, { code })
}

export const debugLoginWithPhoneNumber = (phone: string) => {
  return request.post(`${SERVER.host}/token?phone=${phone}`, {})
}

export const fetchUserInferiors = (token: string) => {
  return request.get(`${SERVER.host}/users/inferiors`, undefined, {
    headers: {
      token
    }
  })
}