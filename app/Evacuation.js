import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Evacuation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Evacuation Information</Text>

      {}
      <View style={styles.navigationButtons}>
        {/* "Back" button to navigate to PreparationAndSafety tab */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Preparation And Safety')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        {/* "Next" button to navigate to Home tab */}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    color: '#2D5F2E',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20,
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
