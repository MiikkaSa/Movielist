import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import SearchMovies from './SearchMovies';
import { useFocusEffect } from '@react-navigation/native';

const db = SQLite.openDatabase('coursedb.db');

export default function Watchlist() {
    const [movies, setMovies] = useState([]); 
    const [watchedMovies, setWatchedMovies] = useState([]);

    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM watchlist;',
                [],
                (_, { rows: { _array } }) => {
                    setMovies(_array);
                },
                (_, error) => {
                    console.error("Error in fetching watchlist: ", error);
                }
            );
        });
    };

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

    const removeFromWatchlist = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM watchlist WHERE id = ?;',
                [id],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        // Remove the deleted movie from the state
                        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
                        Alert.alert('Movie removed from watchlist');
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

    const markAsWatched = (id, title, year) => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM watchlist WHERE id = ?;', 
                [id],
                (_, deleteResult) => {
                    if (deleteResult.rowsAffected > 0) {
                        tx.executeSql(
                            'INSERT INTO movies_watched (title, year) VALUES (?,?);', 
                            [title, year],
                            (_, insertResult) => {
                                if (insertResult.rowsAffected > 0) {
                                    console.log('Movie marked as watched');
                                    updateList(); // Päivitetään watchlist
                                    updateWatchedList(); // Päivitetään watched movies
                                } else {
                                    console.error('Failed to add movie to watched list');
                                }
                            },
                            (_, error) => {
                                console.error('Error when adding movie to watched list: ', error);
                            }
                        );
                    } else {
                        console.error('Error when deleting movie from watchlist');
                    }
                }
            );
        });
    };
    
    

    useFocusEffect(
        React.useCallback(() => {
            updateList();
            updateWatchedList();
        }, [])
    );

    return (
        <View style={styles.container}>
            {movies.length === 0 ? (
                <Text style={styles.emptyText}>Watchlist is empty</Text>
            ) : (
                <FlatList
                    data={movies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listContainer}>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.year}>{item.year}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button title="Delete" onPress={() => removeFromWatchlist(item.id)} />
                                <Button title="Mark as watched" onPress={() => markAsWatched(item.id, item.title, item.year)} />
                            </View>
                        </View>
                    )}
                />
            )}
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
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '90%',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    year: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 155, // Adjust as needed
    },
});