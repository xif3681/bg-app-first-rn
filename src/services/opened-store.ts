import request from './request'
import { SERVER } from '../constants';

export const fetchAllOpenedStores = () => {
  return request.get(`${SERVER.openedStore}/store_lon_lat.json`)
}