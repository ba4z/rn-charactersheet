import React from "react";
import styles from "./styles";
import {Text, View, Dimensions, Modal, Alert, TouchableOpacity, ActivityIndicator} from "react-native";
import {Avatar, Button, Icon} from "react-native-elements";
import {TabBar, TabView} from "react-native-tab-view";
import StatsView from "./stats";
import FeaturesView from "./features";
import LevelUp from "./levelUp";
import ItemsView from "./items";
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import ImagePicker from "react-native-image-crop-picker";
import ActionSheet from 'react-native-actionsheet'
import uploadImage from "../../shared/imageUpload";
import Stats from "../../om/Stats";
import Character from "../../om/Character";
import PartyView from "./party";

// For Setting up party rules:
// https://firebase.googleblog.com/2016/10/group-security-in-firebase-database.html
class CharacterView extends React.Component {
	actionSheet;

	static navigationOptions = ({navigation}) => ({
		title: `${navigation.state.params.character.name}`,
		headerRight: (
			<TouchableOpacity>
				<Icon
					onPress={() => {
						navigation.navigate("CharacterInfo", {character: navigation.state.params.character})
					}}
					name='ios-information-circle-outline'
					type='ionicon'
					color='#517fa4'
					iconStyle={{paddingRight: 20}}
				/>
			</TouchableOpacity>
		),
	});

	constructor(props) {
		super(props);
		this.state = {
			busy: true,
			character: props.navigation.state.params.character,
			proficiencyBonus: Character.getProficiencyBonus(props.navigation.state.params.character.level),
			levelUpModalVisible: false,
			index: 0,
			uploading: false,
			routes: [
				{key: "stats", title: "Stats"},
				{key: "features", title: "Traits"},
				{key: "items", title: "Items"},
				{key: "spells", title: "Spells"},
				{key: "party", title: "Party"},
			]
		};
	}

	componentDidMount() {
		Promise.all([this.loadFeatures(), this.loadItems(), this.loadStats()]).then(data => {
			this.setState({features: data[0].val(), items: data[1].val(), stats: data[2].val(), busy: false});
		}, err => {
			Alert.alert("Error retrieving data", err.message);
		});
	}

	setModalVisible(visible) {
		this.setState({levelUpModalVisible: visible});
	}

	levelUp(newStats) {
		let stats = new Stats(this.state.character.characterId);
		stats.initFromDb(newStats);
		stats.save().then(() => {
			this.state.character.levelUp(newStats).then(() => {
				this.setState({stats: stats, proficiencyBonus: Character.getProficiencyBonus(this.state.character.level)});
			}, err => {
				Alert.alert("Error saving Character", err.message);
			});
		}, err => {
			Alert.alert("Error saving Character", err.message);
		});
	}

	loadItems() {
		return firebase.database().ref(`items/${firebase.auth().currentUser.uid}/${this.state.character.characterId}`).once();
	}

	loadFeatures() {
		return firebase.database().ref(`features/${firebase.auth().currentUser.uid}/${this.state.character.characterId}`).once();
	}

	loadStats() {
		return firebase.database().ref(`stats/${firebase.auth().currentUser.uid}/${this.state.character.characterId}`).once();
	}

	addItem(newItem) {
		let currentItems = this.state.items || {};
		currentItems[newItem.itemId] = newItem;
		this.setState({items: currentItems});
	}

	removeItem(removeItem) {
		let currentItems = this.state.items;
		if(currentItems && currentItems[removeItem.itemId]) {
			removeItem.remove().then(() => {
				delete currentItems[removeItem.itemId];
				this.setState({items: currentItems});
			}, err => {
				Alert.alert("Error removing item", err.message);
			});
		}
	}

	addFeature(newFeature) {
		let currentFeatures = this.state.features || {};
		currentFeatures[newFeature.featureId] = newFeature;
		this.setState({features: currentFeatures});
	}

	removeFeature(removeFeature) {
		let currentFeatures = this.state.features;
		if(currentFeatures && currentFeatures[removeFeature.featureId]) {
			removeFeature.remove().then(() => {
				delete currentFeatures[removeFeature.featureId];
				this.setState({features: currentFeatures});
			}, err => {
				Alert.alert("Error removing feature", err.message);
			});
		}
	}

	viewItem(item) {
		this.props.navigation.navigate("ViewItem", {item: item, removeItem: this.removeItem.bind(this)});
	}

	viewFeature(feature) {
		this.props.navigation.navigate("ViewFeature", {feature: feature, removeFeature: this.removeFeature.bind(this)});
	}

