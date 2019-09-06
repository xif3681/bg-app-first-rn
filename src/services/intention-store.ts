/**
 * 意向门店
 */
import request from './request'
import { SERVER } from '../constants';

//创建一条意向店记录
export const intentionShops = (token: string|undefined,params: any) => {
	return request.post(`${SERVER.host}/intentionShops`, params,{
		headers: {
			token
		}
	})
}

//获取地图所有意向店
export const intentionShopsList = (token: string|undefined) => {
	return request.get(`${SERVER.host}/dashboard/intentionShops`, undefined,{
		headers: {
			token
		}
	})
}


//删除意向店面
export const deleteIntentionStores = (token: string, id?: String) => {
	return request.delete(`${SERVER.host}/intentionShops/${id}`, undefined, {
		headers: {
			token
		}
	})
}

//修改一条意向店沟通记录
export const patchCommunicationRecords = (token: string, id?: String,content?:String) => {
	return request.patch(`${SERVER.host}/intentionShops/intentionShopCommunicationRecords/${id}`, {content}, {
		headers: {
			token
		}
	})
}

//删除沟通记录
export const deleteCommunicate = (token: string, id?: String) => {
	return request.delete(`${SERVER.host}/intentionShops/intentionShopCommunicationRecords/${id}`, undefined, {
		headers: {
			token
		}
	})
}

//添加沟通记录
export const insertCommunicate = (token: string, id: String|undefined,params:any) => {
	return request.post(`${SERVER.host}/intentionShops/${id}/intentionShopCommunicationRecords`, params, {
		headers: {
			token
		}
	})
}


//获取指定意向店的所有沟通记录
export const intentionShopCommunicationRecords = (token: string|undefined, id: String) => {
	return request.get(`${SERVER.host}/intentionShops/${id}/intentionShopCommunicationRecords`, undefined, {
		headers: {
			token
		}
	})
}

//修改意向店面名称
export const updateIntentionStores = (token: string, id: String, name:string) => {
	return request.patch(`${SERVER.host}/intentionShops/`+id, {name}, {
		headers: {
			token
		}
	})
}

//修改意向全部信息
export const updateAllIntentionStores = (token: string, id: String|undefined, params:any) => {
	return request.patch(`${SERVER.host}/intentionShops/`+id, params, {
		headers: {
			token
		}
	})
}
//查询用户意向店
export const fetchUserIntentionStores = (token: string, params?: object) => {
	return request.get(`${SERVER.host}/intentionShops`, params, {
		headers: {
			token
		}
	})
}