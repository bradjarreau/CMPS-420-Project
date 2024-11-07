import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const API_KEY = 'e16dfd1432ab457cbfa145441240711'; // WeatherAPI key

const Home = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);// Current Wind Speed
  const [windGust, setWindGust] = useState(null); // Wind Gusts
  const [errorMsg, setErrorMsg] = useState(null);

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
    })();
  }, []);

  const fetchWindData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`
      );
      const data = await response.json();

      if (data.current) {
        const currentWindSpeed = data.current.wind_mph; //Wind speed data
        const currentWindGust = data.current.gust_mph; // Wind gust data
        setWindSpeed(currentWindSpeed);
        setWindGust(currentWindGust);
      } else {
        console.warn("Wind data not found in the API response");
        setWindSpeed("N/A");
        setWindGust("N/A");
        setErrorMsg("Wind data unavailable for this location.");
      }
    } catch (error) {
      console.error("Error fetching wind speed data:", error);
      setErrorMsg("Unable to fetch wind data.");
    }
  };

  const showAlert = () => {
    Alert.alert("Alert", "Hurricane coming. Please evacuate.");
  };

  useEffect(() => {
    showAlert();
  }, []);

  return (
    <View style={styles.container}>
      {/* Warning Banner */}
      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>Hurricane approaching your area in 48 hours</Text>
      </View>

      {/* Map View */}
      {location ? (
        <MapView style={styles.map} region={location}>
          <Marker coordinate={location} title="Your Location" pinColor="blue" />
        </MapView>
      ) : (
        <Text style={styles.loadingText}>{errorMsg || 'Loading map...'}</Text>
      )}

      {/* Information Boxes */}
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Current Wind Speed</Text>
          <Text style={styles.infoData}>{windSpeed !== null ? `${windSpeed} mph` : 'Loading...'}</Text>
          <Text style={styles.infoText}>Wind Gusts</Text>
          <Text style={styles.infoData}>{windGust !== null ? `${windGust} mph` : 'Loading...'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Hurricane Category</Text>
          <Text style={styles.infoData}>Category 1</Text>
        </View>
      </View>

      {/* Next Button */}
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
