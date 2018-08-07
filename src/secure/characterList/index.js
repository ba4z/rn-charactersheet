import React from "react";
import styles from "./styles";
import {Modal, RefreshControl, ScrollView, Text, TouchableOpacity, Alert, View} from "react-native";
import firebase from "react-native-firebase";
import {Button, Card, Icon} from "react-native-elements";
import NewCharacter from "../newCharacter";
import Character from "../../om/Character";


class CharacterList extends React.Component {
	static navigationOptions = ({navigation}) => {
		return {
			title: "Your Characters",
			gesturesEnabled: false,
			headerLeft: null,
			headerRight: (
				<TouchableOpacity>
					<Icon
						onPress={() => {
							Alert.alert(
								"Log out",
								"Are you sure you want to log out?",
								[
									{text: "Cancel", style: "cancel"},
									{text: "Yes", onPress: () => navigation.navigate("Login")},
								],
								{cancelable: true}
							)}
						}
						name='ios-power'
						type='ionicon'
						color='#517fa4'
						iconStyle={{paddingRight: 20}}
					/>
				</TouchableOpacity>
			),
		};
	};

	constructor(props) {
		super(props);
		this.state = {
			characters: [],
			refreshing: false,
			newCharacterModalVisible: false
		};
	}

	componentDidMount() {
		this._onRefresh();
	}

	loadCharacters() {
		return firebase.database().ref(`characters/${firebase.auth().currentUser.uid}`).once("value");
	}

	_onRefresh = () => {
		this.setState({refreshing: true});
		this.loadCharacters().then((snapshot) => {
			let characterList = [];
			for (let key in snapshot.val()) {
				let fbObj = snapshot.val()[key];
				let character = new Character(fbObj.name, fbObj.characterClass, fbObj.race, fbObj.alignment);
				character.initFromDb(fbObj);
				characterList.push(character);
			}
			this.setState({refreshing: false, characters: characterList});
			console.log(characterList);
		}, error => {
			Alert.alert("Could not load characters", error.message);
		});
	};

	newCharacter() {
		this.setState({newCharacterModalVisible: true})
	}

	closeNewCharacterModal() {
		this.setState({newCharacterModalVisible: false})
	}

	onCreateNewCharacter() {
		this.setState({newCharacterModalVisible: false});
		this._onRefresh();
	}

	selectCharacter(character) {
		this.props.navigation.navigate("Character", {character: character});
	}

	deleteCharacter(character) {
		Promise.all([
			firebase.database().ref(`characters/${firebase.auth().currentUser.uid}/${character.characterId}`).remove(),
			firebase.database().ref(`stats/${firebase.auth().currentUser.uid}/${character.characterId}`).remove(),
			firebase.database().ref(`items/${firebase.auth().currentUser.uid}/${character.characterId}`).remove(),
			firebase.database().ref(`features/${firebase.auth().currentUser.uid}/${character.characterId}`).remove()
		]).then(result => {
			this._onRefresh();
		}, err => {
			console.log(err);
		});
	}

	onDeleteCharacter(character) {
		Alert.alert(
			"Delete Character",
			"Are you sure you want to delete your character? This cannot be undone",
			[
				{text: "Cancel", style: "cancel"},
				{text: "Yes", onPress: () => this.deleteCharacter(character)},
			],
			{cancelable: true}
		)
	}

	render() {
		return (
			<ScrollView style={{flex: 1}}
			            refreshControl={
				            <RefreshControl
					            refreshing={this.state.refreshing}
					            onRefresh={this._onRefresh}
				            />
			            }>
				{this.state.characters.map((character, i) => (
					<TouchableOpacity onPress={() => this.selectCharacter(character)} style={styles.cardStyle}
					                  key={character.characterId}>
						<Card
							containerStyle={styles.cardStyle}
							title={character.name}
							image={{uri: character.avatarUrl || "https://clearmountaindevelopment.com/wp-content/uploads/2018/06/the-witcher-3-wild-hunt-geralt-and-ciri_1152x720.jpg"}}
						>
							<View style={{flex: 1, flexDirection: "row"}}>
								<View style={{flex: 1}}>
									<Text style={styles.cardText}>Level {character.level} {character.characterClass.name} {character.race.name}</Text>
									<Text style={styles.cardText} numberOfLines={2}>{character.backgroundStory}</Text>
								</View>
								<View style={{flex: 0.2}}>
									<TouchableOpacity onPress={() => this.onDeleteCharacter(character)}>
										<Icon
											iconStyle={{alignSelf: "flex-end", padding: 10}}
											name='trash'
											size={35}
											type='evilicon'
											color='#d64444'
										/>
									</TouchableOpacity>
								</View>
							</View>
						</Card>
					</TouchableOpacity>
				))}

				<Button
					raised
					large
					backgroundColor={"#2794F0"}
					buttonStyle={{marginTop: 25, marginBottom: 25}}
					rightIcon={{name: "user-plus", type: "font-awesome"}}
					onPress={() => {
						this.newCharacter()
					}}
					title='Create a new Character'/>

				<Modal visible={this.state.newCharacterModalVisible} animationType="slide">
					<NewCharacter close={this.closeNewCharacterModal.bind(this)}
					              onCreate={this.onCreateNewCharacter.bind(this)}/>
				</Modal>
			</ScrollView>
		);
	}
}

export default CharacterList;
