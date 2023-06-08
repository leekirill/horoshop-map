const getData = async () => {
  const response = await fetch(
    'https://parseapi.back4app.com/classes/Ukraine_City?count=1&limit=20&order=-population&keys=name,location,cityId',
    {
      headers: {
        'X-Parse-Application-Id': '3kXINh71x4Teil2T7sAHvySrHF9GUQhb70weBB17', // This is your app's application id
        'X-Parse-REST-API-Key': 'WmCXOBwY4neakmZBGU0EiXSg5AMGpwiMo59ufoyM' // This is your app's REST API key
      }
    }
  )
  const { results } = await response.json() // Here you have the data that you need

  return results
}

export default getData
