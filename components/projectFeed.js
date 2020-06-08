import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "./loading";
import ProjectComments from '../components/projectComments';
import { FlatList } from "react-native-gesture-handler";
import { globalStyles } from "../styles/global";

const ProjectFeed = (props) => {

  console.log('props from projects.js: ');
  console.log(props.projectList);

  const [storedProjects, setStoredProjects] = useState(props.projectList);
  const [load, setLoad] = useState(true);
  const [userid, setUserid] = useState();
  const [comments, setComments] = useState();
  const [projectid, setProjectid] = useState();


  useEffect(() => {

    if(props.projectList) {
      try {
        props.projectList.forEach(project => {
          console.log(project.title);
        });
        setLoad(false);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      console.log('empty list from projects.. ');
      setLoad(false);
    }
    
  }, [load]);


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
        .collection("projectList")
        .doc("projects")
        .collection(userid)
        .doc(id)
        .update({'solved': false})
        .then(() => {
          console.log("toggled project solved to false");
        })
        .catch((err) => {
          console.log(err);
        });

      } else {
        firebase
        .firestore()
        .collection("projectList")
        .doc("projects")
        .collection(userid)
        .doc(id)
        .update({'solved': true})
        .then(() => {
          console.log("toggled project solved to true");
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

  const toggleShared = (project) => {
    console.log('toggling shared ' + project.shared);
    setLoad(true);
  
    async function toggle() {
      if (project.shared) {
        firebase
        .firestore()
        .collection("projectList")
        .doc("projects")
        .collection(userid)
        .doc(id)
        .update({'shared': false})
        .then(() => {
          console.log("toggled project shared");
        })
        .catch((err) => {
          console.log(err);
        });

        firebase
        .firestore()
        .collection('publicProjects')
        .doc('projectList')
        .collection(userid)
        .doc(project.id)
        .delete()
        .then(() => {
          console.log("removed project to public list ");
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
        .doc(project.id)
        .update({'shared': true})
        .then(() => {
          console.log("toggled project shared");
        })
        .catch((err) => {
          console.log(err);
        });

        firebase
        .firestore()
        .collection('publicProjects')
        .doc('projectList')
        .collection(userid)
        .doc(project.id)
        .set({
          title: project.title,
          body: project.body,
          createdAt: project.createdAt,
          solved: project.solved,
        })
        .then(() => {
          console.log("added project to public list ");
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
        {load ? (
          <Loading />
        ) : (
          <View >

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

              <FlatList 
                data={storedProjects}
                renderItem={({ item }) => (

                  <View style={globalStyles.projectCard}>

                    <View style={globalStyles.projectCardHeader}>
                      <Text style={globalStyles.projectTitle}>{item.title}</Text>
                    </View>

                    <View style={globalStyles.projectCardContent}>
                      <View>
                        <Text>{item.body}</Text>
                      </View>
                    </View>

                    <View style={globalStyles.projectCardFooter}>

                      <View style={globalStyles.projectIconRow}>

                          {item.solved ? <View> 
                            <TouchableOpacity>
                            <MaterialIcons style={globalStyles.projectIcon} name="check-box" size={24} color="coral" />
                            </TouchableOpacity>
                            <Text style={globalStyles.projectIconText}> solved </Text> 
                         
                          </View> : <View> 
                          <TouchableOpacity>
                            <MaterialIcons style={globalStyles.projectIcon} name="check-box-outline-blank" size={24} color="coral" />
                            </TouchableOpacity>
                            <Text style={globalStyles.projectIconText}> not solved </Text> 
                            
                          </View>}
                        

                          {item.shared ? <View> 
                            <TouchableOpacity>
                            <MaterialIcons style={globalStyles.projectIcon} name="screen-share" size={24} color="coral" />
                            </TouchableOpacity>
                            <Text style={globalStyles.projectIconText}> shared </Text> 
                          
                          </View> : <View> 
                          <TouchableOpacity>
                            <MaterialIcons style={globalStyles.projectIcon} name="stop-screen-share" size={24} color="coral" />
                            </TouchableOpacity>
                            <Text style={globalStyles.projectIconText}> not shared </Text> 
                            
                          </View>}

                          <View> 
                          <TouchableOpacity>
                            <MaterialIcons style={globalStyles.projectIcon} name="comment" size={24} color="coral" />
                            </TouchableOpacity>
                            <Text style={globalStyles.projectIconText}> comments </Text> 
                            
                          </View>

                          <View> 
                          <TouchableOpacity>
                            <MaterialIcons style={globalStyles.projectIcon} name="delete-forever" size={24} color="coral" />
                            </TouchableOpacity>
                            <Text style={globalStyles.projectIconText}> delete </Text> 
                            
                          </View>
                        



                      </View>
                     
                    
                        <View style={globalStyles.projectCreatedAt}>
                          <Text style={globalStyles.smallText}>{item.createdAt}</Text>
                        </View>

                    
                    </View>
                 

                  </View>
                  
                )}


              />
              
            </View> }

         
          </View>
        )}
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
    alignItems: 'center',
    justifyContent: 'center'
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
