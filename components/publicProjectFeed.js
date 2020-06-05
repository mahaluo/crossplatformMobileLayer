import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

function PublicProjectFeed({ projects }) {
  const [projectList, setProjectList] = useState(projects);

  return (
    <View style={globalStyles.screenHeader}>
      <Text style={globalStyles.screenHeaderTitle}> dashboard </Text>

      {projectList &&
        projectList.map((project) => {
          return (
            <View style={styles.projectCard} key={project.id}>
              <View style={styles.projectCardHeader}>
                <Text style={styles.projectTitle}>{project.title}</Text>
              </View>

              <View style={styles.projectCardContent}>
                <Text>{project.body}</Text>
              </View>

              <View style={styles.projectIconColumn}>
                <TouchableOpacity
                  onPress={() => {
                    deletePost(project.id);
                  }}
                >
                  <MaterialIcons name="delete" size={40} color="coral" />
                </TouchableOpacity>
              </View>

              <View style={styles.projectCardFooter}>
                <Text style={styles.projectCreated}>
                  {moment(project.createdAt.toDate()).calendar()}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  boxOne: {
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "coral",
    borderBottomWidth: 2,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 10,
  },
  statusIcons: {
    padding: 10,
  },
  statusText: {
    marginRight: 10,
  },
  dashboardContainer: {
    flex: 1,
    alignItems: "center",
  },
  projectCard: {
    borderColor: "coral",
    borderWidth: 2,
    marginHorizontal: 30,
    marginVertical: 30,
  },
  projectCardContent: {
    minHeight: 300,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  projectCardHeader: {
    minHeight: 20,
    paddingTop: 16,
  },
  projectTitle: {
    alignSelf: "center",
    fontSize: 20,
  },
  projectCardFooter: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 30,
    flexDirection: "row",
  },
  projectCreated: {
    color: "#333",
    fontSize: 15,
  },
});

export default PublicProjectFeed;
