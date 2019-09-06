import request from './request'
import { SERVER } from '../constants';

export const createTask = async (token: string, body: object) => {
  return request.post(`${SERVER.host}/tasks`, body, {
    headers: {
      token
    }
  })
}

export const updatetask = async (token: string, taskId: string, body: object) => {
  return request.put(`${SERVER.host}/tasks/${taskId}`, body, {
    headers: {
      token
    }
  })
}

export const fetchUserTasks = async (token: string, paramas?: object) => {
  return request.get(`${SERVER.host}/tasks`, paramas, {
    headers: {
      token
    }
  })
}

export const fetchTaskOpenedStores = async (token: string, userId?: string, paramas?: object) => {
  return request.get(`${SERVER.host}/users/${userId}/openedStores`, paramas, {
    headers: {
      token
    }
  })
}

export const delteTask = async (token: string, taskId: string) => {
  return request.delete(`${SERVER.host}/tasks/${taskId}`, undefined, {
    headers: {
      token
    }
  })
}

export const fetchTask = async (token: string, taskId: string) => {
  return request.get(`${SERVER.host}/tasks/${taskId}`, undefined, {
    headers: {
      token
    }
  })
}

export const fetchTasks = async (token: string) => {
  return request.get(`${SERVER.host}/dashboard/tasks`, {
    pageCount: 1000
  }, {
    headers: {
      token
    }
  })
}

export const fetchTaskPdfAsync = (token: string, taskId: string) => {
  return request.get(`${SERVER.host}/tasks/${taskId}/reports/pdfs`, undefined, {
    headers: {
      token
    }
  })
}