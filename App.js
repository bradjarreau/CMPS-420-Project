import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './app/Home';
import PreparationAndSafety from './app/PreparationAndSafety';
import Evacuation from './app/Evacuation';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'PreparationAndSafety') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'Evacuation') {
              iconName = focused ? 'alert' : 'alert-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor:
            route.name === 'Home'
              ? '#00CED1' // Dark Turquoise for Home tab
              : route.name === 'PreparationAndSafety'
              ? '#FFD700' // Gold for Preparation and Safety tab
              : '#DC143C', // Crimson Red for Evacuation tab
          tabBarInactiveTintColor: '#888', 
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            paddingVertical: 10,
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="PreparationAndSafety" component={PreparationAndSafety} />
        <Tab.Screen name="Evacuation" component={Evacuation} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
