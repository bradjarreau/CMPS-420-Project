import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './app/Home';
import PreparationAndSafety from './app/PreparationAndSafety';
import Evacuation from './app/Evacuation';
import SignInSignUp from './app/SignInSignUp';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Preparation And Safety') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Evacuation') {
          iconName = focused ? 'alert' : 'alert-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor:
        route.name === 'Home'
          ? '#00CED1'
          : route.name === 'Preparation And Safety'
          ? '#FFD700'
          : '#DC143C',
      tabBarInactiveTintColor: '#888',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        paddingVertical: 10,
      },
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen
      name="Preparation And Safety"
      component={PreparationAndSafety}
    />
    <Tab.Screen name="Evacuation" component={Evacuation} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignInSignUp">
        <Stack.Screen
          name="SignInSignUp"
          component={SignInSignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
