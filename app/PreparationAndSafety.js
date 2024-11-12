import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import * as Progress from 'react-native-progress';

const PreparationAndSafety = ({ navigation }) => { 
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, name: 'Batteries', checked: false, isUserAdded: false },
    { id: 2, name: 'Water', checked: false, isUserAdded: false },
    { id: 3, name: 'Food', checked: false, isUserAdded: false },
    { id: 4, name: 'Gas', checked: false, isUserAdded: false },
    { id: 5, name: 'Important Documents', checked: false, isUserAdded: false },
    { id: 6, name: 'Cash', checked: false, isUserAdded: false },
    { id: 7, name: 'Portable Chargers', checked: false, isUserAdded: false },
    { id: 8, name: 'Where to go in case of evacuation', checked: false, isUserAdded: false },
    { id: 9, name: 'Medications', checked: false, isUserAdded: false },
    { id: 10, name: 'NOAA Weather Radio', checked: false, isUserAdded: false },
    { id: 11, name: 'Flashlights with extra batteries', checked: false, isUserAdded: false },
    { id: 12, name: 'Blankets or sleeping bags', checked: false, isUserAdded: false },
    { id: 13, name: 'Emergency contacts list', checked: false, isUserAdded: false },
    { id: 14, name: 'First aid kit', checked: false, isUserAdded: false },
  ]);

  const [newItem, setNewItem] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

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

  // Function to add a new item to the checklist
  const addNewItem = () => {
    if (newItem.trim() === '') {
      alert("Please enter an item name.");
      return;
    }

    setChecklistItems(prevItems => [
      ...prevItems,
      { id: Date.now(), name: newItem.trim(), checked: false, isUserAdded: true },
    ]);
    setNewItem('');
  };

  const confirmDeleteItem = (id) => {
    setSelectedItemId(id);
    setModalVisible(true);
  };

  // Function to delete an item
  const deleteItem = () => {
    setChecklistItems(prevItems => prevItems.filter(item => item.id !== selectedItemId));
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/*Progress Bar */}
        <View style={styles.headerContainer}>
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

        {/* Checklist Items */}
        {checklistItems.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.itemTextContainer}>
              <Text style={[styles.itemText, item.checked && styles.checkedItem]}>{item.name}</Text>
              <Text style={styles.checkmark}>{item.checked ? '✔️' : '➡️'}</Text>
            </TouchableOpacity>
            {item.isUserAdded && (
              <TouchableOpacity onPress={() => confirmDeleteItem(item.id)}>
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Input to Add New Item */}
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a new item..."
            value={newItem}
            onChangeText={setNewItem}
          />
          <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Evacuation')}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Delete Confirmation */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Item</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this item?</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity onPress={deleteItem} style={styles.modalDeleteButton}>
                <Text style={styles.modalDeleteButtonText}>Yes, Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelButton}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF2D8',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#DFF2D8',
  },
  scrollContent: {
    paddingBottom: 20,
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
    marginHorizontal: 15,
  },
  itemTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
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
  deleteText: {
    fontSize: 18,
    color: 'red',
    paddingLeft: 10,
  },
  addItemContainer: {
    flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  marginVertical: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderColor: '#DDD',
    borderWidth: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#3B7A3E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalDeleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  modalDeleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  modalCancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PreparationAndSafety;
