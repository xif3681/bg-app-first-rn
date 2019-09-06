import request from './request'
import { SERVER } from '../constants';

export const fetchBusinessDistrictPopulation = async (token: string, taskId: string) => {
  return request.get(`${SERVER.host}/amapData/population`, {
    taskId
  }, {
    headers: {
      token
    }
  })
}

export const fetchBusinessDistrictFlow = async (token: string, taskId: string) => {
  return request.get(`${SERVER.host}/amapData/flow`, {
    taskId
  }, {
    headers: {
      token
    }
  })
}

export const fetchBusinessDistrictBaseProfile = async (token: string, taskId: string, type: string, groupBy: string) => {
  return request.get(`${SERVER.host}/amapData/baseProfile`, {
    taskId,
    type,
    groupBy
  }, {
    headers: {
      token
    }
  })
}

export const fetchBusinessDistrictFlowProfile = async (token: string, taskId: string, groupBy: string) => {
  return request.get(`${SERVER.host}/amapData/flowProfile`, {
    taskId,
    groupBy
  }, {
    headers: {
      token
    }
  })
}