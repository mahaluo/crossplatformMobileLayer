import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { globalStyles } from '../styles/global'

//about screen needs some text that describes the web app
//trying out some useEffect things here to understand it properly

function About({ navigation }) {

    const [didLoad, setDidLoad] = useState(false);
    const [boxes, setBoxes] = useState([
        {
            color: '',
            id: '1'
        },
        {
            color: '',
            id: '2'
        },
        {
            color: '',
            id: '3'
        },
        {
            color: '',
            id: '4'
        },
        {
            color: '',
            id: '5'
        }
    ]);

    const toggleColor = () => {

        const changeColor = (index) => {
            if (index === 0) {
                boxes[index].color = "#8e24aa"
            }
            if (index === 1) {
                boxes[index].color = "#1e88e5"
            }
            if (index === 2) {
                boxes[index].color = "#00897b"
            }
            if (index === 3) {
                boxes[index].color = "#fdd835"
            }
            if (index === 4) {
                boxes[index].color = "#f4511e"
            }
        }

       
        (function () {
            var i = 2;
            (function k() {

                const toggle = () => {
                    (function () {
                        var i = 4;
                        (function k() {           
                            console.log(boxes[i].color);
                            changeColor(i);
                            console.log(boxes[i].color);
                            setDidLoad(false);
                            if (i--) {
                                setTimeout(k, 300);
                            }
                        })()
                    })()
                }

                toggle();

                setTimeout(() => {
                    (function () {
                        var i = 2;
                        (function k() {

                            for (let index = 0; index < boxes.length; index++) {
                                changeColor(index);
                            }
                            setDidLoad(false);
                            if (i--) {
                                setTimeout(k, 300);
                            }

                        })()
                    })()
                }, 1700);

                setTimeout(() => {
                    toggle()
                }, 2600);

                setTimeout(() => {
                    (function () {
                        var i = 2;
                        (function k() {

                            for (let index = 0; index < boxes.length; index++) {
                                changeColor(index);
                            }
                            setDidLoad(false);
                            if (i--) {
                                setTimeout(k, 300);
                            }

                        })()
                    })()
                }, 4300);
            
                if (i--) {
                    setTimeout(k, 5200);
                }

            })()
        })()

        setTimeout(() => {
            
        }, 6000);
    }

    useEffect(() => {

        for (let index = 0; index < boxes.length; index++) {
            boxes[index].color = "#fff"
        }

        setDidLoad(true);
        console.log('did load');

    }, [didLoad])

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={() => toggleColor()}>
                <View style={globalStyles.screenHeader}>
                    <Text style={globalStyles.screenHeaderTitle}>
                        about
                  </Text>
                </View>
            </TouchableOpacity>

            <View style={styles.row}>

                <View style={styles.topContainer}>
                    <FlatList
                        data={boxes}
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: item.color, height: 30, width: 30, margin: 10 }}>

                            </View>
                        )}
                        horizontal={true}
                    />
                </View>


                <View style={styles.middleContainer}>
                    <Text style={globalStyles.projectTitle}>
                        brain storm your troubles away
                    </Text>

                </View>


                <View style={styles.bottomContainer}>

                    {boxes && boxes.map((item) =>


                        <View key={item.id} style={{ backgroundColor: item.color, height: 30, width: 30, margin: 10 }}>

                        </View>

                    )}
                </View>

            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 10,
    },
    row: {
        flex: 1,
        justifyContent: 'center',
    },
    topContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleContainer: {
        justifyContent: 'center',
        marginVertical: 60,
    },
    bottomContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
    },
})

export default About;