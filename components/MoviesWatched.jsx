import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, Button, Alert } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';



const db = SQLite.openDatabase('coursedb.db');

export default function MoviesWatched() {
    const [watchedMovies, setWatchedMovies] = useState([]);

    const updateWatchedList = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM movies_watched;',
                [],
                (_, { rows: { _array } }) => {
                    setWatchedMovies(_array);
                },
                (_, error) => {
                    console.error("Error in fetching watched list: ", error);
                }
            );
        });
    };

    const removeFromWatched = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM movies_watched WHERE id = ?;',
                [id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        // Remove the deleted movie from the state
                        setWatchedMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
                        Alert.alert('Movie removed');
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

    useFocusEffect(
        React.useCallback(() => {
            updateWatchedList();
        }, [])
    );

    return (
        <View style={styles.container}>
            <FlatList
            data={watchedMovies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.listcontainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.year}>{item.year}</Text>
                    <Button title="Delete" onPress={() => removeFromWatched(item.id)} />
                </View>
            )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '90%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    year: {
        fontSize: 16,
    },
    buttonContainer: {
        width: 80, // Button container width
    },
});