import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { getTodos, saveTodos } from '../storage/todoStorage';
import TodoItem from './components/TodoItem';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [allSort, setAllSort] = useState('Priority');
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  const loadTodos = async () => {
    const storedTodos = await getTodos();
    setTodos(storedTodos);
  };

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [])
  );

  const toggleTodo = async (id) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTodos(updated);
    await saveTodos(updated);
  };

  const deleteTodo = (id) => {
    Alert.alert(
      "Delete Todo",
      "Are you sure you want to delete this todo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updated = todos.filter((t) => t.id !== id);
            setTodos(updated);
            await saveTodos(updated);
          },
        },
      ]
    );
  };

  const editTodo = (id, currentTitle) => {
    Alert.prompt(
      "Edit Todo",
      "Update your todo:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: async (newText) => {
            if (!newText) return;
            const updated = todos.map((t) =>
              t.id === id ? { ...t, title: newText } : t
            );
            setTodos(updated);
            await saveTodos(updated);
          },
        },
      ],
      'plain-text',
      currentTitle
    );
  };

  // Filter by category
  let filteredTodos = todos.filter(t => filterCategory === 'All' || t.category === filterCategory);

  // Sorting
  if (filterCategory === 'All') {
    if (allSort === 'Priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      filteredTodos = filteredTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else if (allSort === 'Date') {
      filteredTodos = filteredTodos.sort((a, b) => b.id - a.id);
    }
  } else {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    filteredTodos = filteredTodos.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  }

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const bgColor = darkMode ? '#121212' : '#fff';
  const textColor = darkMode ? '#fff' : '#000';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: textColor }]}>Your Todo</Text>
        <Pressable onPress={toggleDarkMode} style={styles.modeButton}>
          <MaterialIcons name={darkMode ? "light-mode" : "dark-mode"} size={28} color={textColor} />
        </Pressable>
      </View>

      {/* Category Filter Row */}
      <View style={styles.categoryFilter}>
        {['All', 'Work', 'Personal', 'Other'].map(cat => (
          <Pressable
            key={cat}
            onPress={() => setFilterCategory(cat)}
            style={[
              styles.filterButton,
              filterCategory === cat && { backgroundColor: '#2196F3' }
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              filterCategory === cat && { color: '#fff' }
            ]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {filteredTodos.length === 0 ? (
        <Text style={[styles.emptyText, { color: textColor }]}>Nothing to do yet :)</Text>
      ) : (
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={() => toggleTodo(item.id)}
              onDelete={() => deleteTodo(item.id)}
              onEdit={() => editTodo(item.id, item.title)}
              darkMode={darkMode}
            />
          )}
        />
      )}

      {/* Floating Sort Button: Bottom-Left */}
      {filterCategory === 'All' && (
        <View style={styles.floatingSort}>
          <Pressable
            onPress={() => setAllSort(allSort === 'Priority' ? 'Date' : 'Priority')}
            style={styles.sortButtonFloating}
          >
            <MaterialIcons name="sort" size={24} color="#fff" />
            <Text style={styles.sortButtonText}>{allSort}</Text>
          </Pressable>
        </View>
      )}

      {/* Floating Add Button: Bottom-Right */}
      <Pressable
        onPress={() => router.push('/modal')}
        style={styles.floatingAddButton}
      >
        <Text style={styles.addButtonTextFloating}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  modeButton: { padding: 4 },
  categoryFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginHorizontal: 10,
    marginVertical: 6,
  },
  filterButtonText: { color: '#000', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20 },
  addButtonText: { textAlign: 'center', fontWeight: 'bold' },

  /* Floating Buttons */
  floatingSort: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 10,
    elevation: 10,
  },
  sortButtonFloating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sortButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
  },

  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonTextFloating: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
