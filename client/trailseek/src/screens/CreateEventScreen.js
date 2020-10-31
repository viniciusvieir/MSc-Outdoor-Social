import React, { createElement } from 'react';
import { TextInput, View, StyleSheet, Image, Keyboard } from "react-native";
import { Text, Button } from 'react-native-elements';
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../app/userSlice";


const CreateEventScreen = ({ route, navigation }) => {

    const trailname = route.params.item.params.name;
    const userStatus = useSelector((state) => state.user.status);
    const error = useSelector((state) => state.user.error);
    const isAuth = useSelector((state) => state.user.isAuth);
    const username = useSelector((state) => state.user.name);

    const createMyEvent = () =>{

        

    }

    return(
        <>
            <Text h3>CreateEventScreen</Text>

            <View style={styles.maincontainer}>
                
                {/* map here */}

                <View style={styles.mapcontainer}>
                </View>

                <View style={styles.infocontainer}>
                    { <Text h5>Trail: {trailname}</Text> }
                    { <Text h5>Organizer: {username}</Text> }
                </View>
                <View style={styles.formcontainer}>

                    <TextInput
                        placeholder={"Event Name"}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder={"Date and Time"}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder={"Description"}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder={"Max Participants"}
                        style={styles.input}
                    />

                    
                    <Button
                        title={"Create Event"}
                        onPress={createMyEvent}
                    />

                </View>
                
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    maincontainer:{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#ecf0f1",
    },
    mapcontainer:{
        backgroundColor:"#ffffff",
        margin:5,
        padding:5,
        borderRadius:5
    },
    infocontainer:{
        backgroundColor:"#ffffff",
        margin:5,
        padding:5,
        borderRadius:5
    },
    formcontainer:{
        backgroundColor:"#ffffff",
        margin:5,
        padding:5,
        borderRadius:5
    },
    
    input:{
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 10,
    }

});

export default CreateEventScreen;