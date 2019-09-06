import { OpenedStoreList } from './../constants/actionTypes';
import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { Task } from "../constants/actionTypes"
import { fetchTask as _fetchTask, fetchTasks as _fetchTasks, fetchUserTasks as _fetchUserTasks, delteTask as _delteTask, updatetask as _updatetask, fetchTaskPdfAsync as _fetchTaskPdfAsync, fetchTaskOpenedStores as _fetchTaskOpenedStores } from '../services/task'
import { TaskModel } from "../types/task";
import { PaginationData } from "../types";
import { fetchUserReports } from "./report";
import { ReportModel } from '../types/report';

export type FetchTaskActionFunction = ActionFunction<typeof fetchTask>

/**
 * 根据任务ID获取任务详情
 * @param id 
 */
export const fetchTask = (id: string): ThunkAction<Promise<TaskModel | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.FETCH_TASK_START)({ id }))
      const data = await _fetchTask(token, id)
      dispatch(createAction(Task.FETCH_TASK_SUCCESS)({ id, data }))
      return data
    } catch (error) {
      dispatch(createAction(Task.FETCH_TASK_ERROR)({ id, error }))
    }
  }
}

export type FetchTasksActionFunction = ActionFunction<typeof fetchTasks>

export const fetchTasks = (): ThunkAction<Promise<Array<TaskModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.FETCH_TASKS_START)())
      const response: PaginationData<TaskModel> = await _fetchTasks(token)
      const data = response.data!
      dispatch(createAction(Task.FETCH_TASKS_SUCCESS)(data))
      return data
    } catch (error) {
      dispatch(createAction(Task.FETCH_TASKS_ERROR)({error}))
    }
  }
}

export type FetchUserTasksActionFunction = ActionFunction<typeof fetchUserTasks>

/**
 * 获取当前用户所有任务
 */
export const fetchUserTasks = (): ThunkAction<Promise<PaginationData<TaskModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.FETCH_USER_TASK_LIST_START)())
      const tasks = await _fetchUserTasks(token, { pageCount: 1000 })
      dispatch(createAction(Task.FETCH_USER_TASK_LIST_SUCCESS)(tasks))
      return tasks
    } catch (error) {
      dispatch(createAction(Task.FETCH_USER_TASK_LIST_ERROR)({error}))
    }
  }
}

export type FetchTaskOpenedStoresActionFunction = ActionFunction<typeof fetchTaskOpenedStores>

/**
 * 获取当前用户所有已开门店的任务
 */
export const fetchTaskOpenedStores = (userId?: string): ThunkAction<Promise<PaginationData<ReportModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.FETCH_TASK_OPENED_STORE_START)())
      const tasks = await _fetchTaskOpenedStores(token, userId, { pageCount: 1000 })
      dispatch(createAction(Task.FETCH_TASK_OPENED_STORE_SUCCESS)(tasks))
      return tasks
    } catch (error) {
      dispatch(createAction(Task.FETCH_TASK_OPENED_STORE_ERROR)({error}))
    }
  }
}
export type FetchTaskOpenedStoresListActionFunction = ActionFunction<typeof fetchTaskOpenedStoresList>

export const fetchTaskOpenedStoresList = (userId?: string): ThunkAction<Promise<PaginationData<ReportModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(OpenedStoreList.FETCH_OPENED_STORE_LIST_START)())
      const tasks = await _fetchTaskOpenedStores(token, userId, { pageCount: 1000 })
      dispatch(createAction(OpenedStoreList.FETCH_OPENED_STORE_LIST_SUCCESS)(tasks))
      return tasks
    } catch (error) {
      dispatch(createAction(OpenedStoreList.FETCH_OPENED_STORE_LIST_ERROR)({error}))
    }
  }
}


export type DeleteRemoteUserTaskActionFunction = ActionFunction<typeof deleteRemoteUserTask>

/**
 * 删除当前用户的一条任务记录
 * @param taskId 
 */
export const deleteRemoteUserTask = (taskId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.DELTE_USER_TASK_START)({ taskId }))
      await _delteTask(token, taskId)
      dispatch(createAction(Task.DELTE_USER_TASK_SUCCESS)({ taskId }))
      dispatch(fetchUserTasks())
    } catch (error) {
      dispatch(createAction(Task.DELTE_USER_TASK_ERROR)({ taskId, error }))
    }
  }
}

export type UpdateRemoteUserTaskActionFunction = ActionFunction<typeof updateRemoteUserTask>

/**
 * 更新当前用户的一条任务记录
 * @param taskId 
 * @param name 
 */
export const updateRemoteUserTask = (taskId: string, name: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.UPDATE_USER_TASK_START)({ taskId }))
      const task = await _updatetask(token, taskId, { name })
      dispatch(createAction(Task.UPDATE_USER_TASK_SUCCESS)({ taskId, task }))
      dispatch(fetchUserTasks())
    } catch (error) {
      dispatch(createAction(Task.UPDATE_USER_TASK_ERROR)({ taskId, error }))
    }
  }
}

export type FetchTaskPdfAsyncActionFunction = ActionFunction<typeof fetchTaskPdfAsync>

/**
 * 异步的获取任务的pdf
 * @param taskId 
 * @param name 
 */
export const fetchTaskPdfAsync = (taskId: string): ThunkAction<Promise<any>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Task.FETCH_TASK_PDF_START)({ taskId }))
      const response = await _fetchTaskPdfAsync(token, taskId)
      dispatch(createAction(Task.FETCH_TASK_PDF_SUCCESS)({ taskId }))
      dispatch(fetchUserTasks())
      dispatch(fetchUserReports())
      return response
    } catch (error) {
      dispatch(createAction(Task.FETCH_TASK_PDF_ERROR)({ taskId, error }))
    }
  }
}