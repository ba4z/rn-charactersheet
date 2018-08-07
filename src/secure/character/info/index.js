import React, {Component} from "react";
import styles from "./styles";
import {ScrollView, Text, View, TouchableOpacity, Share, Modal, TextInput} from "react-native";
import {Button, Card, Icon, ListItem} from "react-native-elements";
import LevelUp from "../levelUp";

class InfoView extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props.navigation.state.params.character);
		this.state = {
			character: this.props.navigation.state.params.character,
			editing: false
		};
	}

	share(title, value) {
		Share.share({
			message: value,
			title: title
		}, {
			// Android only:
			dialogTitle: title,
		})
	}

	editField(title, value, property) {
		console.log("Editing field!");
		this.setState({editing: true, editTitle: title, editValue: value, editProperty: property});
	};

	saveField() {
		let currentCharacter = this.state.character;
		currentCharacter[this.state.editProperty] = this.state.editValue;
		currentCharacter.save();
		this.setState({character: currentCharacter});
		this.closeModal();
	}

	closeModal() {
		this.setState({editing: false});
	}

	render() {
		return (
			<ScrollView>
				<Modal animationType="slide" presentationStyle="formSheet"
				       visible={this.state.editing}>
					<TouchableOpacity style={{height: 25, marginTop: 25, marginRight: 25, alignSelf: "flex-end"}}
					                  onPress={() => {this.closeModal()}}>
						<Icon name='md-close' type='ionicon' size={25}/>
					</TouchableOpacity>
					<ScrollView style={{flex: 1, padding: 20}}>
						<Text style={styles.header}>Edit {this.state.editTitle}</Text>
						<TextInput
							multiline={true}
							style={styles.input}
							numberOfLines={1}
							onChangeText={(text) => this.setState({editValue: text})}
							value={this.state.editValue}/>
						<Button raised={true} title='Save' backgroundColor={"#03A9F4"} buttonStyle={{marginBottom: 50}} onPress={() => this.saveField()}/>
					</ScrollView>
				</Modal>
				<View style={{paddingBottom: 15}}>
					<Card title="Personality Traits">
						<Text>{this.state.character.personalityTraits}</Text>
						<View style={{
							flex: 1,
							justifyContent: "flex-start",
							alignItems: "center",
							flexDirection: "row",
							marginTop: 20
						}}>
							<TouchableOpacity onPress={() => {this.share("Personality Traits", this.state.character.personalityTraits)}}>
								<Icon
									name='share-alternative'
									type='entypo'
									size={20}
									iconStyle={{opacity: 0.8}}
									containerStyle={{marginRight: 10}}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {this.editField("Personality Traits", this.state.character.personalityTraits, "personalityTraits")}}>
								<Icon
									name='edit'
									size={20}
									type='entypo'
									iconStyle={{opacity: 0.8}}
								/>
							</TouchableOpacity>
						</View>
					</Card>


					<Card title="Ideals">
						<Text>{this.state.character.ideals}</Text>
						<View style={{
							flex: 1,
							justifyContent: "flex-start",
							alignItems: "center",
							flexDirection: "row",
							marginTop: 20
						}}>
							<TouchableOpacity onPress={() => {this.share("Ideals", this.state.character.ideals)}}>
								<Icon
									name='share-alternative'
									type='entypo'
									size={20}
									iconStyle={{opacity: 0.8}}
									containerStyle={{marginRight: 10}}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {this.editField("Ideals", this.state.character.ideals, "ideals")}}>
								<Icon
									name='edit'
									size={20}
									type='entypo'
									iconStyle={{opacity: 0.8}}
								/>
							</TouchableOpacity>
						</View>
					</Card>

					<Card title="Flaws">
						<Text>{this.state.character.flaws}</Text>
						<View style={{
							flex: 1,
							justifyContent: "flex-start",
							alignItems: "center",
							flexDirection: "row",
							marginTop: 20
						}}>
							<TouchableOpacity onPress={() => {this.share("Personality Flaws", this.state.character.flaws)}}>
								<Icon
									name='share-alternative'
									type='entypo'
									size={20}
									iconStyle={{opacity: 0.8}}
									containerStyle={{marginRight: 10}}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {this.editField("Personality Flaws", this.state.character.flaws, "flaws")}}>
								<Icon
									name='edit'
									type='entypo'
									size={20}
									iconStyle={{opacity: 0.8}}
								/>
							</TouchableOpacity>
						</View>
					</Card>
					<Card title="Character Background">
						<Text>{this.state.character.backgroundStory}</Text>
						<View style={{
							flex: 1,
							justifyContent: "flex-start",
							alignItems: "center",
							flexDirection: "row",
							marginTop: 20
						}}>
							<TouchableOpacity onPress={() => {this.share("Background Story", this.state.character.backgroundStory)}}>
								<Icon
									name='share-alternative'
									type='entypo'
									size={20}
									iconStyle={{opacity: 0.8}}
									containerStyle={{marginRight: 10}}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {this.editField("Background Story", this.state.character.backgroundStory, "backgroundStory")}}>
								<Icon
									name='edit'
									type='entypo'
									size={20}
									iconStyle={{opacity: 0.8}}
								/>
							</TouchableOpacity>
						</View>
					</Card>

					<Card title="Character Visual Traits">
						<ListItem
							key={0}
							title={"Age"}
							rightTitle={this.state.character._age}
							rightTitleStyle={styles.rightTitle}
							hideChevron={true}
						/>
						<ListItem
							key={1}
							title={"Height"}
							rightTitle={this.state.character._height}
							rightTitleStyle={styles.rightTitle}
							hideChevron={true}
						/>
						<ListItem
							key={2}
							title={"Weight"}
							rightTitle={this.state.character._weight}
							rightTitleStyle={styles.rightTitle}
							hideChevron={true}
						/>
						<ListItem
							key={3}
							title={"Eye Color"}
							rightTitle={this.state.character._eyeColor}
							rightTitleStyle={styles.rightTitle}
							hideChevron={true}
						/>
						<ListItem
							key={4}
							title={"Skin Color"}
							rightTitle={this.state.character._skinColor}
							rightTitleStyle={styles.rightTitle}
							hideChevron={true}
						/>
						<ListItem
							key={5}
							title={"Hair Color"}
							rightTitle={this.state.character._hairColor}
							rightTitleStyle={styles.rightTitle}
							hideChevron={true}
						/>
					</Card>
				</View>
			</ScrollView>
		);
	}
}

export default InfoView;
