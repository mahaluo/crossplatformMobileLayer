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
import FlatListCommentItem from '../flatlistItems/flatlistCommentItem';


const FlatListProjectItem = (props) => {

    //project variables
    const [solved, setSolved] = useState(props.project.solved);
    const [shared, setShared] = useState(props.project.shared);
    const [loadSolved, setLoadSolved] = useState(false);
    const [loadShared, setLoadShared] = useState(false);
    const [errorSolved, setErrorSolved] = useState(false);
    const [errorShared, setErrorShared] = useState(false);

    //comments
    const [comments, setComments] = useState(false);
    const [loadComments, setLoadComments] = useState(false);
    const [listComments, setListComments] = useState();
    const [emptyComments, setEmptyComments] = useState();

    //toggles project shared/solved state is true or not
    const toggle = (sender, state) => {

        if (sender === 'solved') {
            setLoadSolved(true);
        }
        else if (sender === 'shared') {
            setLoadShared(true);
        }
        async function toggleSender() {
            console.log("toggling solved for project: " + props.project.id);
            console.log('toggle sender: ' + sender + " state: " + state);
            let result = await fetch(
                "http://192.168.0.2:3000/toggle-project",
                {
                    method: "GET",
                    headers: {
                        user: props.user,
                        id: props.project.id,
                        sender: sender,
                        boolean: state
                    },
                }
            ).catch((error) => {
                console.log(error);
            })

            if (result) {
                let jsonResult = await result.json();
                if (jsonResult.success) {
                    if (sender === 'solved') {
                        setSolved(!solved);
                        setLoadSolved(false);
                    }
                    else if (sender === 'shared') {
                        setShared(!shared);
                        setLoadShared(false);
                    }
                }
                else {
                    console.log(jsonResult);
                }

            }
            else {
                console.log('something bad happened.. ');
                if (sender === 'solved') {
                    setLoadSolved(false);
                    setErrorSolved(true);
                }
                else if (sender == 'shared') {
                    setLoadShared(false);
                    setErrorShared(true);
                }

                setTimeout(() => {
                    setErrorSolved(false);
                    setErrorShared(false);
                }, 500);
            }
        }

        setTimeout(() => {

            try {
                toggleSender();
            } catch (error) {
                console.error(error);
            }

        }, 800);
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
                    <TouchableOpacity onPress={() => toggle('solved', solved)}>
                        {loadSolved ? <ActivityIndicator size="small" /> :
                            <View>
                                {errorSolved ? <MaterialIcons style={globalStyles.projectIcon} name="error" size={24} color="red" /> : <View>

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
                            </View>}
                    </TouchableOpacity>
                    <Text style={globalStyles.projectIconText}> solved </Text>
                </View>

                <View>
                    <TouchableOpacity onPress={() => toggle('shared', shared)}>
                        {loadShared ? <View>
                            <ActivityIndicator size="small" />
                        </View> : <View>

                                {errorShared ? <MaterialIcons style={globalStyles.projectIcon} name="error" size={24} color="red" /> :
                                    <View>
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
