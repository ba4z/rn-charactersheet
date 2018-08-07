import React, {Component} from "react";
import styles from "./styles";
import {ScrollView, Text, View, Modal, Alert} from "react-native";
import {Button} from "react-native-elements";
import firebase from "react-native-firebase";

let uuid = require("react-native-uuid");

class PartyView extends React.Component {

	//TODO save user and profile in DB instead of relying on FB auth. Otherwise there is no way to access the users data

	constructor(props) {
		super(props);
		this.state = {
			joinPartyModal: false,
			createPartyModal: false,
			ownedParties: []
		};
		setTimeout(() => {
			this.findYourParties();
		}, 2000);
	}

	findYourParties() {
		return firebase.database().ref("parties").orderByChild(`members/${firebase.auth().currentUser.uid}`).equalTo("owner").once("value").then(result => {
			//Always returns a map of partyId: value
			console.log(result.val());
		}, err => {
			Alert.alert("Could not create party", err.message);
		});
	}

	checkForActiveParties() {
		return firebase.database().ref(`parties/${firebase.auth().currentUser.uid}`).on("value");
	}


	createParty() {
		// this.setState({createPartyModal: true});
		let members = {};
		members[firebase.auth().currentUser.uid] = "owner";

		firebase.database().ref(`parties/${uuid.v1()}/members`).set(members).then(result => {
			console.log(result);
		}, err => {
			Alert.alert("Could not create party", err.message);
		})
	}

	render() {
		return (
			<ScrollView>
				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.createPartyModal}>
					<Text>Creating Party</Text>
				</Modal>

				<View style={styles.container}>
					<Button
						buttonStyle={styles.button}
						backgroundColor={styles.button.backgroundColor}
						raised
						onPress={() => this.createParty()}
						icon={{name: "person-add", type: "material-icons"}}
						title='Start a new Party'/>
				</View>
			</ScrollView>
		);
	}
}

export default PartyView;
