import React, { useState, useEffect } from "react"
import {useFormState} from 'react-use-form-state'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const [data, setData] = useState({})
  const [error, setError] = useState()
  const [newQuery, setNewQuery] = useState(``)
  const [city, setCity] = useState()
  const [zipCode, setZipCode] = useState()
  const [coordinates, coordinatesForm] = useFormState()
  const [currentPosition, setCurrentPosition] = useState({})
  const [recentSearches, setRecentSearches] = useState([])

  function locationSuccess(position) {
    const latitude  = position.coords.latitude
    const longitude = position.coords.longitude
    setCurrentPosition({latitude, longitude})
  }

  function locationError() {
    alert('Unable to retrieve your location')
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
  } else {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError)
  }

  console.log(coordinates)
  console.log(`new query is ${newQuery}`)

  useEffect(() => {
    const fetchData = async () => {
      if (newQuery === 'city') {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},US&units=imperial&APPID=1e27bc4aba797f72503f9b125be36e4b`)
        if (result.ok) {
          const data = await result.json()
          setData(data)
          setNewQuery(``)
        } else {
          setError('API Request failed')
        }
      }

      if (newQuery === 'coordinates') {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.values.latitude}&lon=${coordinates.values.longitude}&units=imperial&APPID=1e27bc4aba797f72503f9b125be36e4b`)
        if (result.ok) {
          const data = await result.json()
          setData(data)
          setNewQuery(``)
        } else {
          setError('API Request failed')
        }
      }

      if (newQuery === 'zip') {
        const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},US&units=imperial&APPID=1e27bc4aba797f72503f9b125be36e4b`)
        if (result.ok) {
          const data = await result.json()
          setData(data)
          setNewQuery(``)
        } else {
          setError('API Request failed')
        }
      }

      if (Object.entries(currentPosition).length === 0 || Object.entries(data).length > 0) return

      const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${currentPosition.latitude}&lon=${currentPosition.longitude}&units=imperial&APPID=1e27bc4aba797f72503f9b125be36e4b`)
      if (result.ok) {
        const data = await result.json()
        setData(data)
      } else {
        setError('API Request failed')
      }
    
    }

    fetchData()
  }, [currentPosition, newQuery])


  return (
    <Layout>
      <SEO title="Home" />
      <h1>Check the weather!</h1>
      <div className="query">
        <label htmlFor="city">City: </label>
        <input type="text" onBlur={(e) => setCity(e.target.value)} />
        <button onClick={(e) => {e.preventDefault(); setNewQuery(`city`)}}>Submit</button>
      </div>
      <div className="query">
        <label htmlFor="zip">Zip Code: </label>
        <input type="text" onBlur={(e) => setZipCode(e.target.value)} />
        <button onClick={(e) => {e.preventDefault(); setNewQuery(`zip`)}}>Submit</button>
      </div>
      <form className="query coordinates-form">
        <label htmlFor="latitude">Latitude: </label>
        <input required {...coordinatesForm.number('latitude')} />
        <label htmlFor="longitude">Longitude: </label>
        <input required {...coordinatesForm.number('longitude')} />
        <button onClick={(e) => { e.preventDefault(); setNewQuery(`coordinates`)}}>Submit</button>
      </form>
      {data.main && 
        <div className="weather-data">
          <h2>Current Weather for {data.name}</h2>
          <p>Temperature: {data.main.temp}</p>
          <p>Humidity: {data.main.humidity}</p>
          <p>Pressure: {data.main.pressure}</p>
        </div>
      }
    </Layout>
  )
}

export default IndexPage
