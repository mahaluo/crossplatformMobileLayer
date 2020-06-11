import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { globalStyles } from "../../styles/global";

const FlatListCommentItem = (props) => {
    return (
        <View style={{margin: 10}}>
            <Text>{props.comment.comment}</Text>
            <Text style={globalStyles.smallText}>{props.comment.createdAt}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})


export default FlatListCommentItem