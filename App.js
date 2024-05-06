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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const db = SQLite.openDatabase('coursedb.db');
const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS watchlist (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT,
                year INTEGER
            )`,
            [],
            () => {
                console.log("Table 'watchlist' created successfully.");
            },
            (_, error) => {
                console.error("Error when creating 'watchlist' table: ", error);
            }
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS movies_watched (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT,
                year INTEGER
            )`,
            [],
            () => {
                console.log("Table 'movies_watched' created successfully.");
            },
            (_, error) => {
                console.error("Error when creating 'movies_watched' table: ", error);
            }
        );
    });
}, []);
  return (
    <>
   <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Watchlist') {
              iconName = focused ? 'movie-open-play' : 'movie-open-play-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Watched movies') {
              iconName = focused ? 'movie-check' : 'movie-check-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === 'Search movies') {
              iconName = focused ? 'movie-search' : 'movie-search-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        }}
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
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    alignItems: 'center'
  },
});

