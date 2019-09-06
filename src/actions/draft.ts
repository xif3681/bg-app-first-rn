import { createAction } from "redux-actions"
import { Draft } from "../constants/actionTypes"
import { ThunkAction } from "redux-thunk"
import { ReduxStore } from "../reducers"
import { Action } from "redux"
import { createTask, updatetask } from "../services/task"
import AsyncStorage from '@react-native-community/async-storage'
import { omit } from 'lodash'
import { fetchUserTasks, fetchTask } from "./task";
import { fetchTaskReport } from "./report";
import { TaskModel } from "../types/task";
import { ActionFunction } from "."
import { CONSTANT_OPTION_STORE_INFO } from "../constants"

const defaultTaskCreater = (draft: any) => ({
  overallPotential: CONSTANT_OPTION_STORE_INFO.overallPotential[0],
  orientation: CONSTANT_OPTION_STORE_INFO.orientation[0],
  type: CONSTANT_OPTION_STORE_INFO.type[0],
  joinMode: CONSTANT_OPTION_STORE_INFO.joinMode[0],
  joinType: CONSTANT_OPTION_STORE_INFO.joinType[0],
  joinRegion: CONSTANT_OPTION_STORE_INFO.joinRegion[0],
  subdistrictQuality: CONSTANT_OPTION_STORE_INFO.subdistrictQuality[0],
  place: CONSTANT_OPTION_STORE_INFO.place[0],
  temporaryParking: CONSTANT_OPTION_STORE_INFO.temporaryParking[0],
  traffic: CONSTANT_OPTION_STORE_INFO.traffic[0],
  obstruction: CONSTANT_OPTION_STORE_INFO.obstruction[0],
  estimatedRenovation: CONSTANT_OPTION_STORE_INFO.estimatedRenovation[0],
  personality: CONSTANT_OPTION_STORE_INFO.personality[0],
  hasSecondFloor: CONSTANT_OPTION_STORE_INFO.hasSecondFloor[0],
  isDirty: true,
  ...draft
})

export const taskDraftValuesChange = (taskDraftId: string, keyValues: { [key: string]: any }) => {
  for (const key in keyValues) {
    if (typeof keyValues[key] === 'string')
      keyValues[key] = keyValues[key].trim()
  }
  return createAction(Draft.VALUE_CHANGE)({ taskDraftId, keyValues })
}

export const taskDraftCreate = (taskDraftId: string, draft?: any) => {
  return createAction(Draft.CREATE_LOCAL)({ taskDraftId, draft: defaultTaskCreater(draft) })
}

export type TaskRemoteUpdateActionFunction = ActionFunction<typeof taskRemoteUpdate>

export const taskRemoteUpdate = (taskDraftId: string): ThunkAction<Promise<TaskModel | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const taskDraft = getState().get('taskDrafts').get(taskDraftId)!.get('data')
      const token = getState().get('token').get('data')
      dispatch(createAction(Draft.REMOTE_UPDATE_START)(taskDraftId))
      const draft = await updatetask(token!, taskDraft!._id, taskDraft!)
      dispatch(createAction(Draft.REMOTE_UPDATE_SUCCESS)({ taskDraftId, draft }))
      // dispatch(removeLocalTask(taskDraftId))
      dispatch(fetchUserTasks())
      // if (draft._id) {
      //   dispatch(fetchTask(draft._id))
      //   dispatch(fetchTaskReport(draft._id))
      // }
      return draft
    } catch (error) {
      if (`${error}`.indexOf("timeout") != -1) {
        error = new Error("网络环境不佳，保存失败")
      } else if (`${error}`.indexOf("Network Error") != -1) {
        error = new Error("当前无网络，保存失败")
      }
      dispatch(createAction(Draft.REMOTE_UPDATE_ERROR)({ taskDraftId, error }))
      // dispatch(saveLocalTask(taskDraftId))
    }
  }
}

export type TaskRemoteCreateActionFunction = ActionFunction<typeof taskRemoteCreate>

export const taskRemoteCreate = (taskDraftId: string): ThunkAction<Promise<TaskModel | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const taskDraft = getState().get('taskDrafts').get(taskDraftId)!.get('data')
      const token = getState().get('token').get('data')
      dispatch(createAction(Draft.REMOTE_CREATE_START)(taskDraftId))
      const draft = await createTask(token!, taskDraft!)
      dispatch(createAction(Draft.REMOTE_CREATE_SUCCESS)({ taskDraftId, draft }))
      // dispatch(removeLocalTask(taskDraftId))
      dispatch(fetchUserTasks())
      return draft
    } catch (error) {
      if (`${error}`.indexOf("timeout") != -1) {
        error = new Error("网络环境不佳，保存失败")
      } else if (`${error}`.indexOf("Network Error") != -1) {
        error = new Error("当前无网络，保存失败")
      }
      dispatch(createAction(Draft.REMOTE_CREATE_ERROR)({ taskDraftId, error }))
      // dispatch(saveLocalTask(taskDraftId))
    }
  }
}

export const saveLocalTask = (taskDraftId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const task = getState().get('taskDrafts').get(taskDraftId)
      dispatch(createAction(Draft.LOCAL_SAVE_START)(taskDraftId))
      let draftString = await AsyncStorage.getItem('draft')
      if (draftString) {
        const draft = JSON.parse(draftString)
        draft[taskDraftId] = JSON.stringify(task)
        await AsyncStorage.setItem('draft', JSON.stringify(draft))
      } else {
        await AsyncStorage.setItem('draft', JSON.stringify({ taskDraftId: task }))
      }
      dispatch(createAction(Draft.LOCAL_SAVE_SUCCESS)(taskDraftId))
    } catch (error) {
      dispatch(createAction(Draft.LOCAL_SAVE_ERROR)(error))
    }
  }
}

export const removeLocalTask = (taskDraftId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      dispatch(createAction(Draft.LOCAL_REMOVE_START)(taskDraftId))
      let draftString = await AsyncStorage.getItem('draft')
      if (draftString) {
        let draft = JSON.parse(draftString)
        draft = omit(draft, [taskDraftId])
        await AsyncStorage.setItem(taskDraftId, JSON.stringify(draft))
      }
      dispatch(createAction(Draft.LOCAL_REMOVE_SUCCESS)(taskDraftId))
    } catch (error) {
      dispatch(createAction(Draft.LOCAL_REMOVE_ERROR)(error))
    }
  }
}