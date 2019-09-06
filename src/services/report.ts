import request from './request'
import { SERVER } from '../constants';

export const fetchTaskReport = (token: string, taskId: string) => {
  return request.post(`${SERVER.host}/reports/sync`, {
    taskId
  }, {
    headers: {
      token
    },
    timeout: 1000*30
  })
}

export const fetchUserReports = (token: string, paramas?: object) => {
  return request.get(`${SERVER.host}/reports`, paramas, {
    headers: {
      token
    }
  })
}

export const fetchUserReportDetail = (token: string, userId: string, reportId: string) => {
  return request.get(`${SERVER.host}/users/${userId}/reports/${reportId}`, undefined, {
    headers: {
      token
    }
  })
}

export const fetchInferiorReports = (token: string, userId: string, paramas?: object) => {
  return request.get(`${SERVER.host}/users/${userId}/reports`, paramas, {
    headers: {
      token
    }
  })
}

export const deleteReport = (token: string, reportId: string) => {
  return request.delete(`${SERVER.host}/reports/${reportId}`, undefined, {
    headers: {
      token
    }
  })
}