import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    TextInput
} from "react-native";
import { globalStyles } from "../styles/global";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Loading from '../components/loading';

const FlatlistPublicProjectItem = (props) => {
    console.log('public project flatlist item rendering.. ');

    //comments 
    const [comments, setComments] = useState(false);
    //trigger modal for entering a new comment
    const [modalVisible, setModalVisible] = useState(false);
    const [newComment, setNewComment] = useState();
    const [loadComments, setLoadComments] = useState(false);
    const [listComments, setListComments] = useState();
    const [emptyComments, setEmptyComments] = useState();

    //load
    const [load, setLoad] = useState(false);

    //get user id incase they add a comment somewhere
    const [user, setUser] = useState(props.user);

    //toggle between showing project body or list of comments
    const toggleComments = (id) => {
        setLoadComments(true);
        setTimeout(() => {
            if (comments) {
                setComments(false);
            }
            else {
                setComments(true);
            }
            setLoadComments(false);
        }, 1200);
    }

    //add new comment to project
    const addComment = (id) => {
        setLoad(true);
        console.log("adding comment to project: " + id);

        async function comment() {
            try {
                const commentResult = await fetch(
                    "http://192.168.0.2:3000/post-comment",
                    {
                        method: "GET",
                        headers: {
                            user: user,
                            id: id,
                            comment: newComment,
                        },
                    }
                );
                const jsonResult = await commentResult.json();
                console.log(jsonResult);
                if (jsonResult.success) {
                    console.log("result: " + JSON.stringify(jsonResult));
                    setLoad(false);
                    setNewComment('');
                }
                else {
                    console.log(JSON.stringify(jsonResult));
                    setLoad(false);
                    setNewComment('');
                }
               
            } catch (error) {
                console.log(error);
            }
        }

        try {
            if (newComment.length > 0) {
                comment();
            }
            else {
                setLoad(false);
            }
        } catch (error) {
            console.error(error);
            setLoad(false);
        }
    }

    //should stop from rendering too many times
    useEffect(() => {
        setNewComment('');
        setLoad(false);

        async function getComments() {
            const commentList = [];
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
                setEmptyComments(true);
            }
            else {
                setEmptyComments(false);
            }
        }

        try {
            getComments();
        } catch (error) {
            console.log(error);
        }
    }, [modalVisible])

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <Text style={styles.modalText}>add comment</Text>

                        {load ? <Loading /> : <TextInput
                            style={styles.modalTextInput}
                            placeholder="add comment.. "
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(val) => setNewComment(val)}
                            value={newComment}
                        ></TextInput>}
                        

                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={{ ...styles.modalButton, backgroundColor: "green" }}
                                onPress={() => {
                                    addComment(props.project.id);
                                }}
                            >
                                <Text style={styles.textStyle}>comment</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ ...styles.modalButton, backgroundColor: "red" }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.textStyle}>cancel</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View>


            </Modal>


            <View style={globalStyles.projectCardHeader}>
                <Text style={globalStyles.projectTitle}>{props.project.title}</Text>
            </View>

            <View style={globalStyles.projectCardContent}>
                <View>
                    {comments ? <View>
                        
                        {emptyComments ? <View>{listComments && listComments.map((comment, index) => {
                            return (
                                <View key={index}>
                                    <Text>{comment.comment}</Text>
                                    <Text style={globalStyles.smallText}>{comment.createdAt}</Text>
                                </View>
                            )
                        })}</View>

                            : <View><Text>no comments on this project</Text></View>}

                    </View> : <Text>{props.project.body}</Text>}

                </View>
            </View>

            <View style={globalStyles.projectIconRow}>

                <View>

                    <View>

                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <MaterialCommunityIcons style={globalStyles.projectIcon} name="comment-plus-outline" size={24} color="green" />
                        </TouchableOpacity>
                        <Text style={globalStyles.projectIconText}> comment </Text>
                    </View>

                </View>

                <View>
                    <TouchableOpacity onPress={() => toggleComments(props.project.id)}>
                        {loadComments ? <View>
                            <MaterialCommunityIcons style={globalStyles.projectIcon} name="comment-processing-outline" size={24} color="gray" />
                        </View> : <View>
                                {comments ? <MaterialCommunityIcons style={globalStyles.projectIcon} name="comment-remove" size={24} color="gray" />
                                    : <MaterialCommunityIcons style={globalStyles.projectIcon} name="comment-text" size={24} color="green" />
                                }
                            </View>}

                    </TouchableOpacity>
                    <Text style={globalStyles.projectIconText}> comments </Text>
                </View>

            </View>
        </View>
    )
}

export default FlatlistPublicProjectItem

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: 'coral',
        borderWidth: 1,

        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 250,

    },
    modalButton: {
        backgroundColor: "#F194FF",
        borderRadius: 10,
        marginVertical: 5,
        padding: 8,
        minWidth: 180,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginVertical: 16,
        textAlign: "center"

    },
    modalButtonContainer: {
        marginTop: 90,
    },
    modalTextInput: {
        marginVertical: 10,
    }
});
