import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Button, Icon, Input, Header, ListItem } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Watchlist from "./components/WatchList";
import MoviesWatched from "./components/MoviesWatched";
import { Ionicons } from '@expo/vector-icons';
import SearchMovies from './components/SearchMovies';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
   <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Watchlist') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Watched movies') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            else if (route.name === 'Search movies') {
              iconName = focused ? '' : '';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
       <Tab.Screen name="Search movies" component={SearchMovies} />  
       <Tab.Screen name="Watchlist" component={Watchlist} />
       <Tab.Screen name="Watched movies" component={MoviesWatched} />
        
      </Tab.Navigator>
    </NavigationContainer>
      </>

  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
});

