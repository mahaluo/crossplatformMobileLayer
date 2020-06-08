import React, { useState, useEffect } from "react";
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
import Account from "../components/tabcomponents/account";
import Projects from "../components/tabcomponents/projects";
import NewProject from "../components/newProject";
import PublicProjectFeed from "../components/publicProjectFeed";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { FlatList } from "react-native-gesture-handler";


function Home({ navigation }) {
  //loading window
  const [load, setLoad] = useState(false);

  //user credentials
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [registerEmail, setRegisterEmail] = useState();
  const [registerPassword, setRegisterPassword] = useState();
  const [user, setUser] = useState();

  //firebase
  const [auth, setAuth] = useState(false);
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

  //new project
  const [newProjectForm, setNewProjectForm] = useState(false);

  const authUser = () => {
    setLoad(true);

    async function auth() {
      try {
        const user = await fetch("http://192.168.0.2:3000/auth-user", {
          method: "GET",
          headers: {
            email: email,
            password: password,
          },
        });

        const jsonUser = await user.json();
        if (jsonUser.error) {
          throw jsonUser.error;
        }
        else {
          console.log("user: " + jsonUser + " signed in.. ");
          setUser(jsonUser);
          onLoginSuccess();
        }
        
      } catch (error) {
        console.log(error);
        onLoginFailure();
      }
    }

    try {
      auth();
    } catch (error) {
      console.log(error);
      onLoginFailure();
    }
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
    setAuth(true);
    console.log("login successful");
    setLoad(false);
  };

  const onLoginFailure = () => {
    setEmail("");
    setPassword("");
    setAuth(false);
    setError(true);
    setTimeout(() => { }, 1500);
    setError(false);
    setLoad(false);
  };

  // useEffect(() => {

  //   try {
  //     setTimeout(() => {
  //       refreshPublicProjects();
  //     }, 1000);
  //   } catch (error) {
  //     console.log(error);
  //   }

  // }, [])

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
    }
  };

  return (

    <View style={styles.container}>
      {auth ? (
        <View style={styles.container}>
          <View style={styles.topNav}>
            <TouchableOpacity
              style={styles.topNavLinks}
              onPress={() => handleTabContent("home")}
            >
              <Text>home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topNavLinks}
              onPress={() => handleTabContent("projects")}
            >
              <Text>projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.topNavLinks}
              onPress={() => handleTabContent("account")}
            >
              <Text>account</Text>
            </TouchableOpacity>
          </View>

          {home ? (
            <View style={styles.container}>
              <View style={globalStyles.screenHeader}>
                <Text style={globalStyles.screenHeaderTitle}>
                  public projects
                  </Text>
              </View>
              {load ? (
                <Loading />
              ) : (
                  <View>
                    <PublicProjectFeed />
                  </View>
                )}
            </View>
          ) : null}

          {account ? (
            <View>
              <Account />
            </View>
          ) : null}

          {projects ? (
            <View style={{ flex: 1 }}>
              <View style={globalStyles.screenHeaderIconRow}>
                {newProjectForm ? 
                <TouchableOpacity
                  onPress={() => setNewProjectForm(false)}
                >
                  <MaterialIcons
                    style={globalStyles.screenHeaderIcon}
                    name="keyboard-arrow-left"
                    size={40}
                    color="coral"
                  />
                </TouchableOpacity> 
                : 
                <TouchableOpacity
                      onPress={() => setNewProjectForm(true)}
                    >
                      <MaterialIcons
                        style={globalStyles.screenHeaderIcon}
                        name="add-circle-outline"
                        size={40}
                        color="coral"
                      />
                    </TouchableOpacity>
                }
              </View>
              {newProjectForm ? (
                <ScrollView>
                  <NewProject user={user} />
                </ScrollView>
              ) : (
                  <Projects user={user} />
                )}

            </View>
          ) : null}
        </View>
      ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              console.log("outside press");
            }}
          >
            <View style={styles.loginRegisterContainer}>
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

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => registerUser()}>
                      <View style={globalStyles.coralBorderButton}>
                        <Text style={globalStyles.coralBorderButtonText}>register</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setRegisterOpen(false)}>
                      <View style={globalStyles.coralBorderButton}>
                        <Text style={globalStyles.coralBorderButtonText}>cancel</Text>
                      </View>
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

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity onPress={() => authUser()}>
                        <View style={globalStyles.coralBorderButton}>
                          <Text style={globalStyles.coralBorderButtonText}>sign in</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => triggerModal()}>
                        <View style={globalStyles.coralBorderButton}>
                          <Text style={globalStyles.coralBorderButtonText}>register</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
            </View>
          </TouchableWithoutFeedback>
        )}

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  topNavLinks: {
    backgroundColor: "#fff",
    textAlign: "center",
    padding: 14,
    fontSize: 20,
    borderColor: "coral",
    borderBottomWidth: 2,
  },
  loginRegisterContainer: {
    marginTop: 60,
  },
  loginContainer: {
    flexDirection: "column",
    alignSelf: 'center',
    alignItems: "center",
    padding: 20,
    marginVertical: 30,
    borderRadius: 10,
    borderColor: "coral",
    borderWidth: 2,
  },

  loginField: {
    width: 200,
    marginHorizontal: 20,
    borderBottomColor: "coral",
    borderBottomWidth: 2,
    marginTop: 20,
  },
  buttonContainer: {
    padding: 10,
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
