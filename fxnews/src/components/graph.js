import React, { useState, useEffect } from 'react';
import {
  Alert,
} from 'react-native';
import axios from 'axios';
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart';

const GraphComponent = ({ url }) => {
  const [chartData, setChartData] = useState([]);

  const transformCurrencyData = (currencyData) => {
    return Object.keys(currencyData)
      .slice(0, 10)
      .map((timestamp, index) => ({
        x: index,
        y: parseFloat(currencyData[timestamp]['4. close']),
      }));
  };

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const responses = await axios.get(url);
        const data = responses.data['Time Series FX (60min)'];
        setChartData(transformCurrencyData(data));
      } catch (error) {
        console.error('Error fetching currency data:', error.message);
        Alert.alert('Алдаа гарлаа', 'Ханшийн мэдээлэл татаж чадсангүй.');
      }
    };

    if (url) {
      fetchCurrencyData();
    }
  }, [url]);

  if (chartData && chartData?.length === 0) {
    return null
  }

  return (
    <Chart
    style={{ height: 50, width: 100 }}
    data={chartData}
    padding={{ left: 0, top: 0, bottom: 0, right: 0 }}
    xDomain={{ min: 0, max: chartData.length - 1 }}
    yDomain={{
      min: Math.min(...chartData.map((d) => d.y)),
      max: Math.max(...chartData.map((d) => d.y)),
    }}
  >
    <Line theme={{ stroke: { color: '#44bd32', width: 2 } }} />
  </Chart>
  );
};

export default GraphComponent;
