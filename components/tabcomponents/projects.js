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
import Swipeable from "react-native-gesture-handler/Swipeable";
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

    console.log('deleting project.. ');

    async function deleteProject() {
      firebase
      .firestore()
      .collection("projectList")
      .doc("projects")
      .collection(props.user)
      .doc(id)
      .delete()
      .then(() => {
        console.log("deleted project " + id);
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
            <View>
              <Swipeable
                renderLeftActions={deleteItem(item.id)}>
              
                <FlatlistProjectItem
                project={item} 
                user={user}/>

              </Swipeable>
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
