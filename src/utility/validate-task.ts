import { BackgroundImageTaskModel } from './../types/task-background.d';
import { TaskModel } from "../types/task";
import { TaskDraftModel } from "../types/task-draft";
import { Map } from "immutable";

export default (task?: TaskModel | TaskDraftModel, showDetail = true, type?: number, backgroundImageTaskModelMap?: Map<string, BackgroundImageTaskModel>) => {
  if (!task) return "报告错误"

  //return'报告未填写完整'
  if (type === 0 || !type) {
    if ((type === 0 ? false : (task.peakTimeFlow === undefined || task.peakTimeFlow === null))
      || task.peakTimeFlow && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(`${task.peakTimeFlow}`)
      || task.peakTimeFlow && task.peakTimeFlow! <= 0) {
      if (showDetail)
        return '请填写正确的高峰期人流'
      else
        return '报告未填写完整'

    }
    if (type === 0 ? false : (task.businissStatus === undefined || task.businissStatus === null)) {
      if (showDetail)
        return '请填写正确的商圈形态'
      else
        return '报告未填写完整'
    }
    if ((type === 0 ? false : (task.residenceNumber === undefined || task.residenceNumber && task.residenceNumber === null)) || task.residenceNumber && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(`${task.residenceNumber}`) || task.residenceNumber && task.residenceNumber! <= 0) {
      if (showDetail)
        return '请填写正确的自然辐射住户数'
      else
        return '报告未填写完整'
    }
    if ((type === 0 ? false : (task.businessDistrictResidenceNumber === undefined || task.businessDistrictResidenceNumber === null)) || task.businessDistrictResidenceNumber && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(`${task.businessDistrictResidenceNumber}`)) {
      if (showDetail)
        return '请填写正确的商圈规模住户数'
      else
        return '报告未填写完整'
    }
    if ((type === 0 ? false : (task.realEstatePrice === undefined || task.realEstatePrice === null)) || task.realEstatePrice && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(`${task.realEstatePrice}`)) {
      if (showDetail)
        return '请填写正确的楼盘均价'
      else
        return '报告未填写完整'
    }
  }
  //第一页返回
  if (type == 0) {
    return ''
  }
  if (type === 1 || !type) {
    if ((type === 1 ? false : (task.width === undefined || task.width === null)) || task.width && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.width!)) {
      if (showDetail)
        return '请填写正确的门店宽度'
      else
        return '报告未填写完整'
    }
    if ((type === 1 ? false : (task.length === undefined || task.length === null)) || task.length && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.length!)) {
      if (showDetail)
        return '请填写正确的门店长度'
      else
        return '报告未填写完整'
    }
    if (type === 1 ? false : (task.adjacentStores === undefined || task.adjacentStores === null)) {
      if (showDetail)
        return '请填写正确的相邻店铺名称'
      else
        return '报告未填写完整'
    }

    if (task.corrivals != null && task.corrivals.length > 0) {
      for (const iterator of task.corrivals) {
        if (type === 1 ? false : !iterator.name) {
          if (showDetail)
            return '请填写竞争门店名称'
          else
            return '报告未填写完整'
        }
        if (type === 1 ? false : !iterator.rent || iterator.rent && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(iterator.rent)) {
          if (showDetail)
            return '请填写竞争门店租金'
          else
            return '报告未填写完整'
        }
        if (type === 1 ? false : !iterator.saleRoom || iterator.saleRoom && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(iterator.saleRoom)) {
          if (showDetail)
            return '请填写竞争门店销售额'
          else
            return '报告未填写完整'
        }
      }
    }
  }
  //第二页返回
  if (type == 1) {
    return ''
  }
  if (type === 2 || !type) {
    if ((type === 2 ? false : task.firstYearRent === undefined || task.firstYearRent === null) || task.firstYearRent && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.firstYearRent!)) {
      if (showDetail)
        return '请填写正确的店铺首年租金'
      else
        return '报告未填写完整'
    }
    if ((type === 2 ? false : (task.leaseTerm === undefined || task.leaseTerm === null)) || task.leaseTerm && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.leaseTerm!)) {
      if (showDetail)
        return '请填写正确的租赁期限'
      else
        return '报告未填写完整'
    }
    if (type === 2 ? false : (task.rentIncreases === undefined || task.rentIncreases === null)) {
      if (showDetail)
        return '请填写正确的租金递增情况'
      else
        return '报告未填写完整'
    }
    if ((type === 2 ? false : (task.transferFee === undefined || task.transferFee === null)) || task.transferFee && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.transferFee!)) {
      if (showDetail)
        return '请填写正确的转让费'
      else
        return '报告未填写完整'
    }
    if ((type === 2 ? false : (task.entryFee === undefined || task.entryFee === null)) || task.entryFee && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.entryFee!)) {
      if (showDetail)
        return '请填写正确的进场费'
      else
        return '报告未填写完整'
    }
    if ((type === 2 ? false : (task.agencyFee === undefined || task.agencyFee === null)) || task.agencyFee && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.agencyFee!)) {
      if (showDetail)
        return '请填写正确的中介费'
      else
        return '报告未填写完整'
    }
    if ((type === 2 ? false : (task.staffQuartersFee === undefined || task.staffQuartersFee === null)) || task.staffQuartersFee && !/^(\d|([1-9]\d+))(\.\d{1,19})?$/.test(task.staffQuartersFee!)) {
      if (showDetail)
        return '请填写正确的员工宿舍费'
      else
        return '报告未填写完整'
    }
  }
  //第三页返回
  if (type == 2) {
    return ''
  }
  if (type === 3 ? false : (task.transferorName === undefined || task.transferorName === null)) {
    if (showDetail)
      return '请填写正确的转让人'
    else
      return '报告未填写完整'
  }
  if ((type === 3 ? false : !task.transferorPhone) || task.transferorPhone && !/^[1][3,4,5,7,8][0-9]{9}$/.test(task.transferorPhone!)) {
    if (showDetail)
      return '请填写正确的转让人手机号'
    else
      return '报告未填写完整'
  }
  //判断商户图片
  if (task.images && task.images.length > 0) {
    for (let image of task.images) {
      if (!image.remoteUrl && backgroundImageTaskModelMap && image.uniqueKey) {
        if (backgroundImageTaskModelMap.get(image.uniqueKey) &&
          backgroundImageTaskModelMap.get(image.uniqueKey)!.error) {
            return '有商铺图片上传失败,请检查'
        }else{
          return '有商铺图片上传中,请稍后'
        }
        
      }
    }
  }
  //判断竞争门店图片
  if (task.corrivals && task.corrivals.length > 0) {
    for (let corrival of task.corrivals) {
      if (corrival.images && corrival.images.length > 0) {
        for (let image of corrival.images) {
          if (!image.remoteUrl && backgroundImageTaskModelMap && image.uniqueKey) {
            if (backgroundImageTaskModelMap.get(image.uniqueKey) &&
              backgroundImageTaskModelMap.get(image.uniqueKey)!.error) {
                return '有竞争门店图片上传失败,请检查'
            }else{
              return '有竞争门店铺图片上传中,请稍后'
            }
            
          }
        }
      }
    }
  }
  return ''

}


