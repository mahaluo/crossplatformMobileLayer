import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "./loading";
import ProjectComments from '../components/projectComments';

const ProjectFeed = (refresh) => {

  const [storedProjects, setStoredProjects] = useState();
  const [load, setLoad] = useState(refresh);
  const [userid, setUserid] = useState();
  const [comments, setComments] = useState();
  const [projectid, setProjectid] = useState();

 
  const refreshProjects = () => {

    console.log("project feed refreshing");
    setLoad(true);
    
    async function refreshFeed() {
      
      const userList = [];
      const usersProject = await fetch("http://192.168.0.2:3000/user-projects", {
        method: "GET",
        headers: {
          userid: userid,
        },
      });
  
      const jsonproject = await usersProject.json();
      jsonproject.forEach((projectfound) => {
        userList.push(projectfound.project);
      });
  
      setStoredProjects(userList);
    }

    try {
      refreshFeed().then(() => {
        setLoad(false);
      })
    } catch (error) {
      console.log(error);
    }
    
  }

  useEffect(() => {


    try {
      setUserid(firebase.auth().currentUser.uid);
    } catch (error) {
      console.log(error);
    }  


    try {
      refreshProjects();
    } catch (error) {
      console.log(error);
    }
    
  }, [userid]);


  const showComments = (id) => {
    setProjectid(id);
    setComments(true);
  };

  const exitComments = () => {
    setComments(false);
  }

  const toggleSolved = (id, solved) => {
    console.log('toggling solved');
    setLoad(true);

    async function toggle() {
      if (solved) {
        firebase
        .firestore()
        .collection(userid)
        .doc("projectList")
        .collection("projects")
        .doc(id)
        .update({'solved': false})
        .then(() => {
          console.log("toggled project solved " + id);
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
        firebase
        .firestore()
        .collection(userid)
        .doc("projectList")
        .collection("projects")
        .doc(id)
        .update({'solved': true})
        .then(() => {
          console.log("toggled project solved " + id);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }

   
    
    toggle().then(() => {
      setTimeout(() => {
        refreshProjects();
      }, 1200);
    })

  };

  const toggleShared = (id, shared) => {
    console.log('toggling shared');
    setLoad(true);
  
    async function toggle() {
      if (shared) {
        firebase
        .firestore()
        .collection(userid)
        .doc("projectList")
        .collection("projects")
        .doc(id)
        .update({'shared': false})
        .then(() => {
          console.log("toggled project shared " + id);
        })
        .catch((err) => {
          console.log(err);
        });
      }
      else {
        firebase
        .firestore()
        .collection(userid)
        .doc("projectList")
        .collection("projects")
        .doc(id)
        .update({'shared': true})
        .then(() => {
          console.log("toggled project shared " + id);
        })
        .catch((err) => {
          console.log(err);
        });
      }
    }

    toggle().then(() => {
      setTimeout(() => {
        refreshProjects();
      }, 1200);
    })
  };

  const deletePost = (id) => {
    console.log('deleting project');
    setLoad(true);

    async function deleteProject() {
      firebase
      .firestore()
      .collection(userid)
      .doc("projectList")
      .collection("projects")
      .doc(id)
      .delete()
      .then(() => {
        console.log("deleted project" + id);
      })
      .catch((err) => {
        console.log(err);
      });
    }

    deleteProject().then(() => {
      setTimeout(() => {
        refreshProjects();
      }, 1200);
    })
  };

  return (
    <View>
      <View>
        {load ? (
          <Loading />
        ) : (
          <View>

            {comments ? <View>
              <TouchableOpacity
                         style={styles.iconBox}
                          onPress={() => exitComments()}
                        >
                          <MaterialIcons
                            style={styles.editProjectIcons}
                            name="arrow-back"
                            size={24}
                            color="coral"
                          />
                           
                        </TouchableOpacity>
              <ProjectComments id={projectid}/>
            </View> : <View>


              {storedProjects &&
              storedProjects.map((project) => {
                return (
                  <View style={styles.projectCard} key={project.id}>
                    <View style={styles.projectCardHeader}>
                      <Text style={styles.projectTitle}>{project.title}</Text>
                    </View>

                    <View style={styles.projectCardContent}>
                      <View style={styles.projectBody}>

                      <Text>{project.body}</Text>
                      </View>
                     

                      <View style={styles.editProjectIconCol}>
                        <TouchableOpacity
                         style={styles.iconBox}
                          onPress={() => deletePost(project.id)}
                        >
                          <MaterialIcons
                            style={styles.editProjectIcons}
                            name="delete-forever"
                            size={24}
                            color="coral"
                          />
                           <Text style={styles.editProjectIconText}>delete</Text>
                        </TouchableOpacity>

                        {project.solved ? (
                          <View>
                            <TouchableOpacity
                             style={styles.iconBox}
                              onPress={() =>
                                toggleSolved(project.id, project.solved)
                              }
                            >
                              <MaterialIcons
                                style={styles.editProjectIcons}
                                name="check-box"
                                size={24}
                                color="coral"
                              />
                              <Text style={styles.editProjectIconText}>solved</Text>
                            </TouchableOpacity>
                            
                          </View>
                        ) : (
                          <View>
                            <TouchableOpacity
                             style={styles.iconBox}
                              onPress={() =>
                                toggleSolved(project.id, project.solved)
                              }
                            >
                              <MaterialIcons
                                style={styles.editProjectIcons}
                                name="check-box-outline-blank"
                                size={24}
                                color="coral"
                              />
                              <Text style={styles.editProjectIconText}>solved</Text>
                            </TouchableOpacity>
                            
                          </View>
                        )}

                        <TouchableOpacity
                         style={styles.iconBox}
                          onPress={() => showComments(project.id)}
                        >
                          <MaterialIcons
                            style={styles.editProjectIcons}
                            name="chat"
                            size={24}
                            color="coral"
                          />
                           <Text style={styles.editProjectIconText}>comments</Text>
                        </TouchableOpacity>

                        {project.shared ? (
                          <View>
                            <TouchableOpacity
                             style={styles.iconBox}
                              onPress={() => toggleShared(project.id, project.shared)}
                            >
                              <MaterialIcons
                                style={styles.editProjectIcons}
                                name="screen-share"
                                size={24}
                                color="coral"
                              />
                              <Text style={styles.editProjectIconText}>shared</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View>
                            <TouchableOpacity
                            style={styles.iconBox}
                              onPress={() => toggleShared(project.id, project.shared)}
                            >
                              <MaterialIcons
                                style={styles.editProjectIcons}
                                name="stop-screen-share"
                                size={24}
                                color="coral"
                              />
                              <Text style={styles.editProjectIconText}>not shared</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.projectCardFooter}>
                      <Text style={styles.projectCreated}>
                        {project.createdAt}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View> }

         
          </View>
        )}
      </View>
    </View>
  );
};

export default ProjectFeed;

const styles = StyleSheet.create({
  projectCard: {
    borderColor: "coral",
    borderWidth: 2,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  projectCardHeader: {
    minHeight: 20,
    paddingTop: 16,
  },
  projectCardContent: {
    minHeight: 300,
    paddingHorizontal: 10,
    paddingTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-evenly"
  },
  projectIconRow: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
    justifyContent: "flex-end",
  },
  projectCardFooter: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 30,
    flexDirection: "row",
  },
  projectTitle: {
    alignSelf: "center",
    fontSize: 20,
  },
  projectCreated: {
    color: "#333",
    fontSize: 15,
  },
  editProjectIconCol: {
    flex: 1,
    marginRight: 5,
    marginTop: 20,
    alignItems: 'center'
  },
  editProjectIcons: {
    padding: 15,
  },
  editProjectIconText: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  iconBox: {
    padding: 10,
    alignContent: 'center',
    textAlign: 'center'
  },
  projectBody: {
    flex: 1,
    padding: 20,
    marginTop: 20,

  },
});
