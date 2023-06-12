import API_KEY from './API_KEY'
import axios from 'axios'

// получаем массив городов

const getCities = async () => {
  const URL =
    'https://parseapi.back4app.com/classes/Ukraine_City?count=1&limit=20&order=-population&keys=name,location,cityId'
  const config = {
    headers: {
      'X-Parse-Application-Id': '3kXINh71x4Teil2T7sAHvySrHF9GUQhb70weBB17', // This is your app's application id
      'X-Parse-REST-API-Key': 'WmCXOBwY4neakmZBGU0EiXSg5AMGpwiMo59ufoyM' // This is your app's REST API key
    }
  }

  try {
    const { data } = await axios.get(URL, config)
    return data.results
  } catch (error) {
    alert(error.message)
  }
}

// получаем массив близжайших мест

const getPlaces = async (lag, lng) => {
  const URL = `https://thingproxy.freeboard.io/fetch/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lag},${lng}&radius=1500&key=${API_KEY}`
  try {
    const { data } = await axios.get(URL)
    return data.results
  } catch (error) {
    alert(error.message)
  }
}

// const getPlacesDetails = async (id) => {
//   const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name%2Crating%2Cformatted_phone_number&key=${API_KEY}`

//   const { data } = await axios.get(URL)
//   console.log(data.result)
//   // return data.results
// }

export { getCities, getPlaces }
