import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import SearchMovies from './SearchMovies';

const db = SQLite.openDatabase('coursedb.db');

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        updateList();
    }, []);
    console.log("Watchlist data:", watchlist); 
    

    const updateList = () => {
        try {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM watchlist;',
                    [],
                    (_, { rows: { _array } }) => {
                        console.log("_array:", _array);
                        setWatchlist(_array);
                    },
                    (_, error) => {
                        console.error("Error in fetching watchlist: ", error);
                    }
                );
            });
        } catch (error) {
            console.error("Error in database transaction: ", error);
        }
    };
    

    const removeFromWatchlist = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM watchlist WHERE id = ?;',
                [id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        Alert.alert('Movie removed from watchlist');
                        updateList();
                    } else {
                        Alert.alert('Error', 'Failed to remove movie from watchlist');
                    }
                },
                (_, error) => {
                    console.error("Error in deleting movie: ", error);
                }
            );
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={watchlist}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.Title}</Text>
                        <Text>{item.Year}</Text>
                        <Text>{item.imdbID}</Text>
                        <Button title="Delete" onPress={() => removeFromWatchlist(item.id)} />
                    </View>
                )}
            />
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
