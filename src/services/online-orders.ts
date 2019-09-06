import request from './request'
import { SERVER } from '../constants';

export const fetchAllOnlineOrders = () => {
  return request.get(`${SERVER.openedStore}/receiver_lon_lat.json`)
}