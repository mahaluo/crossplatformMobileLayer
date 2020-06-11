import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global'

//contact screen, need to add component so user can send message or ask question
function Contact() {
    return (
        <View >
         <TouchableOpacity>
            <Text style={styles.boxThree}>contact</Text>



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


export default Contact;