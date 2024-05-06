
// useEffect(() => {
//   db.transaction(tx => {
//     tx.executeSql('create table if not exists watchlist (id integer primary key not null, title text, director text, year int, imdb double);');
//   }, () => console.error("Error when creating DB"), updateList);  
// }, []);

// // Save movie into watchlist
// const saveItem = () => {
//   if (title && director && year && imdb) {
//     db.transaction(tx => {
//         tx.executeSql('insert into watchlist (title, director, year, imdb) values (?, ?, ?, ?);', [parseInt(title), director, year, imdb]);    
//       }, () => console.error("Error in Insert"), updateList
//     )
//   }
//   else {
//     Alert.alert('Error', 'Type title, director, year and imdb first');
//   }
// }

// // Update watchlist
// const updateList = () => {
//   db.transaction(tx => {
//     tx.executeSql('select * from watchlist;', [], (_, { rows }) =>
//       setWatchlist(rows._array)
//     ); 
//     setTitle('');
//     setDirector('');
//     setYear('');
//     setImdb('');
//   });
// }

// // Delete movie
// const deleteItem = (id) => {
//   db.transaction(
//     tx => {
//       tx.executeSql(`delete from watchlist where id = ?;`, [id]);
//     }, null, updateList
//   )    
// }