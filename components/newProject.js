import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "./loading";
import { globalStyles } from "../styles/global";


//need to add some type of alert or something that notifies user after creating a new project

//need to move new project to middle layer, it does it in createNewProject function currently

const NewProject = (props) => {

  //new project function, get user id from props
  console.log("user passed from props: " + props.user);

  //use load while setting up content
  const [load, setLoad] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState();
  const [newProjectBody, setNewProjectBody] = useState();

  useEffect(() => {
    
    setTimeout(() => {
      setLoad(false);
    }, 600);

  }, [load])

  //send new project information to firebase
  const createNewProject = () => {
    setLoad(true);

    const newProject = {
      user: props.user,
      title: newProjectTitle,
      body: newProjectBody,
      createdAt: new Date(),
      solved: false,
      shared: false,
    };

    firebase
      .firestore()
      .collection("projectList")
      .doc("projects")
      .collection('users')
      .doc(props.user)
      .collection('userproject')
      .add({
        ...newProject,
      })
      .then(() => {
        console.log("created project");
      })
      .catch((err) => {
        console.log(err);
      });

    setLoad(false);
    setNewProjectTitle("");
    setNewProjectBody("");
  };

  //clear all text boxes 
  const clearNewProjectBody = () => {
    setNewProjectTitle("");
    setNewProjectBody("");
  };

  return (
    <View>
      {load ? <Loading /> : <View style={globalStyles.projectCard}>
        <View style={globalStyles.projectCardHeader}>
          <TextInput
            style={globalStyles.projectTitle}
            placeholder="project title"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(val) => setNewProjectTitle(val)}
            value={newProjectTitle}
          ></TextInput>
        </View>

        <View style={globalStyles.projectCardContent}>
          <TextInput
            placeholder="project description"
            multiline={true}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(val) => setNewProjectBody(val)}
            value={newProjectBody}
          ></TextInput>
        </View>

          <View style={globalStyles.projectIconRow}>
            <TouchableOpacity
              onPress={() => clearNewProjectBody()}
              style={globalStyles.projectIcon}
            >
              <MaterialIcons name="clear" size={40} color="coral" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => createNewProject()}
              style={globalStyles.projectIcon}
            >
              <MaterialIcons name="note-add" size={40} color="coral" />
            </TouchableOpacity>
          </View>
        </View>
      }
      
    </View>
  );
};

export default NewProject;

const styles = StyleSheet.create({});
