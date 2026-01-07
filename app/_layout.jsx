import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Todo App' }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', title: 'Add Todo' }}
      />
    </Stack>
  );
}
