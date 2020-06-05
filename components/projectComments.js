import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "./loading";
import { globalStyles } from "../styles/global";

const ProjectComments = ({ id }) => {
  const [load, setLoad] = useState();
  const [comments, setComments] = useState();
  const [projectid, setProjectid] = useState();
  const [userid, setUserid] = useState();

  const refreshFeed = () => {
    console.log("fetching comments");
    setLoad(true);

    async function getComments() {
      const commentList = [];
      const projectComments = await fetch(
        "http://192.168.0.2:3000/project-comments",
        {
          method: "GET",
          headers: {
            userid: userid,
            projectid: projectid,
          },
        }
      );

      const jsonComment = await projectComments.json();
      jsonComment.forEach((commentFound) => {
        commentList.push(commentFound.comment);
      });

      setComments(commentList);
    }

    try {
      getComments().then(() => {
        setLoad(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    try {
        setUserid(firebase.auth().currentUser.uid);
        setProjectid(id);
    } catch (error) {
        console.log(error);
    }
      
    try {
      refreshFeed(projectid);
    } catch (error) {
      console.log(error);
    }
  }, [projectid, userid]);

  return (
    <View>
      {load ? (
        <Loading />
      ) : (
        <View>
          {comments &&
            comments.map((comment) => {
              return (
                <View style={styles.commentContainer} key={comment.id}>
                    <View style={styles.commentBody}>
                    <Text>{comment.comment}</Text>
                    </View>
                    <View style={styles.commentFooter}>
                        <Text style={globalStyles.smallText}>{comment.createdAt}</Text>
                    </View>
                </View>
              );
            })}
        </View>
      )}
    </View>
  );
};

export default ProjectComments;

const styles = StyleSheet.create({
    commentContainer: {
        padding: 20,
        borderBottomColor: 'coral',
        borderBottomWidth: 2,
    },
    commentBody: {
        marginBottom: 20,
    },
    commentFooter: {

    }
});
