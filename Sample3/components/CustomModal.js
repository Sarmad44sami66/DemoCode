import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { COLORS } from "../utils/colors";
import CustomButton from "./CustomButton";

export default CustomModal = (props) => {

    return (
        <View>
            <Modal isVisible={props.isVisible}>
                <View style={styles.container}>
                    <Text style={styles.containerHeader}>{props.label}</Text>
                    <CustomButton
                        style={styles.cancelButton}
                        label={"Ok"}
                        onPress={() => props.onCancel()}
                    />
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignSelf: 'center',
        height: 120,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    containerHeader: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'auto',
        marginBottom: 10
    },
    buttonText:{
        color:'white',
    },
    cancelButton: {
        backgroundColor: '#6C63FF',
        borderColor:'#6C63FF',
        width: '80%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 5
    }
})