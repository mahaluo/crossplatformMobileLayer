import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from "react-native";
import { globalStyles } from "../../../styles/global";

//account screen, needs component that shows users credentials and let them update it
//needs component that shows how many ratings a user has
//ratings needs to be set up in firebase also

const Account = (props) => {

  const [user, setUser] = useState(props.user);

  return (
    <ScrollView>
      <View style={styles.userCredentialsContainer}>
        <Text style={styles.credentialText}>Email: {user}</Text>
        <Text style={styles.credentialText}>Comments: not added yet</Text>
        <Text style={styles.credentialText}>Projects: not added yet</Text>
        <Text style={styles.credentialText}>Projects solved: not added yet</Text>
        <Text style={styles.credentialText}>Projects shared: not added yet</Text>
      </View>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userCredentialsContainer: {
    minHeight: 200,
    width: 300,
    marginTop: 50,
    padding: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'coral',
    borderRadius: 10,
  },
  credentialText: {
    textAlign: 'center',
    padding: 10,
  }
});

export default Account;
