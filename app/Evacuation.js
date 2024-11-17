import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import axios from 'axios';

const Evacuation = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearbyShelters, setNearbyShelters] = useState([]);
  const [newShelter, setNewShelter] = useState({ name: '', address: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shelterToDelete, setShelterToDelete] = useState(null);
  const [manualShelters, setManualShelters] = useState([]); // Stores manually added shelters

  const predefinedShelters = [
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
    const nearby = predefinedShelters.filter((shelter) => {
      const distance = calculateDistance(location.latitude, location.longitude, shelter.latitude, shelter.longitude);
      return distance <= maxDistance;
    });

    // Combine manually added shelters with nearby predefined shelters
    setNearbyShelters([...manualShelters, ...nearby]);
    Alert.alert("Nearby Shelters Found", `${nearby.length} nearby shelter(s) found within ${maxDistance} miles.`);
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

  const fetchCoordinates = async () => {
    if (!newShelter.address) {
      Alert.alert("Missing Address", "Please enter an address or location name.");
      return;
    }

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${newShelter.address}&key=997f6cfa74a749ce97ee72e357555da1`);
      const { lat, lng } = response.data.results[0].geometry;
      addShelter(lat, lng, newShelter.name || 'New Shelter'); // Call addShelter with coordinates and name
    } catch (error) {
      Alert.alert("Error", "Unable to find location. Please check the address and try again.");
    }
  };

  const addShelter = (latitude, longitude, name) => {
    const shelter = {
      id: Date.now(),
      name: name || 'My Current Location', 
      latitude,
      longitude,
    };
    setManualShelters((prevShelters) => [...prevShelters, shelter]);
    setNearbyShelters((prevShelters) => [...prevShelters, shelter]); // Add to displayed shelters
    setNewShelter({ name: '', address: '' });
    Alert.alert("Shelter Added", `${shelter.name} has been added.`);
  };

  const saveCurrentLocationAsShelter = () => {
    if (location) {
      const shelterName = newShelter.name.trim() ? newShelter.name : 'My Current Location';
      addShelter(location.latitude, location.longitude, shelterName);
    } else {
      Alert.alert("Location Unavailable", "Please enable location services.");
    }
  };

  const openDeleteModal = (id) => {
    setShelterToDelete(id);
    setIsModalVisible(true);
  };

  const deleteShelter = () => {
    setManualShelters((prevShelters) => prevShelters.filter(shelter => shelter.id !== shelterToDelete));
    setNearbyShelters((prevShelters) => prevShelters.filter(shelter => shelter.id !== shelterToDelete));
    setIsModalVisible(false);
    setShelterToDelete(null);
    Alert.alert("Shelter Deleted", "The shelter has been removed.");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        <View style={styles.addShelterForm}>
          <Text style={styles.formText}>Add a New Shelter</Text>
          <TextInput
            style={styles.input}
            placeholder="Shelter Name"
            value={newShelter.name}
            onChangeText={(text) => setNewShelter({ ...newShelter, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={newShelter.address}
            onChangeText={(text) => setNewShelter({ ...newShelter, address: text })}
          />
          <TouchableOpacity style={styles.addButton} onPress={fetchCoordinates}>
            <Text style={styles.addButtonText}>Add Shelter by Address</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={saveCurrentLocationAsShelter}>
            <Text style={styles.addButtonText}>Save My Current Location as Shelter</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.shelterList}>
          {nearbyShelters.map((shelter) => (
            <View key={shelter.id} style={styles.shelterItem}>
              <TouchableOpacity onPress={() => openDirectionsToShelter(shelter)}>
                <Text style={styles.shelterText}>{shelter.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openDeleteModal(shelter.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Delete Shelter</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete this shelter?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonDelete} onPress={deleteShelter}>
                <Text style={styles.modalButtonText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setIsModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: 'blue' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.navigationButtons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Preparation And Safety')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#DFF2D8',
    paddingHorizontal: 20,
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
  addShelterForm: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  formText: {
    fontSize: 18,
    color: '#2D5F2E',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  addButton: {
    backgroundColor: '#2D5F2E',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  shelterList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  shelterItem: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shelterText: {
    color: '#333',
    fontSize: 16,
  },
  deleteText: {
    color: 'red',
    fontSize: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DFF2D8',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonDelete: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default Evacuation;
