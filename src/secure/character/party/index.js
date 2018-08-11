import React, {Component} from "react";
import styles from "./styles";
import {ScrollView, View, Modal, Alert, ActivityIndicator, TouchableOpacity} from "react-native";
import {Button, Icon, List, ListItem, Text} from "react-native-elements";
import firebase from "react-native-firebase";
import Moment from "moment";
import NewParty from "./newParty";
import NewInvite from "./newInvite";
import ActionSheet from "react-native-actionsheet";
let uuid = require("react-native-uuid");


class PartyView extends React.Component {

	// Create new party and add the id to the character object, look up parties using that
	// Invite only to an email address. Look up name once the user joins and use their name from their auth instead

	actionSheet;
	selectedActionSheetListItem;
	partyListener;

	constructor(props) {
		super(props);
		this.state = {
			initializing: true,
			joinPartyModal: false,
			createPartyModal: false,
			inviteUserModal: false,
			character: props.character,
			connectedToParty: false,
			partyOwner: false,
			partyId: null
		};
		firebase.auth().currentUser.updateProfile({displayName: "Another user!"});

		setTimeout(() => {
			if(props.character.connectedParty) {
				return this.findYourParty(props.character.connectedParty);
			}
			this.checkMyInvites();
		}, 500);
	}

	findYourParty(partyId) {
		this.partyListener = firebase.database().ref(`parties/${partyId}`);
		this.partyListener.on("value", result => {

			//TODO stop listening after certain events
			console.log("an update!");
			console.log(result.val());

			if(result.val()) {
				let members = result.val().members;
				let partyName = result.val().name;
				let partyOwner = false;
				if(members && members[firebase.auth().currentUser.uid] && members[firebase.auth().currentUser.uid] === "owner") {
					partyOwner = true;
				}
				let pending = result.val().pending;
				this.setState({members: members, pendingPartyInvites: pending, initializing: false, connectedToParty: true, partyOwner: partyOwner, partyId: partyId, partyName: partyName});
				return;
			}
			this.setState({initializing: false, connectedToParty: false});
		}, err => {
			Alert.alert("Could not load party", err.message);
			this.setState({initializing: false, connectedToParty: false});
		});
	}

	checkMyInvites() {
		return firebase.database().ref("invites").orderByChild("email").equalTo(firebase.auth().currentUser.email).on("value", result => {
			//Checking the invite list and comparing it with the actual party
			let invites = [];
			if(result.val()) {
				Object.keys(result.val()).map(inviteId => {
					this.getPartyName(result.val()[inviteId].partyId).then(partyName => {
						invites.push({inviteId: inviteId, name: partyName.val(), partyId: result.val()[inviteId].partyId});
						this.setState({invites: invites});
					}, err => {
						//Can fail silently, probably has no access to that party, or party was deleted
						console.error(err);
					});
				});
			} else {
				this.setState({invites: []});
			}
			this.setState({initializing: false, connectedToParty: false});
		}, err => {
			Alert.alert("Error looking for invites", err.message);
		});
	}

	getPartyName(partyId) {
		return firebase.database().ref(`parties/${partyId}/name`).once("value");
	}

	findInvitesForParty(partyId) {
		return firebase.database().ref("invites").orderByChild("partyId").equalTo(partyId).once("value");
	};

	createParty(partyName) {
		let newPartyId = uuid.v1();
		this.setState({createPartyModal: false});

		let members = {};
		members[firebase.auth().currentUser.uid] = {role: "owner", name: firebase.auth().currentUser.displayName};

		console.log(members);
		firebase.database().ref(`parties/${newPartyId}/name`).set(partyName).then(() => {
			firebase.database().ref(`parties/${newPartyId}/members`).set(members).then(result => {
				this.props.character.connectedParty = newPartyId;
				this.props.character.save();
				this.findYourParty(newPartyId);
			}, err => {
				Alert.alert("Could not create party", err.message);
			});
		}, err => {
			Alert.alert("Could not create party", err.message);
		});

	}

