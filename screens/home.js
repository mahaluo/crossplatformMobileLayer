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
  AsyncStorage
} from "react-native";
import { globalStyles } from "../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "../components/loading";
import Account from "../components/tabcomponents/account";
import Projects from "../components/tabcomponents/projects";
import NewProject from "../components/newProject";
import PublicProjectFeed from "../components/publicProjectFeed";


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

  //remember me
  const [checked, setChecked] = useState(false);

  //tabs
  const [home, setHome] = useState(true);
  const [projects, setProjects] = useState(false);
  const [account, setAccount] = useState(false);

  //new project
  const [newProjectForm, setNewProjectForm] = useState(false);

  //authenticate user, send request to middle layer
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

  //toggles between register and login stuff
  const triggerModal = () => {
    if (registerOpen) {
      setRegisterOpen(false);
    } else {
      setRegisterOpen(true);
    }

    console.log("modal toggle" + registerOpen);
  };

  //auth request was successful
  const onLoginSuccess = () => {
    setEmail("");
    setPassword("");
    setAuth(true);
    console.log("login successful");
    storeToken();
    setLoad(false);
  };

  //auth request returned a failure
  const onLoginFailure = () => {
    setEmail("");
    setPassword("");
    setAuth(false);
    setError(true);
    setTimeout(() => { }, 1500);
    setError(false);
    setLoad(false);
  };

  //useEffect to stop it from rendering 1000 times, not 100% sure how useEffect works 
  useEffect(() => {
    if (checked) {
      getToken();
    }

    console.log('auth state changed.. ');
  }, [auth]);

  //store token in localstorage if user wants to be remembered
  async function storeToken() {
    try {
      if(checked) {
        await AsyncStorage.setItem("user", email);
        console.log('user checked remember me.. ' + email);
      }
      else {
        console.log('user did not check remember me.. ');
      }
      
    } catch (error) {
      console.log("something bad happened", error);
    }
  }

  //check if user wanted to be remembered, get credentials from localstorage
  async function getToken() {
    try {
      let userData = await AsyncStorage.getItem("user");
      console.log('found remembered user.. ' + userData);
      if (userData) {
        setChecked(true);
        setEmail(userData);
      }
      
    } catch (error) {
      console.log("something bad happened", error);
    }
  }

  //switches content on home screen based on which tab is clicked
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

  //sign out user from account screen
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        console.log("signing out user");
        setAuth(false);
      })
      .catch(function (error) {
        console.log(error);
      });

    setAccount(false);
    setProjects(false);
    setHome(true);
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
            <View style={{flex: 1}}>
              <View style={globalStyles.screenHeader}>
                <Text style={globalStyles.screenHeaderTitle}>
                  public projects
                  </Text>
              </View>
              {load ? (
                <Loading />
              ) : (
                  <View style={{ flex: 1 }}>
                    <PublicProjectFeed user={user} />
                  </View>
                )}
            </View>
          ) : null}

          {account ? (
            <View>
              <View style={globalStyles.screenHeader}>
                <Text style={globalStyles.screenHeaderTitle}>
                  account
                  </Text>
              </View>
              <View style={globalStyles.screenHeaderIconRow}>
                <TouchableOpacity
                  style={styles.statusContainer}
                  onPress={() => handleSignOut()}
                >
                  <MaterialIcons
                    style={globalStyles.projectIcon}
                    name="exit-to-app"
                    size={40}
                    color="coral"
                  />
                </TouchableOpacity>
              </View>
              <Account />
            </View>
          ) : null}

          {projects ? (
            <View style={{ flex: 1 }}>
              <View style={globalStyles.screenHeader}>
                <Text style={globalStyles.screenHeaderTitle}>
                  my projects
                  </Text>
              </View>
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

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                      {checked ?
                        <TouchableOpacity onPress={() => setChecked(!checked)}>
                          <MaterialIcons name="check-box" size={18} color="black" />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => setChecked(!checked)}>
                          <MaterialIcons name="check-box-outline-blank" size={18} color="black" />
                        </TouchableOpacity>}

                      <Text style={globalStyles.smallText}> remember me </Text>
                    </View>

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
