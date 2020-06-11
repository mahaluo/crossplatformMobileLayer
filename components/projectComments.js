import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as firebase from "firebase";
import "firebase/firestore";
import Loading from "./loading";
import { globalStyles } from "../styles/global";

//need to find a better way of rendering all the comments, 
//find out if nesting flatlists is possible or not, nesting scrollview and flatlist not good?

const ProjectComments = ({ id }) => {

  //use load while getting comments from middle layer
  const [load, setLoad] = useState();

  //put list of comments in here
  const [comments, setComments] = useState();

  //use this to get comments from the right project
  const [projectid, setProjectid] = useState();

  //set user id if comments are from personal page
  const [userid, setUserid] = useState();

  //refresh feed of comments, would be nice to have this in flatlist but cant nest flatlists for now
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

  //useEffect, should stop from rendering too many times error
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
