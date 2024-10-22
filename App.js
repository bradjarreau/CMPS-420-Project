import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './app/Home';
import EvacuationInfo from './app/Evacuation';
import PreparationAndSafety from './app/PreparationAndSafety';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Evacuation Info" component={EvacuationInfo} />
        <Tab.Screen name="Preparation and Safety" component={PreparationAndSafety} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
