import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text} from "react-native";
import { useState } from 'react';
import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const PlaceholderImage = require("./assets/favicon.png");

export default function App() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [prediction, setPrediction] = useState("No Prediction");

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            console.log("SUCCESSFULLY CHANGED SELECTED IMAGE");
            setSelectedImage(result.assets[0].uri);
        } else {
            alert('You did not select any image.');
        }
    };

    const updatePrediction = async (newPrediction) => {
        console.log("RECEIVED PREDICTION:",newPrediction)
        setPrediction(newPrediction)
    };

    const convertImageToBase64 = async (uri) => {
        try {
            console.log("ATTEMPTING BASE64 CONVERSION")
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem?.EncodingType?.Base64 });
            return base64;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const toServer = async () => {
        let schema = "http://";
        let host = "192.168.0.110";
        let port = "5000";
        let url = schema + host + ":" + port + "/image";

        let image_bytes = await convertImageToBase64(selectedImage)

        console.log("ATTEMPTING POST...");
        axios.post(url, image_bytes)
            .then(response => updatePrediction(response.data))
            .catch(error => console.error(error));
    }


    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer
                    placeholderImageSource={PlaceholderImage}
                    selectedImage={selectedImage}
                />
            </View>
            <Text style={styles.predictionContainer}>{prediction}</Text>
            <View style={styles.footerContainer}>

                <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
                <Button label="Use this photo" onPress={toServer}/>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    predictionContainer: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: 35,
        color: '#34cbed',
    },
    imageContainer: {
        flex: 2.5,
        paddingTop: 58,
    },
    footerContainer: {
        flex: 1,
        alignItems: 'center',
    },
});
