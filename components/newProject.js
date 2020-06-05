import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "./loading";

const NewProject = () => {
  const [load, setLoad] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState();
  const [newProjectBody, setNewProjectBody] = useState();
  const [userid, setUserid] = useState();

  useEffect(() => {
    try {
      setUserid(firebase.auth().currentUser.uid);
    } catch (error) {
      console.log(error);
    }
  }, [userid])

  const createNewProject = () => {
    setLoad(true);

    const newProject = {
      title: newProjectTitle,
      body: newProjectBody,
      createdAt: new Date(),
      solved: false,
      shared: false,
    };

    firebase
      .firestore()
      .collection(userid)
      .doc("projectList")
      .collection("projects")
      .add({
        ...newProject,
      })
      .then(() => {
        console.log("created project" + newProject);
      })
      .catch((err) => {
        console.log(err);
      });

    setLoad(false);
    setNewProjectTitle("");
    setNewProjectBody("");
  };

  const clearNewProjectBody = () => {
    setNewProjectTitle("");
    setNewProjectBody("");
  };

  return (
    <View style={styles.newProjectCard}>
      <View>
        <TextInput
          style={styles.newProjectTitle}
          placeholder="project title"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(val) => setNewProjectTitle(val)}
          value={newProjectTitle}
        ></TextInput>

        <View style={styles.newProjectContent}>
          <TextInput
            style={styles.newProjectBody}
            placeholder="project description"
            multiline={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(val) => setNewProjectBody(val)}
            value={newProjectBody}
          ></TextInput>

          <View style={styles.newProjectIcons}>
            <TouchableOpacity
              onPress={() => clearNewProjectBody()}
              style={styles.newProjectIconStyles}
            >
              <MaterialIcons name="clear" size={40} color="coral" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => createNewProject()}
              style={styles.newProjectIconStyles}
            >
              <MaterialIcons name="note-add" size={40} color="coral" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NewProject;

const styles = StyleSheet.create({
  newProjectCard: {
    marginHorizontal: 30,
    marginVertical: 30,
  },
  newProjectContent: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: "center",
    minHeight: 300,
  },
  newProjectIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  newProjectTitle: {
    width: 300,
    borderBottomColor: "coral",
    borderBottomWidth: 1,
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    paddingTop: 20,
  },
  newProjectBody: {
    minHeight: 300,
    width: 300,
    borderColor: "coral",
    borderWidth: 1,
    alignSelf: "center",
    paddingTop: 40,
    textAlign: "center",
  },
  newProjectIconStyles: {
    padding: 20,
  },
  newProjectLoad: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignSelf: "center",
  },
});
