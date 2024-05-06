import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Button, Icon, Input, Header, ListItem } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Watchlist from "./components/WatchList";
// import MoviesWatched from "./components/MoviesWatched";
import { Ionicons } from '@expo/vector-icons';

const db = SQLite.openDatabase('coursedb.db');

export default function SearchMovies() {
  const [keyword, setKeyword] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = () => {
    setLoading(true);
    fetch(`http://www.omdbapi.com/?apikey=b7965ce2&s=${keyword}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error in fetch: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.Search) {
          setMovies(data.Search);
        } else {
          setMovies([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const addToWatchlist = (movie) => {
    if (movie.Title && movie.Year) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO watchlist(title, year) VALUES(?, ?);',
          [movie.Title, movie.Year, movie.imdbID],
          (_, result) => {
            if (result.rowsAffected > 0) {
              Alert.alert('Movie added to watchlist!');
            } else {
              Alert.alert('Error', 'Failed to add movie to watchlist');
            }
          }
        );
      }, (error) => console.error("Error in insert", error));
    } else {
      Alert.alert('Error', 'Could not add movie information');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder='Enter movie title'
        value={keyword}
        onChangeText={text => setKeyword(text)} />
      <Button title='Search' onPress={fetchMovies} />
      <View style={{ flex: 6 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item, index) => item.imdbID}
            renderItem={({ item }) => (
              <View>
                <Text>{item.Title} </Text>
                <Text>{item.Year}</Text>
                <Text>{item.imdbID}</Text>
                <Button
                  title="Add to watchlist"
                  onPress={() => addToWatchlist(item)}
                />
              </View>
            )} />
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 0,
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
