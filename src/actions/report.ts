import { ActionFunction } from "."
import { ThunkAction } from "redux-thunk"
import { Action, createAction } from "redux-actions"
import { ReduxStore } from "../reducers"
import { Report } from "../constants/actionTypes"
import { fetchTaskReport as _fetchTaskReport, fetchUserReports as _fetchUserReports, fetchInferiorReports as _fetchInferiorReports, deleteReport as _deleteReport, fetchUserReportDetail as _fetchUserReportDetail } from '../services/report'
import { ReportModel } from "../types/report"
// @ts-ignore
import * as WechatWork from 'react-native-wechat-work'
// @ts-ignore
import * as WeChat from 'react-native-wechat'
import RNFetchBlob from 'rn-fetch-blob'
import Permissions from 'react-native-permissions'
import { Platform, Alert } from "react-native"
// @ts-ignore
import OpenAppSettings from 'react-native-app-settings'
import moment from 'moment'
import { PaginationData } from "../types";

export type FetchTaskReportActionFunction = ActionFunction<typeof fetchTaskReport>

/**
 * 获取任务的报告
 * @param taskId 
 */
export const fetchTaskReport = (taskId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Report.FETCH_TASK_REPORT_START)({id: taskId}))
      const data = await _fetchTaskReport(token, taskId)
      dispatch(createAction(Report.FETCH_TASK_REPORT_SUCCESS)({id: taskId, data}))
    } catch (error) {
      dispatch(createAction(Report.FETCH_TASK_REPORT_ERROR)({id: taskId, error}))
    }
  }
}

export const fetchReport = (userId: string, reportId: string): ThunkAction<Promise<ReportModel>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Report.FETCH_USER_REPORT_START)({id: reportId}))
      const data = await _fetchUserReportDetail(token, userId, reportId)
      dispatch(createAction(Report.FETCH_USER_REPORT_SUCCESS)({id: reportId, data}))
      return data
    } catch (error) {
      dispatch(createAction(Report.FETCH_USER_REPORT_ERROR)({id: reportId, error}))
    }
  }
}

export type FetchUserReportsActionFunction = ActionFunction<typeof fetchUserReports>

/**
 * 根据用户ID获取用户的所有报告列表
 * @param userId 
 */
export const fetchUserReports = (userId?: string): ThunkAction<Promise<PaginationData<ReportModel> | undefined>, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Report.FETCH_USER_REPORTS_START)({id: userId || 'this'}))
      let data
      if (userId) {
        data = await _fetchInferiorReports(token, userId, {pageCount: 1000})
        dispatch(createAction(Report.FETCH_USER_REPORTS_SUCCESS)({id: userId, data}))
        return data
      } else {
        data = await _fetchUserReports(token, {pageCount: 1000})
        dispatch(createAction(Report.FETCH_USER_REPORTS_SUCCESS)({id: 'this', data}))
        return data
      }
    } catch (error) {
      dispatch(createAction(Report.FETCH_USER_REPORTS_ERROR)({id: userId || 'this', error}))
    }
  }
}

export const deleteReport = (reportId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      const token = getState().get('token').get('data')!
      dispatch(createAction(Report.DELTE_REPORT_START)({id: reportId}))
      await _deleteReport(token, reportId)
      dispatch(createAction(Report.DELTE_REPORT_SUCCESS)({id: reportId}))
      dispatch(fetchUserReports())
    } catch (error) {
      dispatch(createAction(Report.DELTE_REPORT_ERROR)({id: reportId, error}))
    }
  }
}

export const downloadReportPDF = (userId: string, reportId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await Permissions.request('storage')
        if (granted === 'denied' || granted === 'restricted') {
          Alert.alert('缺少文件读取权限', 'PDF分享需要读写本地缓存', [{
            text: '设置',
            onPress: OpenAppSettings.open
          }, {
            text: '取消'
          }])
          return
        }
      }
      // dispatch(createAction(Report.DOWNLOAD_PDF_START)({id: reportId}))
      const state = getState()
      const storeAsyncStateReport =  state.get('report').get(reportId)
      let report = storeAsyncStateReport && storeAsyncStateReport.get('data')
      if (!report) {
        report = await dispatch(fetchReport(userId, reportId))
      }
      if (!report) return 
      dispatch(createAction(Report.DOWNLOAD_PDF_START)({id: reportId}))
      if (!report.pdfAttachment || !report.pdfAttachment.url) throw new Error('获取报告PDF地址失败')
      const path = `${Platform.OS === 'android' ? RNFetchBlob.fs.dirs.DownloadDir : RNFetchBlob.fs.dirs.DocumentDir}/${report.name}_拓展报告_${moment().format('YYYYMMDDHH')}.pdf`
      const downloaded = await RNFetchBlob.fs.exists(path)
      if (downloaded) {
        dispatch(createAction(Report.DOWNLOAD_PDF_SUCCESS)({id: reportId, data: path}))
        return path
      }
      const response = await RNFetchBlob.config({path}).fetch('GET', encodeURI(report!.pdfAttachment!.url!))
      let data = response.data
      if (!data) throw new Error('下载PDF失败')
      dispatch(createAction(Report.DOWNLOAD_PDF_SUCCESS)({id: reportId, data}))
      return data
    } catch (error) {
      console.log(error)
      dispatch(createAction(Report.DOWNLOAD_PDF_ERROR)({id: reportId, error}))
    }
  }
}

/**
 * 分享报告到工作微信
 * @param userId 
 * @param reportId 
 */
export const shareReport2Wechatwork = (userId: string, reportId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    const token = getState().get('token').get('data')!
    const reportDetail: ReportModel = await _fetchUserReportDetail(token, userId, reportId)
    if (!reportDetail.pdfAttachment || !reportDetail.pdfAttachment.url) throw new Error('没有找到报告信息！')
    await WechatWork.registerApp('wwauthf89009662322d93e000033', 'wxf89009662322d93e', '1000033') /// 企业证书
    // await WechatWork.registerApp('wwauthf89009662322d93e000054', 'wxf89009662322d93e', '1000054') /// 发布证书
    await WechatWork.shareLinkAttachment(reportDetail.name, reportDetail.location!.formattedAddress, reportDetail.pdfAttachment.url)
  }
}

/**
 * 分享报告到微信
 * @param userId 
 * @param reportId 
 */
export const shareReport2Wechat = (userId: string, reportId: string): ThunkAction<any, ReduxStore, null, Action<any>> => {
  return async (dispatch, getState) => {
    const token = getState().get('token').get('data')!
    const reportDetail: ReportModel = await _fetchUserReportDetail(token, userId, reportId)
    if (!reportDetail.pdfAttachment || !reportDetail.pdfAttachment.url) throw new Error('没有找到报告信息！')
    await WeChat.registerApp('wx730c9c6dfe0a2eae')
    await WeChat.shareToSession({
      type: 'news',
      title: reportDetail.name,
      description: reportDetail.location!.formattedAddress,
      messageAction: undefined,
      messageExt: undefined,
      webpageUrl: reportDetail.pdfAttachment.url,
    })
  }
}