import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global'

//about screen needs some text that describes the web app
function About({navigation}) {
    return (
        <View >
        
        <TouchableOpacity>
            <Text style={styles.boxThree}>about</Text>
            </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
    boxThree: {
        backgroundColor: 'coral',
        padding: 10,
        marginTop: 20,
    },
})

export default About;