import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Home from "./screens/home";
import About from "./screens/about";
import Contact from "./screens/contact";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as firebase from "firebase";
import { firebaseConfig } from "./config";
import { globalStyles } from "./styles/global";

firebase.initializeApp(firebaseConfig);

const BottomTab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <BottomTab.Navigator>
        <BottomTab.Screen name="home" component={Home} />
        <BottomTab.Screen name="about" component={About} />
        <BottomTab.Screen name="contact" component={Contact} />
      </BottomTab.Navigator>
    </NavigationContainer>

    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="home" component={Home} />
    //     <Stack.Screen name="about" component={Projects} />
    //     <Stack.Screen name="contact" component={Account} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default App;
