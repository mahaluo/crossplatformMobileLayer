import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import NewProject from "../components/newProject";
import ProjectFeed from "../components/projectFeed";
import Loading from "../components/loading";
function Projects() {
  const [refresh, setRefresh] = useState(true);
  const [newProjectForm, setNewProjectForm] = useState(false);
  const [load, setLoad] = useState(false);

  return (
    <View style={styles.projectsContainer}>
      <View style={globalStyles.screenHeader}>
        {load ? (
          <Loading />
        ) : (
          <Text style={globalStyles.screenHeaderTitle}>my projects</Text>
        )}
      </View>

      <View style={styles.headerIconRow}>
        {newProjectForm ? (
          <TouchableOpacity onPress={() => setNewProjectForm(false)}>
            <MaterialIcons
              style={styles.headerIcons}
              name="arrow-back"
              size={40}
              color="coral"
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={() => setNewProjectForm(true)}>
          <MaterialIcons
            name="add-circle-outline"
            size={40}
            color="coral"
            style={styles.headerIcons}
          />
        </TouchableOpacity>
      </View>

      {newProjectForm ? (
        <View>
          <NewProject />
        </View>
      ) : (
        <View style={styles.projectFeed}>
          <ProjectFeed refresh={refresh} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  projectsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerIconRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
  },
  headerIcons: {
    margin: 10,
  },
  projectFeed: {
    marginHorizontal: 16,
  },
});

export default Projects;
