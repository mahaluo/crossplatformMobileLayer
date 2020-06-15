import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from "react-native";
import { globalStyles } from "../../../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "../../loading";
import FlatlistProjectItem from '../../flatlistItems/flatlistProjectItem';
import * as firebase from "firebase";
import "firebase/firestore";


//needs an alert or something before a project gets deleted
//projects are deleted without any feedback currently

const Projects = (props) => {

  const [userProjects, setUserProjects] = useState();
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState(props.user);


  //refresh list of users projects
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

  //delete project
  const deleteItem = (id) => {

    console.log('filtering project list.. ');

    const list = [...userProjects];
    const filteredList = list.filter(item => item.id !== id);
    console.log(filteredList);
    setUserProjects(filteredList);

    // async function deleteProject() {
    //   firebase
    //   .firestore()
    //   .collection("projectList")
    //   .doc("projects")
    //   .collection(user)
    //   .doc(id)
    //   .delete()
    //   .then(() => {
    //     console.log("deleted project" + id);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // }

    // deleteProject();

    async function deleteItem() {
      console.log("deleting projects for user: " + user);
      const res = await fetch (
        "http://192.168.0.2:3000/delete-project",
        {
          method: "post",
          headers: {
            user: user,
            id: id
          },
        }
      );
    }

    try {
      deleteItem();
    } catch (error) {
      console.log(error);
    }
  }

  //should stop from rendering too many times
  useEffect(() => {
    try {
      refreshProjects();
    } catch (error) {
      console.log(error);
    }
  }, [user]);

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
