import React, {Component} from "react";
import styles from "./styles";
import {ScrollView, Text, View, Modal, Alert, ActivityIndicator, TouchableOpacity} from "react-native";
import {Button, Icon, List, ListItem} from "react-native-elements";
import firebase from "react-native-firebase";
import Moment from "moment";
import NewParty from "./newParty";
let uuid = require("react-native-uuid");


class PartyView extends React.Component {

	// Create new party and add the id to the character object, look up parties using that
	// Invite only to an email address. Look up name once the user joins and use their name from their auth instead


	constructor(props) {
		super(props);
		this.state = {
			initializing: true,
			joinPartyModal: false,
			createPartyModal: false,
			character: props.character,
			connectedToParty: false
		};
		setTimeout(() => {
			this.checkPendingInvites();
			if(props.character.connectedParty) {
				return this.findYourParty(props.character.connectedParty);
			}
			this.setState({initializing: false, connectedToParty: false});
		}, 500);
	}

	findYourParty(partyId) {
		return firebase.database().ref(`parties/${partyId}`).on("value", result => {
			if(result.val()) {
				let members = result.val().members;
				let pending = result.val().pending;
				this.setState({members: members, pendingPartyInvites: pending, initializing: false, connectedToParty: true});
				return;
			}
			this.setState({initializing: false, connectedToParty: false});
		}, err => {
			Alert.alert("Could not load party", err.message);
			this.setState({initializing: false, connectedToParty: false});
		});
	}

	checkPendingInvites() {
		return firebase.database().ref("invites").orderByChild("email").equalTo(firebase.auth().currentUser.email).on("value", result => {
			//Checking the invite list and comparing it with the actual party
			let invites = [];
			if(result.val()) {
				Object.keys(result.val()).map(inviteId => {
					this.getPartyName(result.val()[inviteId].partyId).then(partyName => {
						invites.push({inviteId: inviteId, name: partyName.val(), partyId: result.val()[inviteId].partyId});
					}, err => {
						//Can fail silently, probably has no access to that party, or party was deleted
						console.log(err);
					});
				});
			}
			console.log(invites);
		}, err => {
			Alert.alert("Error looking for invites", err.message);
		});
	}

	getPartyName(partyId) {
		console.log("partyId: " + partyId);
		return firebase.database().ref(`parties/${partyId}/name`).once("value");
	}

	createParty() {
		this.setState({createPartyModal: false});

		// let members = {};
		// members[firebase.auth().currentUser.uid] = "owner";
		//
		// firebase.database().ref(`parties/${uuid.v1()}/members`).set(members).then(result => {
		// 	console.log(result);
		// }, err => {
		// 	Alert.alert("Could not create party", err.message);
		// });
	}

	leaveParty() {
		this.setState({connectedToParty: false});
		this.state.character.connectedParty = null;
		this.state.character.save();
	}

	render() {
		return (
			<ScrollView>
				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.createPartyModal}>
					<NewParty closeModal={() => this.setState({createPartyModal: false})} createParty={this.createParty.bind(this)}/>
				</Modal>

				{this.state.initializing && (
					<View style={styles.container}>
						<ActivityIndicator size="large"/>
						<Text style={{marginTop: 25}}>Searching for Party...</Text>
					</View>
				)}

				{!this.state.initializing && this.state.connectedToParty && this.state.pendingPartyInvites && this.state.pendingPartyInvites.length > 0 && (
					<View style={styles.container}>
						<Text>Connected to party!</Text>
						<View style={{width: "100%"}}>
							<Text style={{fontSize: 16, fontWeight: "bold", paddingLeft: 20, marginTop: 25}}>Pending Invites:</Text>
							<List containerStyle={{marginBottom: 20}}>
								{
									this.state.pendingPartyInvites.map((l, i) => (
										<ListItem
											key={i}
											hideChevron={true}
											title={l.email}
											subtitle={Moment(l.invited).format("dddd MMMM Do, h:mm a")}
										/>
									))
								}
							</List>
							<TouchableOpacity onPress={() => {}}
							                  style={{marginRight: 10}}>
								<Icon name='plus' type='feather'/>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{!this.state.initializing && !this.state.connectedToParty && (
					<View style={styles.container}>
						<Button
							buttonStyle={styles.button}
							backgroundColor={styles.button.backgroundColor}
							raised
							onPress={() => this.setState({createPartyModal: true})}
							icon={{name: "person-add", type: "material-icons"}}
							title='Start a new Party'/>
					</View>
				)}

				{!this.state.initializing && this.state.connectedToParty && (
					<View style={styles.container}>
						<Button
							buttonStyle={styles.button}
							backgroundColor={styles.button.backgroundColor}
							raised
							onPress={() => this.leaveParty()}
							icon={{name: "exit-to-app", type: "material-icons"}}
							title='Leave Party'/>
					</View>
				)}
			</ScrollView>
		);
	}
}

export default PartyView;
