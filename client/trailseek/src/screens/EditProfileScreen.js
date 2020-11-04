import React from 'react';
import {TextInput, View, StyleSheet, Image, Keyboard} from 'react-native';
import { Text, Button } from 'react-native-elements';

const EditProfileScreen = () => {
    return(
        <>
            

            <View style={styles.containerform}>
                <Text h3 style={styles.heading}>Edit Profile</Text>

                <TextInput
                    onChangeText={(e) => inputsHandler(e, "name")}
                    placeholder={"Name"}
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(e) => inputsHandler(e, "gender")}
                    placeholder={"Gender"}
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(e) => inputsHandler(e, "dob")}
                    placeholder={"DOB"}
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(e) => inputsHandler(e, "email")}
                    placeholder={"Email"}
                    style={styles.input}
                />
                <TextInput
                    onChangeText={(e) => inputsHandler(e, "password")}
                    placeholder={"Password"}
                    style={styles.input}
                />

                <View style={styles.flexxx}>
                    <Button
                    title="Update Profile"
                    buttonStyle={styles.button}
                    />
                </View>
            </View>    


        </>
    );
};

const styles = StyleSheet.create({


    heading:{
        width: "80%",
    },

    input: {
        width: "80%",
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 10,
    },
    containerform: {
        flex: 2,
        alignItems: "center",
        // justifyContent: 'center',
        width: "100%",
        flexDirection: "column",
    },
    
    flexxx: {
        width: "80%",
        flexDirection: "column",
        alignItems: "stretch",
    },

});

export default EditProfileScreen;