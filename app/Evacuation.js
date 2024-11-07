import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';

const Evacuation = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyShelters, setNearbyShelters] = useState([]); 

  const shelters = [
    { id: 1, name: 'Lamar Dixon', latitude: 30.2173, longitude: -90.9402 },
    { id: 2, name: 'St. Joseph Catholic Church', latitude: 30.4515, longitude: -91.1871 },
    { id: 3, name: 'Hilton Inn', latitude: 30.4418, longitude: -91.1882 },
    { id: 4, name: 'First Baptist Church', latitude: 30.4507, longitude: -91.1546 },
    { id: 5, name: 'Florida Parishes Arena', latitude: 30.6312, longitude: -90.5216 },
    { id: 6, name: 'Amite Community Center', latitude: 30.7344, longitude: -90.5101 },
    { id: 7, name: 'Walker High School', latitude: 30.4899, longitude: -90.8618 },
    { id: 8, name: 'Covington High School', latitude: 30.4984, longitude: -90.1045 },
    { id: 9, name: 'Fontainebleau High School', latitude: 30.3983, longitude: -90.0656 },
    { id: 10, name: 'Baton Rouge River Center', latitude: 30.4465, longitude: -91.1871 },
    { id: 11, name: 'Broadmoor High School', latitude: 30.4535, longitude: -91.0835 },
  ];

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
    })();
  }, []);

  const findNearestShelters = () => {
    if (!location) return;

    const maxDistance = 100;
    const nearby = shelters.filter((shelter) => {
      const distance = calculateDistance(location.latitude, location.longitude, shelter.latitude, shelter.longitude);
      return distance <= maxDistance;
    });

    if (nearby.length > 0) {
      setNearbyShelters(nearby);
      Alert.alert("Nearby Shelters Found", `${nearby.length} shelter(s) found within ${maxDistance} miles.`);
    } else {
      Alert.alert("No Nearby Shelters", `No shelters found within ${maxDistance} miles.`);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 0.621371;
  };

  const openDirectionsToShelter = (shelter) => {
    const url = `maps://?daddr=${shelter.latitude},${shelter.longitude}&dirflg=d`;
    Linking.openURL(url);
  };

  const findMyLocation = () => {
    if (location) {
      setLocation({
        ...location,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      Alert.alert("Location Centered", "The map has been centered to your current location.");
    } else {
      Alert.alert("Location Not Available", "Unable to retrieve your current location.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Evacuation and Shelter Info</Text>

      {location ? (
        <MapView style={styles.map} region={location}>
          <Marker coordinate={location} title="You Are Here" pinColor="blue" />
          {nearbyShelters.map((shelter) => (
            <Marker
              key={shelter.id}
              coordinate={{ latitude: shelter.latitude, longitude: shelter.longitude }}
              title={shelter.name}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>{errorMsg || 'Loading map...'}</Text>
      )}

      <TouchableOpacity style={styles.findShelterButton} onPress={findNearestShelters}>
        <Text style={styles.findShelterButtonText}>Find Emergency Shelter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.findMyLocationButton} onPress={findMyLocation}>
        <Text style={styles.findMyLocationButtonText}>Find My Location</Text>
      </TouchableOpacity>

      <ScrollView style={styles.shelterList}>
        {nearbyShelters.map((shelter) => (
          <TouchableOpacity
            key={shelter.id}
            style={styles.shelterItem}
            onPress={() => openDirectionsToShelter(shelter)}
          >
            <Text style={styles.shelterText}>{shelter.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Preparation And Safety')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF2D8',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  text: {
    fontSize: 24,
    color: '#2D5F2E',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  map: {
    height: 200,
    marginVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
    marginVertical: 20,
  },
  findShelterButton: {
    backgroundColor: '#4A4A4A',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  findShelterButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  findMyLocationButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  findMyLocationButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  shelterList: {
    flexGrow: 0,
  },
  shelterItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  shelterText: {
    color: '#333',
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default Evacuation;
