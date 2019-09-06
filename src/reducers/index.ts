import { ErrorEntity } from './error-message/index';
import { Map, List } from 'immutable'
import { combineReducers } from 'redux-immutable'
import token from './user/token'
import profile from './user/profile'
import inferiors from './user/inferior'
import taskDrafts from './draft'
import taskList from './task-list'
import { TaskModel } from '../types/task'
import { PaginationData } from '../types'
import openedStores from './opened-store'
import { OpenedStore } from '../types/opened-store'
import { LatLng, POI } from 'react-native-amap3d'
import onlineOrders from './online-order'
import intentionStores from './intention-store'
import intentionMapStores from './intention-map-store'
import { IntentionStoreModel } from '../types/intention-store'
import taskPOIs from './poi'
import taskReport from './task-report'
import { ReportModel } from '../types/report'
import task from './task'
import { User } from '../types/user'
import userReports from './user-report'
import businessDistrictProfile from './business-district-profile'
import { BusinessDistrictProfileModel } from '../types/business-district-profile'
import loadingOverlay from './loading-overlay'
import uploadBackgroundTask from './upload-background-task'
import { BackgroundImageTaskModel } from '../types/task-background'
import report from './report'
import tasks from './tasks'
import taskOpenedStores from './task-opened-store'
import taskOpenedStoresList from './tast-opened-store-list'
import { TaskDraftModel } from '../types/task-draft';
import { CodePush, codePush } from './code-push';
import errorMessage from "./error-message";

interface Store {
	token: ReduxStoreAsyncItemState<string>
	profile: ReduxStoreAsyncItemState<User>
	taskDrafts: Map<string, ReduxStoreAsyncItemState<TaskDraftModel>>
	taskList: ReduxStoreAsyncItemState<PaginationData<TaskModel>>
	intentionStores: ReduxStoreAsyncItemState<PaginationData<IntentionStoreModel>>
	intentionMapStores: ReduxStoreAsyncItemState<Array<IntentionStoreModel>>
	openedStores: ReduxStoreAsyncItemState<Array<OpenedStore>>
	onlineOrders: ReduxStoreAsyncItemState<Array<LatLng>>
	taskPOIs: Map<string, ReduxStoreAsyncItemState<{ [key: string]: Array<POI> }>>
	taskReport: Map<string, ReduxStoreAsyncItemState<ReportModel>>
	taskOpenedStores: ReduxStoreAsyncItemState<PaginationData<TaskModel>>
	taskOpenedStoresList: ReduxStoreAsyncItemState<PaginationData<TaskModel>>
	userReports: Map<string, ReduxStoreAsyncItemState<PaginationData<ReportModel>>>
	task: Map<string, ReduxStoreAsyncItemState<TaskModel>>
	inferiors: ReduxStoreAsyncItemState<Array<User>>
	loadingOverlay: List<string>
	tasks: ReduxStoreAsyncItemState<Array<TaskModel>>
	businessDistrictProfile: Map<string, ReduxStoreAsyncItemState<BusinessDistrictProfileModel>>
	uploadBackgroundTask: Map<string, BackgroundImageTaskModel>
	report: Map<string, ReduxStoreAsyncItemState<ReportModel>>
	codePush: ReduxStoreItemState<CodePush>
	errorMessage:ReduxStoreItemState<ErrorEntity>
}

export interface ReduxStore extends Map<keyof Store, any> {
	get<K extends keyof Store>(key: K): Store[K];
}

interface ReduxStoreAsyncState<T> {
	isLoading: boolean
	error?: Error
	message?: string
	isDirty?: boolean
	data?: T
}

export interface ReduxStoreAsyncItemState<T> extends Map<keyof ReduxStoreAsyncState<T>, any> {
	get<K extends keyof ReduxStoreAsyncState<T>>(key: K): ReduxStoreAsyncState<T>[K];
}

export interface ReduxStoreItemState<T> extends Map<keyof T, any> {
	get<K extends keyof T>(key: K): T[K];
}

export default combineReducers({
	task,
	token,
	tasks,
	report,
	profile,
	taskList,
	codePush,
	taskPOIs,
	inferiors,
	taskDrafts,
	taskReport,
	userReports,
	openedStores,
	onlineOrders,
	errorMessage,
	loadingOverlay,
	intentionStores,
	taskOpenedStores,
	intentionMapStores,
	uploadBackgroundTask,
	taskOpenedStoresList,
	businessDistrictProfile
})
