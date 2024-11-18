import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from 'components/Container';

import styles from './styles.module.scss';

const API_URL = import.meta.env.VITE_API_URL

const Home = () => {
  const [data, setData] = useState([]);
  const [counter, setCounter] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + '/pollution-history');
      setData(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const checkWaterQualityIndex = async () => {
    if (data?.sensor_data) {
      if (data?.sensor_data?.water_quality_index < 55) {
        // toast.error("Warning! The fish in Phewa Lake are starting to complain 🐟.")
      }
    }
  }

  useEffect(() => {
    fetchData();
    checkWaterQualityIndex();
  }, []);

  const handleClick = useCallback(() => {
    setCounter(counter+1);
    if(counter >= 2) {
      toast.info("We recommend boating with an umbrella today ☂️");
      setCounter(0);
    }
  }, [counter]);

  const WeatherCard = () => {
    const {weather_data} = data;
    return (
      <div className={styles.card} onClick={handleClick}>
        <div className={styles.content}>
          <span className={styles.title}>
            {weather_data?.main?.temp ? (weather_data?.main?.temp-273).toFixed(2) : '-'} 
            <span className={styles.degree}>&#8451;</span>
          </span>
          <div className={styles.description}>
            <div>
              <span>Feels like</span>
              <span>
                {weather_data?.main?.feels_like ? (weather_data?.main?.feels_like-273).toFixed(2) : '-'} 
                <span className={styles.degree}>&#8451;</span>
              </span>
            </div>
            <div>
              <span>Wind Speed</span>
              <span>{weather_data?.wind?.speed || '-'}</span>
            </div>
            <div>
              <span>Wind Direction</span>
              <span>{weather_data?.wind?.deg || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const PollutionCard = () => {
    const {sensor_data} = data;
    return (
      <div className={styles.card}>
        <div className={styles.content}>
        <div className={styles.pollution}>
          <span className={styles.title}>{sensor_data?.air_quality_index}</span>
        </div>
        <div className={styles.description}>
          <div>
            <span>Tempreature</span>
            <span>{sensor_data?.temperature.toFixed(2) || '-'}</span>
          </div>
          <div>
            <span>Water Quality Index</span>
            <span>{sensor_data?.water_quality_index  || '-'}</span>
          </div>
          <div>
            <span>PH Level</span>
            <span>{sensor_data?.ph_level.toFixed(1)  || '-'}</span>
          </div>
        </div>
        </div>
      </div>
    );
  }
  const PollutionTrend = () => {
    const {pollution_history} = data;
    return (
      <div className={styles.card}>
      </div>
    );
  }
  return (
    <Container>
      <div className={styles.header}>
        <h1>Dashboard:</h1>
        <h2>Pokhara</h2>
      </div>
      <div className={styles.content}>
        <WeatherCard />
        <PollutionCard/>
      </div>
      <PollutionTrend/>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
      />
    </Container>
  );
}

export default Home;
