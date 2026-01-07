import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TODOS';

export const getTodos = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTodos = async (todos) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};
