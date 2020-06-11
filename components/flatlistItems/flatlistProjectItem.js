import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from "react-native";
import { globalStyles } from "../../styles/global";
import { MaterialIcons } from "@expo/vector-icons";
import firebase from 'firebase';
import "firebase/firestore";
import FlatListCommentItem from '../flatlistItems/flatlistCommentItem';


//need to move toggle shared and toggle solved to middle layer

const FlatListProjectItem = (props) => {

    //project variables
    const [solved, setSolved] = useState(props.project.solved);
    const [shared, setShared] = useState(props.project.shared);
    const [loadSolved, setLoadSolved] = useState(false);
    const [loadShared, setLoadShared] = useState(false);

    //comments
    const [comments, setComments] = useState(false);
    const [loadComments, setLoadComments] = useState(false);
    const [listComments, setListComments] = useState();
    const [emptyComments, setEmptyComments] = useState();

    //toggles if solved is true or not
    const toggleSolved = (id) => {

        setLoadSolved(true);
        setTimeout(() => {
            if (solved) {
                setSolved(false);
                firebase
                    .firestore()
                    .collection("projectList")
                    .doc("projects")
                    .collection('users')
                    .doc(props.user)
                    .collection('userproject')
                    .doc(id)
                    .update({ 'solved': false })
                    .then(() => {
                        console.log("toggled project solved to false");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            else {
                setSolved(true);
                firebase
                    .firestore()
                    .collection("projectList")
                    .doc("projects")
                    .collection('users')
                    .doc(props.user)
                    .collection('userproject')
                    .doc(id)
                    .update({ 'solved': true })
                    .then(() => {
                        console.log("toggled project solved to true");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            setLoadSolved(false);
        }, 1200);
    }

    //toggles if shared is true or not
    const toggleShared = (id) => {

        setLoadShared(true);
        setTimeout(() => {
            try {
                if (shared) {
                    setShared(false);
                    firebase
                        .firestore()
                        .collection("projectList")
                        .doc("projects")
                        .collection('users')
                        .doc(props.user)
                        .collection('userproject')
                        .doc(id)
                        .update({ 'shared': false })
                        .then(() => {
                            console.log("toggled project shared to false");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                else {
                    setShared(true);
                    firebase
                        .firestore()
                        .collection("projectList")
                        .doc("projects")
                        .collection('users')
                        .doc(props.user)
                        .collection('userproject')
                        .doc(id)
                        .update({ 'shared': true })
                        .then(() => {
                            console.log("toggled project shared to true");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
                setLoadShared(false);
            } catch (error) {
                console.error(error);
            }
           
        }, 1200);
    }

    //toggle to show comments or project body
    const toggleComments = () => {
        if (comments) {
            setComments(false);
        }
        else {
            setLoadComments(true);
            setComments(true);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            async function getComments() {
                const commentList = [];
                console.log("fetching comments for project: " + props.project.id);
                const projectComments = await fetch(
                    "http://192.168.0.2:3000/project-comments",
                    {
                        method: "GET",
                        headers: {
                            user: props.user,
                            id: props.project.id,
                        },
                    }
                );

                const jsonComment = await projectComments.json();
                jsonComment.forEach((commentFound) => {
                    commentList.push(commentFound.comment);
                });

                setListComments(commentList);
                if (commentList.length > 0) {
                    setEmptyComments(false);
                    console.log('found ' + commentList.length + ' comments');
                }
                else {
                    setEmptyComments(true);
                }
            }

            try {
                console.log('trying to get comments.. ')
                getComments();

            } catch (error) {
                console.log(error);
                setComments(false);
            }
        }, 1200);

        setLoadComments(false);
    }, [loadComments])

    return (
        <View>
            <View style={globalStyles.projectCardHeader}>
                <Text style={globalStyles.projectTitle}>{props.project.title}</Text>
            </View>

            <View style={globalStyles.projectCardContent}>
                <View>
                    {comments ? <View>

                        {emptyComments ?
                            <View><Text>no comments on this project</Text></View>
                            : <View style={{ flex: 1 }}>

                                <FlatList
                                    data={listComments}
                                    renderItem={({ item }) => (
                                        <FlatListCommentItem
                                            comment={item}
                                        />
                                    )}
                                />

                            </View>}

                    </View> : <Text>{props.project.body}</Text>}

                </View>
            </View>


            <View style={globalStyles.projectIconRow}>
                <View>
                    <TouchableOpacity onPress={() => toggleSolved(props.project.id)}>
                        {loadSolved ? <ActivityIndicator size="small" /> : <View>

                            {solved ? <MaterialIcons
                                style={globalStyles.projectIcon}
                                name="check-box"
                                size={24}
                                color="green"
                            /> : <MaterialIcons
                                    style={globalStyles.projectIcon}
                                    name="check-box-outline-blank"
                                    size={24}
                                    color="gray"
                                />}
                        </View>}

                    </TouchableOpacity>
                    <Text style={globalStyles.projectIconText}> solved </Text>
                </View>

                <View>
                    <TouchableOpacity onPress={() => toggleShared(props.project.id)}>
                        {loadShared ? <View>
                            <ActivityIndicator size="small" />
                        </View> : <View>
                                {shared ? <MaterialIcons
                                    style={globalStyles.projectIcon}
                                    name="screen-share"
                                    size={24}
                                    color="green"
                                /> : <MaterialIcons
                                        style={globalStyles.projectIcon}
                                        name="stop-screen-share"
                                        size={24}
                                        color="gray"
                                    />}
                            </View>}

                    </TouchableOpacity>
                    <Text style={globalStyles.projectIconText}> shared </Text>
                </View>

                <View>
                    <TouchableOpacity onPress={() => toggleComments()}>
                        {loadComments ? <View>
                            <ActivityIndicator size="small" />
                        </View> : <View>
                                {comments ? <MaterialIcons
                                    style={globalStyles.projectIcon}
                                    name="comment"
                                    size={24}
                                    color="green"
                                /> : <MaterialIcons
                                        style={globalStyles.projectIcon}
                                        name="comment"
                                        size={24}
                                        color="gray"
                                    />}

                            </View>}

                    </TouchableOpacity>
                    <Text style={globalStyles.projectIconText}> comments </Text>
                </View>

            </View>

        </View>
    )
}

export default FlatListProjectItem

const styles = StyleSheet.create({})
