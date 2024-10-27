// Get map instance
import { log } from '@/common/Logger.ts'

export const getMapInstance = (
  center: { lng: string | number; lat: string | number },
  bmContainerId: string,
  zoomSize?: number
) => {
  const map = new BMapGL.Map(bmContainerId)
  const point = new BMapGL.Point(center.lng, center.lat)
  map.centerAndZoom(point, zoomSize ? zoomSize : 14)
  map.addControl(new BMapGL.ScaleControl())
  map.addControl(new BMapGL.ZoomControl())
  map.addControl(new BMapGL.CityListControl())
  map.enableScrollWheelZoom(true)
  return map
}

/**
 *
 * Convert city name to geo point
 * @example
 *convertCityNameToGeoPoint(data.cityName, point => {
 *    setCenterPoint(point)
 *  })
 */
export const convertCityNameToGeoPoint = (cityName: string, setCenterPoint: (point: any) => void) => {
  const geocoder = new BMapGL.Geocoder()
  geocoder.getPoint(
    cityName,
    (point: { lng: string; lat: string }) => {
      if (point) {
        setCenterPoint(point)
        log.info(`Geocoded city: ${cityName}, Point:`, point)
      } else {
        log.error('Failed to geocode city name')
      }
    },
    cityName
  )
}

function constants() {
  return {
    iconMarkPoint: '/images/icon_route_mark.png',
    iconRoutAnimate: '/images/icon_track_animate.png',
    iconOrderInsight: '/images/icon_order_completion.png',
  }
}

export const mapConstants = constants()
