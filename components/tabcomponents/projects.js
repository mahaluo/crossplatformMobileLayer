import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SwipeableListView,
  FlatList
} from "react-native";
import { globalStyles } from "../../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "../loading";
import FlatlistProjectItem from '../flatlistProjectItem';
import * as firebase from "firebase";
import "firebase/firestore";

const Projects = (props) => {
  console.log("user passed from home: " + props.user);

  const [refresh, setRefresh] = useState(true);
  const [userProjects, setUserProjects] = useState();
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState(props.user);


  const refreshProjects = () => {
    console.log("project feed refreshing.. ");
    setLoad(true);

    async function refreshFeed() {
      const userList = [];
      console.log("fetching projects for user: " + user);
      const usersProject = await fetch(
        "http://192.168.0.2:3000/user-projects",
        {
          method: "GET",
          headers: {
            user: user,
          },
        }
      );

      const jsonproject = await usersProject.json();
      jsonproject.forEach((projectfound) => {
        userList.push(projectfound.project);
      });
      console.log('projects fetched: ' + userList);
      setUserProjects(userList);
    }

    try {
      refreshFeed().then(() => {
        setTimeout(() => {
          setLoad(false);
        }, 1500);
      });


    } catch (error) {
      console.log(error);
    }
  };


  const deleteItem = (id) => {

    console.log('filtering project list.. ');

    const list = [...userProjects];
    const filteredList = list.filter(item => item.id !== id);
    console.log(filteredList);
    setUserProjects(filteredList);

    async function deleteProject() {
      firebase
      .firestore()
      .collection("projectList")
      .doc("projects")
      .collection(user)
      .doc(id)
      .delete()
      .then(() => {
        console.log("deleted project" + id);
      })
      .catch((err) => {
        console.log(err);
      });
    }

    deleteProject();
  }

  useEffect(() => {
    try {
      refreshProjects();
      setRefresh(false);
    } catch (error) {
      console.log(error);
    }
  }, [refresh]);

  return (
    <View style={{ flex: 1 }}>
      {load ? (
        <Loading />
      ) : (
          <FlatList
            data={userProjects}
            renderItem={({ item }) => (
              <View style={globalStyles.projectCard}>
                <FlatlistProjectItem
                  project={item}
                  user={user} />

                <View style={globalStyles.projectCardFooter}>

                  <View style={globalStyles.projectCreatedAt}>
                    <Text style={globalStyles.smallText}>{item.createdAt}</Text>
                  </View>

                  <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <MaterialIcons
                      style={globalStyles.projectIcon}
                      name="delete-forever"
                      size={30}
                      color="coral"
                    />
                  </TouchableOpacity>

                </View>

              </View>
            )}



          />
        )}
    </View>
  );
};

const styles = StyleSheet.create({
});

export default Projects;
