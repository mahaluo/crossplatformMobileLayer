import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { globalStyles } from "../styles/global";
import Loading from "../components/loading";
import * as firebase from "firebase";
import "firebase/firestore";
import Account from "./account";
import Projects from "./projects";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

function Home({ navigation }) {
  //loading window
  const [load, setLoad] = useState(false);

  //user credentials
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [registerEmail, setRegisterEmail] = useState();
  const [registerPassword, setRegisterPassword] = useState();
  const [userid, setUserid] = useState();

  //firebase
  const [auth, setAuth] = useState();
  const [error, setError] = useState(false);

  //register
  const [registerOpen, setRegisterOpen] = useState(false);

  //stored lists
  const [storedProjects, setStoredProjects] = useState();
  const [publicProjects, setPublicProjects] = useState([]);
  const projectList = [];

  //tabs
  const [home, setHome] = useState(true);
  const [projects, setProjects] = useState(false);
  const [account, setAccount] = useState(false);

  //my functions

  const authUser = () => {
    setLoad(true);

    setTimeout(() => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function (user) {
          onLoginSuccess();
        })
        .catch(function (error) {
          onLoginFailure(error);
        });
    }, 1500);
  };

  const triggerModal = () => {
    if (registerOpen) {
      setRegisterOpen(false);
    } else {
      setRegisterOpen(true);
    }

    console.log("modal toggle" + registerOpen);
  };

  const onLoginSuccess = () => {
    setEmail("");
    setPassword("");
    setLoad(false);
    setAuth(true);
    setTimeout(() => {
      refreshPublicProjects();
    }, 1000);
    console.log("login successful");
  };

  const onLoginFailure = (error) => {
    setEmail("");
    setPassword("");
    setAuth(false);
    setError(true);

    console.log(error);

    setError(false);
    setTimeout(() => {}, 500);

    setLoad(false);
  };

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      setAuth(false);
      setStoredProjects("");
      setUserid("");
      setProjects(false);
      setAccount(false);
      setHome(true);
      console.log("user signed out");
    } else {
      setUserid(user.uid);
    }
  });

  async function refreshPublicProjects() {
    setLoad(true);
    console.log("refreshing public project feed");
    const publicList = [];
    const publicProject = await fetch(
      "http://192.168.0.2:3000/public-projects",
      {
        method: "GET",
        headers: {
          userid: userid,
        },
      }
    );

    const jsonproject = await publicProject.json();
    jsonproject.forEach((projectfound) => {
      publicList.push(projectfound.project);
    });

    setPublicProjects(publicList);
    setLoad(false);
  }

  const handleTabContent = (tab) => {
    if (tab === "projects") {
      setHome(false);
      setAccount(false);
      setProjects(true);
    } else if (tab === "account") {
      setProjects(false);
      setHome(false);
      setAccount(true);
    } else if (tab === "home") {
      setProjects(false);
      setAccount(false);
      setHome(true);
      refreshPublicProjects();
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        console.log("outside press");
      }}
    >
      <ScrollView>
        {auth ? (
          <View>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.boxOne}
                onPress={() => handleTabContent("home")}
              >
                <Text>home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.boxOne}
                onPress={() => handleTabContent("projects")}
              >
                <Text>projects</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.boxOne}
                onPress={() => handleTabContent("account")}
              >
                <Text>account</Text>
              </TouchableOpacity>
            </View>

            {home ? (
              <View>
              <View style={globalStyles.screenHeader}>
                      <Text style={globalStyles.screenHeaderTitle}>
                        public projects
                      </Text>
                    </View>
                {load ? (
                  <Loading />
                ) : (
                  <View>
                    
                    {publicProjects &&
                      publicProjects.map((project) => {
                        return (
                          <View style={styles.projectCard} key={project.id}>
                            <View style={styles.projectCardHeader}>
                              <Text style={styles.projectTitle}>
                                {project.title}
                              </Text>
                            </View>

                            <View style={styles.projectCardContent}>
                              <Text>{project.body}</Text>
                            </View>

                            <View style={styles.projectIconColumn}></View>

                            <View style={styles.projectCardFooter}>
                              <Text style={styles.projectCreated}>
                                {project.createdAt}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                  </View>
                )}
              </View>
            ) : null}

            {account ? <Account /> : null}

            {projects ? (
              <Projects userid={userid} projects={storedProjects} />
            ) : null}
          </View>
        ) : (
          <View style={globalStyles.container}>
            {registerOpen ? (
              <View style={styles.loginContainer}>
                <Text style={globalStyles.titleText}>new user</Text>

                <TextInput
                  style={styles.loginField}
                  placeholder="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(val) => setRegisterEmail(val)}
                  clearTextOnFocus={true}
                  value={registerEmail}
                ></TextInput>
                <TextInput
                  style={styles.loginField}
                  placeholder="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(val) => setRegisterPassword(val)}
                  clearTextOnFocus={true}
                  secureTextEntry={true}
                  value={registerPassword}
                ></TextInput>

                <View style={styles.errorWindow} visible={false}>
                  {load ? <Loading /> : null}
                  {error ? (
                    <Text style={globalStyles.errorText}>error</Text>
                  ) : null}
                </View>

                <View style={styles.loginButtons}>
                  <TouchableOpacity onPress={() => registerUser()}>
                    <Text style={styles.coralBorderButton}>register</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setRegisterOpen(false)}>
                    <Text style={styles.coralBorderButton}>cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.loginContainer}>
                <Text style={globalStyles.titleText}>welcome</Text>

                <TextInput
                  style={styles.loginField}
                  placeholder="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(val) => setEmail(val)}
                  clearTextOnFocus={true}
                  value={email}
                ></TextInput>
                <TextInput
                  style={styles.loginField}
                  placeholder="password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(val) => setPassword(val)}
                  clearTextOnFocus={true}
                  secureTextEntry={true}
                  value={password}
                ></TextInput>

                <Text style={globalStyles.smallText}> forgot password? </Text>

                <View style={styles.errorWindow} visible={false}>
                  {load ? <Loading /> : null}
                  {error ? (
                    <Text style={globalStyles.errorText}>error</Text>
                  ) : null}
                </View>

                <View style={styles.loginButtons}>
                  <TouchableOpacity onPress={() => authUser()}>
                    <Text style={styles.coralBorderButton}>sign in</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => triggerModal()}>
                    <Text style={styles.coralBorderButton}>register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
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
  loginContainer: {
    flexDirection: "column",
    marginTop: 140,
    padding: 20,
    borderRadius: 10,
    borderColor: "coral",
    borderWidth: 2,
    alignItems: "center",
  },
  loginField: {
    width: 200,
    marginHorizontal: 20,
    borderBottomColor: "coral",
    borderBottomWidth: 2,
    marginTop: 20,
  },
  loginButtons: {},
  coralBorderButton: {
    width: 200,
    height: 30,
    borderWidth: 1,
    borderColor: "coral",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
  errorWindow: {
    marginBottom: 20,
    minHeight: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOne: {
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10,
    borderColor: "coral",
    borderBottomWidth: 2,
  },
  boxTwo: {
    backgroundColor: "#fff",
    padding: 10,
    borderColor: "#fff",
    borderBottomWidth: 2,
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

export default Home;
