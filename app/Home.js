import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const WEATHER_API_KEY = 'e16dfd1432ab457cbfa145441240711'; // WeatherAPI key
const NOAA_TOKEN = 'irjPGkGiJAuuFUiryUdGpGYzWOEGQWMt'; // NOAA API Token

const Home = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [windGust, setWindGust] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [hurricaneInfo, setHurricaneInfo] = useState(null);
  const [forecastPath, setForecastPath] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      fetchWindData(userLocation.coords.latitude, userLocation.coords.longitude);
      fetchHurricaneData();
    })();
  }, []);

  const fetchWindData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`
      );
      const data = await response.json();

      if (data.current) {
        setWindSpeed(data.current.wind_mph);
        setWindGust(data.current.gust_mph);
      } else {
        setWindSpeed("N/A");
        setWindGust("N/A");
        setErrorMsg("Wind data unavailable for this location.");
      }
    } catch (error) {
      setErrorMsg("Unable to fetch wind data.");
    }
  };

  const fetchHurricaneData = async () => {
    try {
      const response = await fetch(
        'https://api.weather.gov/alerts/active?event=Hurricane',
        {
          headers: {
            'User-Agent': 'YourAppName',
            'Accept': 'application/geo+json',
            'Authorization': `Bearer ${NOAA_TOKEN}`
          }
        }
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const hurricane = data.features[0];
        setHurricaneInfo({
          name: hurricane.properties.event,
          location: hurricane.geometry.coordinates,
          description: hurricane.properties.headline,
        });

        fetchForecastPath(hurricane.geometry.coordinates);
      } else {
        setHurricaneInfo({ name: 'No active hurricanes nearby.' });
      }
    } catch (error) {
      console.error("Error fetching hurricane data:", error);
      setHurricaneInfo({ name: 'Unable to fetch hurricane data.' });
    }
  };

  const fetchForecastPath = async (centerCoordinates) => {
    setForecastPath([
      { latitude: centerCoordinates[1], longitude: centerCoordinates[0] },
      { latitude: centerCoordinates[1] + 1, longitude: centerCoordinates[0] + 1 },
      { latitude: centerCoordinates[1] + 2, longitude: centerCoordinates[0] + 2 },
    ]);
  };

  const showAlert = () => {
    Alert.alert("Alert", "Hurricane coming. Please evacuate.");
  };

  useEffect(() => {
    showAlert();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>Hurricane approaching your area in 48 hours</Text>
      </View>

      {location ? (
        <MapView style={styles.map} region={location}>
          <Marker coordinate={location} title="Your Location" pinColor="blue" />
          {hurricaneInfo && hurricaneInfo.location && (
            <Marker
              coordinate={{
                latitude: hurricaneInfo.location[1],
                longitude: hurricaneInfo.location[0],
              }}
              title={hurricaneInfo.name}
              description={hurricaneInfo.description}
              pinColor="red"
            />
          )}
          {forecastPath.length > 0 && (
            <Polyline
              coordinates={forecastPath}
              strokeColor="red"
              strokeWidth={2}
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>{errorMsg || 'Loading map...'}</Text>
      )}

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Current Wind Speed</Text>
          <Text style={styles.infoData}>{windSpeed !== null ? `${windSpeed} mph` : 'Loading...'}</Text>
          <Text style={styles.infoText}>Wind Gusts</Text>
          <Text style={styles.infoData}>{windGust !== null ? `${windGust} mph` : 'Loading...'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Active Tropical Systems Nearby</Text>
          <Text style={styles.infoData}>{hurricaneInfo ? hurricaneInfo.name : 'Loading...'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Preparation And Safety')}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF2D8',
  },
  warningBanner: {
    backgroundColor: '#D32F2F',
    padding: 20,
    alignItems: 'center',
  },
  warningText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  map: {
    flex: 1,
    marginVertical: 10,
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
    marginVertical: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  infoBox: {
    backgroundColor: '#B0BEC5',
    padding: 20,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  infoData: {
    fontSize: 18,
    color: '#1E88E5',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  nextButton: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 20,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default Home;
