import * as React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/global';

//using this component to display an activityindicator whenever loading content 
function Loading() {

    return (
      
        <View style={styles.loadContainer}>
        
            <Text style={globalStyles.titleText}>Loading...</Text>
            <ActivityIndicator size="large"/>
      </View>
    )
}

const styles = StyleSheet.create({
    loadContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'coral',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
})

export default Loading;