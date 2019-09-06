import { Geolocation, Location } from "react-native-amap-geolocation"
import { CONSTANT_AMAP } from "../constants"
import { EventSubscription, Platform, Linking } from "react-native"
import Permissions from 'react-native-permissions'
//@ts-ignore
import OpenAppSettings from 'react-native-app-settings'

Geolocation.init(CONSTANT_AMAP.key)
Geolocation.setOptions({
  interval: 8000,
  distanceFilter: 20
})

export class GeolocationManager {
  static eventSubscription?: EventSubscription
  static checkPermission = async () => {
    return Permissions.check('location')
  }
  static requestPermission = async () => {
    return Permissions.request('location')
  }
  static goSetting = async () => {
    if (Platform.OS === 'android') {
      return OpenAppSettings.open()
    } else {
      return Linking.openURL('app-settings:')
    }
  }
  static fetchOne = async (): Promise<Location> => {
    return new Promise(function(resolve, reject) {
      GeolocationManager.eventSubscription = Geolocation.addLocationListener((position) => {
        Geolocation.stop()
        resolve(position)
      })
      Geolocation.start()
    })
  }
  static stop = () => {
    Geolocation.stop()
    GeolocationManager.eventSubscription && GeolocationManager.eventSubscription.remove()
  }
  static start = async (): Promise<Location> => {
    return new Promise(function(resolve, reject) {
      GeolocationManager.eventSubscription = Geolocation.addLocationListener((position) => {
        resolve(position)
      })
      Geolocation.start()
    })
  }
}