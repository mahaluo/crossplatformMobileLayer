import * as React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global'


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