	leavePartyConfirm() {
		let message = "You will leave the party and will not be able to get back unless invited";
		if(this.state.partyOwner) {
			message = "This party will be closed and all members will be removed."
		}
		Alert.alert(
			'Are you sure?',
			message,
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'OK', onPress: () => this.leaveParty()},
			],
			{ cancelable: true }
		)
	}

	removeInvite(inviteId, partyId) {
		firebase.database().ref(`invites/${inviteId}`).remove();
		if(partyId) {
			firebase.database().ref(`parties/${partyId}/pending/${inviteId}`).remove();
		}
	}

	removeParty() {
		let partyRef = firebase.database().ref(`parties/${this.state.partyId}`);
		partyRef.remove();
	}

	leaveParty() {
		if(this.state.partyOwner) {
			//Query all invites with current party id and remove them
			//Remove current party and all properties

			this.findInvitesForParty(this.state.partyId).then(result => {
				if(result.val()) {
					Object.keys(result.val()).map(inviteId => {
						this.removeInvite(inviteId);
					});
				}
			}, err => {
				//whatever
			});
			this.removeParty();
			this.props.character.connectedParty = "";
			this.props.character.save();
			this.setState({connectedToParty: false, partyId: null, partyOwner: false});
			this.partyListener.off();
		} else {
			//Remove self from memberlist
			firebase.database().ref(`parties/${this.state.partyId}/members/${firebase.auth().currentUser.uid}`).remove().then(result => {
				console.log("Removed from memberlist");
				this.setState({connectedToParty: false, partyId: null, partyOwner: false});
				this.state.character.connectedParty = "";
				this.state.character.save();
				this.partyListener.off();
			}, err => {
				Alert.alert("Could not leave party", err.message);
			});
		}
	}

	inviteUser(email) {
		let newInviteId = uuid.v1();
		let timeStamp = new Date().getTime();
		firebase.database().ref(`parties/${this.state.partyId}/pending/${newInviteId}`).set({email: email, invited: timeStamp, partyId: this.state.partyId}).then(result => {
			firebase.database().ref(`invites/${newInviteId}`).set({email: email, invited: timeStamp, partyId: this.state.partyId}).then(result => {
				this.setState({inviteUserModal: false});
			}, err => {
				Alert.alert("Could not create invitation", err.message);
			});
		}, err => {
			Alert.alert("Could not create invitation", err.message);
		});
	}

	joinPartyConfirm(selectedParty) {
		Alert.alert(
			"Join Party",
			`Are you sure you want to join the party with the name "${selectedParty.name}"?`,
			[
				{text: 'Cancel', onPress: () => {}, style: 'cancel'},
				{text: 'OK', onPress: () => this.joinParty(selectedParty)},
			],
			{ cancelable: true }
		)
	}

	joinParty(selectedParty) {
		//Add self as member, remove invitation
		let newMember = {inviteId: selectedParty.inviteId, role: "member", name: this.props.character.name};
		firebase.database().ref(`parties/${selectedParty.partyId}/members/${firebase.auth().currentUser.uid}`).set(newMember).then(() => {
			this.props.character.connectedParty = selectedParty.partyId;
			this.props.character.save();
			this.findYourParty(selectedParty.partyId);
			this.removeInvite(selectedParty.inviteId, selectedParty.partyId);
		}, err => {
			Alert.alert("Could not join Party", err.message);
		})
	}

	showPendingInvitationMenu(invitationId, invitation) {
		this.selectedActionSheetListItem = {invitationId, invitation};
		this.actionSheet.show();
	}

	pendingUserAction(index) {
		if(index === 0 && this.selectedActionSheetListItem) {
			this.removeInvite(this.selectedActionSheetListItem.invitationId, this.selectedActionSheetListItem.invitation.partyId);
		}
	}

	render() {
		return (
			<ScrollView>
				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.createPartyModal}>
					<NewParty closeModal={() => this.setState({createPartyModal: false})} createParty={this.createParty.bind(this)}/>
				</Modal>

				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.inviteUserModal}>
					<NewInvite closeModal={() => this.setState({inviteUserModal: false})} inviteUser={this.inviteUser.bind(this)}/>
				</Modal>


				{this.state.initializing && (
					<View style={styles.container}>
						<ActivityIndicator size="large"/>
						<Text style={{marginTop: 25}}>Searching for Party...</Text>
					</View>
				)}

				{!this.state.initializing && this.state.connectedToParty && (
					<View style={styles.container}>
						<Text h4 style={{marginBottom: 25}}>Connected to party: "{this.state.partyName}"</Text>
						<Text style={styles.header}>Pending Invites:</Text>
						<View style={{width: "100%"}}>
							<List containerStyle={{marginBottom: 20}}>
								{
									this.state.pendingPartyInvites && Object.keys(this.state.pendingPartyInvites).length > 0 && Object.keys(this.state.pendingPartyInvites).map((l, i) => (
										<ListItem
											key={i}
											rightIcon={{name: "dots-three-vertical", type: "entypo"}}
											onPressRightIcon={() => {this.showPendingInvitationMenu(l, this.state.pendingPartyInvites[l])}}
											title={this.state.pendingPartyInvites[l].email}
											subtitle={Moment(this.state.pendingPartyInvites[l].invited).format("dddd MMMM Do, h:mm a")}
										/>
									))
								}
							</List>
							<TouchableOpacity onPress={() => {this.setState({inviteUserModal: true})}}
							                  style={{marginRight: 10}}>
								<Icon name='plus' type='feather'/>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{!this.state.initializing && !this.state.connectedToParty && this.state.invites && this.state.invites.length > 0 && (
					<View style={styles.container}>
						<Text style={styles.header}>Open Invitations:</Text>
						<View style={{width: "100%"}}>
							<List containerStyle={{marginBottom: 20}}>
								{
									this.state.invites.map((l, i) => (
										<ListItem
											key={i}
											hideChevron={true}
											title={`Party: ${l.name}`}
											onPress={() => this.joinPartyConfirm(l)}
											subtitle={Moment(l.invited).format("dddd MMMM Do, h:mm a")}
										/>
									))
								}
							</List>
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
						<Text style={styles.header}>Current Members:</Text>
						{this.state.members && Object.keys(this.state.members).length > 0 &&  (
							<View style={{width: "100%"}}>
								<List containerStyle={{marginBottom: 20}}>
									{
										Object.keys(this.state.members).map((l, i) => (
											<ListItem
												key={i}
												hideChevron={true}
												// rightIcon={{name: "dots-three-vertical", type: "entypo"}}
												title={this.state.members[l].name}
												subtitle={this.state.members[l].role}
											/>
										))
									}
								</List>
							</View>
						)}
						<Button
							buttonStyle={styles.button}
							backgroundColor={styles.button.backgroundColor}
							raised
							onPress={() => this.leavePartyConfirm()}
							icon={{name: "exit-to-app", type: "material-icons"}}
							title={this.state.partyOwner ? 'Close Party' : 'Leave Party'}/>
					</View>
				)}

				<ActionSheet
					ref={o => this.actionSheet = o}
					title={'User Actions'}
					options={['Remove Invitation', 'Cancel']}
					destructiveButtonIndex={0}
					cancelButtonIndex={1}
					onPress={(index) => { this.pendingUserAction(index) }}
				/>
			</ScrollView>
		);
	}
}

export default PartyView;
