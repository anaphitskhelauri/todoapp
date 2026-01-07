import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getTodos, saveTodos } from '../storage/todoStorage';

export default function Modal() {
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [selectedPriority, setSelectedPriority] = useState('Low');
  const router = useRouter();

  const categories = ['Work', 'Personal', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];

  const addTodo = async () => {
    if (!text.trim()) return;

    const todos = await getTodos();
    const newTodo = {
      id: Date.now().toString(),
      title: text,
      done: false,
      category: selectedCategory,
      priority: selectedPriority,
    };

    await saveTodos([...todos, newTodo]);
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New todo..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      {/* Category picker */}
      <View style={styles.row}>
        {categories.map(cat => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.filterButton,
              selectedCategory === cat && styles.filterButtonActive
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory === cat && styles.filterButtonTextActive
            ]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      {/* Priority picker */}
      <View style={styles.row}>
        {priorities.map(p => (
          <Pressable
            key={p}
            onPress={() => setSelectedPriority(p)}
            style={[
              styles.filterButton,
              selectedPriority === p && styles.priorityButtonActive(p)
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              selectedPriority === p && styles.filterButtonTextActive
            ]}>{p}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={addTodo} style={styles.addButton}>
        <Text style={styles.addButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, marginRight: 8, backgroundColor: '#eee' },
  filterButtonActive: { backgroundColor: '#2196F3' },
  filterButtonText: { color: '#000', fontWeight: 'bold' },
  filterButtonTextActive: { color: '#fff' },
  priorityButtonActive: (p) => ({
    backgroundColor: p === 'High' ? '#f44336' : p === 'Medium' ? '#ff9800' : '#4CAF50'
  }),
  addButton: { backgroundColor: '#2196F3', padding: 14, borderRadius: 10 },
  addButtonText: { color: '#fff', textAlign: 'center' },
});
