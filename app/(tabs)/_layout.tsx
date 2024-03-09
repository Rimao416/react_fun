import { StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const Layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
    </Tabs>
  );
};

export default Layout;
