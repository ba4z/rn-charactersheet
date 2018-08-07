import {Platform, StyleSheet} from 'react-native';
import firebase from "react-native-firebase";

// const Blob = RNFetchBlob.polyfill.Blob;
// window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
// window.Blob = Blob;

const uploadImage = (image, location, filename) => {
	let uri = image.path;
	let mime = image.mime;
	return new Promise((resolve, reject) => {
		firebase.storage()
			.ref(`${location}/${filename}`)
			.putFile(uri)
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				reject(err);
			});
	})
};

export default uploadImage;
