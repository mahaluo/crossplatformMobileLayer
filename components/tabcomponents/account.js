import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { globalStyles } from "../../styles/global";
import { AntDesign } from "@expo/vector-icons";
import * as firebase from "firebase";

function Account({ navigation }) {

  const [userid, setUserid] = useState();

  useEffect(() => {
    try {
      setUserid(firebase.auth().currentUser.uid);
      console.log('account tab set userid');
    } catch (error) {
      console.log(error);
    }  
  }, [userid])
  
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("account screen signing out user");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View>
      <View style={globalStyles.screenHeader}>
        <Text style={globalStyles.screenHeaderTitle}>account</Text>
      </View>

      <TouchableOpacity
        style={styles.statusContainer}
        onPress={() => handleSignOut()}
      >
        <Text style={styles.statusText}>sign out</Text>
        <AntDesign name="logout" size={24} color="coral" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  statusText: {
    marginRight: 10,
  },
});

export default Account;
