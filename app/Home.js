import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Screen</Text>

      {}
      <View style={styles.navigationButton}>
        {/* "Next" button to navigate to the Preparation And Safety tab */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Preparation And Safety')}>
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
  navigationButton: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
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

export default Home;
