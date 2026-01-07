import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const priorityColors = { High: '#f44336', Medium: '#ff9800', Low: '#4CAF50' };

  return (
    <View style={[styles.container, { borderLeftColor: priorityColors[todo.priority] || '#4CAF50' }]}>
      <View style={styles.row}>
        <Pressable onPress={onToggle} style={{ flex: 1 }}>
          <Text style={[styles.text, todo.done && styles.doneText]}>{todo.title}</Text>
          <Text style={styles.subText}>{todo.category} • {todo.priority}</Text>
        </Pressable>

        <View style={styles.icons}>
          <Pressable onPress={onDelete} style={{ marginRight: 16 }}>
            <MaterialIcons name="delete" size={24} color="red" />
          </Pressable>
          <Pressable onPress={onEdit}>
            <MaterialIcons name="edit" size={24} color="#2196F3" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  text: { fontSize: 16 },
  doneText: { textDecorationLine: 'line-through' },
  subText: { fontSize: 12, color: '#777', marginTop: 2 },
  icons: { flexDirection: 'row', alignItems: 'center' },
});