	selectImage(index) {
		let location = `avatars/${firebase.auth().currentUser.uid}/${this.state.character.characterId}/`;
		switch (index) {
			case 0:
				ImagePicker.openCamera({
					width: 300,
					height: 300,
					cropping: true,
					mediaType: "photo",
				}).then(image => {
					this.setState({uploading: true});
					uploadImage(image, location, "avatar.jpg").then(result => {
						console.log(result);
						let character = this.state.character;
						character.avatarUrl = result.downloadURL;
						this.setState({uploading: false, character: character});
						this.state.character.save();
					}, err => {
						console.log(err);
						Alert.alert("Could not upload Image", err.message);
						this.setState({uploading: false});
					})
				}, err => {
					console.log(err);
					Alert.alert("Could not open Camera", err.message);
				});
				break;
			case 1:
				ImagePicker.openPicker({
					width: 300,
					height: 300,
					cropping: true,
					mediaType: "photo",
				}).then(image => {
					this.setState({uploading: true});
					uploadImage(image, location, "avatar.jpg").then(result => {
						console.log(result);
						let character = this.state.character;
						character.avatarUrl = result.downloadURL;
						this.setState({uploading: false, character: character});
						this.state.character.save();
					}, err => {
						console.log(err);
						Alert.alert("Could not upload Image", err.message);
						this.setState({uploading: false});
					})
				}, err => {
					console.log(err);
					// Alert.alert("Could not open photo library", err.message);
				});
				break;
		}
	}

	render() {
		if(this.state.busy) {
			return (<View style={{flex: 1}}>
						<Spinner visible={this.state.busy}/>
					</View>)
		}

		return (
			<View style={{flex: 1}}>
				<Modal animationType="slide"
				       presentationStyle="formSheet"
				       visible={this.state.levelUpModalVisible}>
						<LevelUp close={this.setModalVisible.bind(this)} levelUp={this.levelUp.bind(this)} currentStats={this.state.stats} currentLevel={this.state.character.level}/>
				</Modal>

				<View style={styles.avatarRow}>
					<View>
						<Avatar
							xlarge
							rounded
							source={{uri: this.state.character.avatarUrl ||"https://qph.fs.quoracdn.net/main-qimg-d52e0a64616d59e3e2411ce47d07349c-c"}}
							onPress={() => this.actionSheet.show()}
							containerStyle={{marginLeft: 10}}
							avatarStyle={this.state.uploading ? {opacity: 0.5} : {}}
							activeOpacity={0.7}
						/>
						{ this.state.uploading &&
							<View style={{
								position: "absolute",
								left: 60,
								top: 60,
								justifyContent: "center",
								alignItems: "center",
								flex: 1
							}}>
								<ActivityIndicator size="large" color="black" animating={this.state.uploading}
								                   hidesWhenStopped={true}/>
							</View>
						}

					</View>
					<View style={{flexDirection: "column"}}>
						<Text style={styles.avatarText}>
							{this.state.character.name}{"\n"}
							{this.state.character.characterClass.name}, {this.state.character.race.name}{"\n"}
							Level {this.state.character.level} (+{this.state.proficiencyBonus} proficiency)
						</Text>

						<Button
							style={styles.levelUp}
							iconRight={{name: "level-up", type: "font-awesome"}}
							backgroundColor={"#2794F0"}
							onPress={() => {
								this.setModalVisible(true)
							}}
							title='Level Up!'/>
					</View>
				</View>
				<TabView
					navigationState={this.state}
					swipeEnabled={false}
					renderTabBar={props =>
						<TabBar
							{...props}
							style={{backgroundColor: "transparent", borderBottomColor: "gray", borderBottomWidth: 0.5}}
							labelStyle={styles.tabLabelStyle}
							indicatorStyle={{ backgroundColor: '#2794F0', height: 3  }}
						/>
					}
					renderScene={({route}) => {
						switch (route.key) {
							case "stats":
								if(this.state.stats) {
									return <StatsView stats={this.state.stats} characterId={this.state.character.characterId} character={this.state.character}/>;
								}
								break;
							case "features":
								return <FeaturesView features={this.state.features} viewFeature={this.viewFeature.bind(this)} characterId={this.state.character.characterId} addFeature={this.addFeature.bind(this)}/>;
							case "items":
								return <ItemsView items={this.state.items} viewItem={this.viewItem.bind(this)} characterId={this.state.character.characterId} addItem={this.addItem.bind(this)}/>;
							case "party":
								return <PartyView character={this.state.character}/>;
							default:
								return null;
						}
					}}
					onIndexChange={index => this.setState({index})}
					initialLayout={{width: Dimensions.get("window").width, height: 0}}
				/>
				<ActionSheet
					ref={o => this.actionSheet = o}
					title={'Upload Image'}
					options={['Take Photo', 'Select from Library', 'Cancel']}
					cancelButtonIndex={2}
					onPress={(index) => { this.selectImage(index) }}
				/>
			</View>
		);
	}
}

export default CharacterView;
