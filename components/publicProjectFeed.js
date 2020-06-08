import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import Loading from '../components/loading';
import { FlatList } from "react-native-gesture-handler";
import FlatlistPublicProjectItem from "./flatlistPublicProjectItem";


const PublicProjectFeed = (props) => {

  const [projectList, setProjectList] = useState();
  const [load, setLoad] = useState(true);
  const [user, setUser] = useState();

  async function refreshPublicProjects() {
    setLoad(true);
    console.log("refreshing public project feed.. ");
    const publicList = [];
    try {
      const publicProject = await fetch(
        "http://192.168.0.2:3000/public-projects",
        {
          method: "GET",
        }
      );

      const jsonproject = await publicProject.json();
      jsonproject.forEach((projectfound) => {
        publicList.push(projectfound.project);
      });
      setProjectList(publicList);
    } catch (error) {
      console.log(error);
    }

    setLoad(false);
  }

  useEffect(() => {
    setUser(props.user);
    try {
      refreshPublicProjects();
    } catch (error) {
      console.log(error);
    }
   
  }, [user])


  return (
    <View style={{ flex: 1 }}>
      {load ?   <Loading /> : 
      <FlatList 
      
        data={projectList}
        renderItem={({ item }) => (
              <View style={globalStyles.projectCard}>
                <FlatlistPublicProjectItem
                  project={item}
                  user={user}
                  />

                <View style={globalStyles.projectCardFooter}>

                  <View style={globalStyles.projectCreatedAt}>
                    <Text style={globalStyles.smallText}>{item.createdAt}</Text>
                  </View>

                </View>

              </View>
            )}
      />}

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
