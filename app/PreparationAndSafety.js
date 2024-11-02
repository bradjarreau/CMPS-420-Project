import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as Progress from 'react-native-progress';

const PreparationAndSafety = ({ navigation }) => {
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, name: 'Batteries', checked: false },
    { id: 2, name: 'Water', checked: false },
    { id: 3, name: 'Food', checked: false },
    { id: 4, name: 'Gas', checked: false },
    { id: 5, name: 'Important Documents', checked: false },
    { id: 6, name: 'Cash', checked: false },
    { id: 7, name: 'Portable Chargers', checked: false },
    { id: 8, name: 'Where to go in case of evacuation', checked: false },
    { id: 9, name: 'Medications', checked: false },
    { id: 10, name: 'NOAA Weather Radio', checked: false },
    { id: 11, name: 'Flashlights with extra batteries', checked: false },
    { id: 12, name: 'Blankets or sleeping bags', checked: false },
    { id: 13, name: 'Emergency contacts list', checked: false },
    { id: 14, name: 'First aid kit', checked: false },
  ]);

  // Function to calculate progress
  const calculateProgress = () => {
    const totalItems = checklistItems.length;
    const checkedItems = checklistItems.filter(item => item.checked).length;
    return checkedItems / totalItems;
  };

  // Function to calculate and format percentage completed
  const calculatePercentage = () => {
    const totalItems = checklistItems.length;
    const checkedItems = checklistItems.filter(item => item.checked).length;
    return Math.round((checkedItems / totalItems) * 100);
  };

  // Toggle function to check/uncheck items
  const toggleCheck = (id) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      {/*Header with Progress Bar */}
      <View style={styles.fixedHeader}>
        <Text style={styles.header}>Preparation & Safety Recommendations</Text>
        <Text style={styles.subheader}>Checklist of Emergency Supplies</Text>
        <Progress.Bar
          progress={calculateProgress()}
          width={null}
          color="#4A4A4A"
          height={10}
        />
        <Text style={styles.percentageText}>{calculatePercentage()}% Completed</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {checklistItems.map(item => (
          <TouchableOpacity key={item.id} onPress={() => toggleCheck(item.id)} style={styles.itemContainer}>
            <Text style={[styles.itemText, item.checked && styles.checkedItem]}>{item.name}</Text>
            <Text style={styles.checkmark}>{item.checked ? '✔️' : '➡️'}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Evacuation')}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF2D8', 
  },
  fixedHeader: {
    backgroundColor: '#DFF2D8', 
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 165, 
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5F2E',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B7A3E',
    marginBottom: 10,
    textAlign: 'center',
  },
  percentageText: {
    fontSize: 16,
    color: '#2D5F2E',
    textAlign: 'center',
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  checkedItem: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkmark: {
    fontSize: 18,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
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

export default PreparationAndSafety;
