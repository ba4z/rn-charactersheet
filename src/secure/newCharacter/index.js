import React from "react";
import styles from "./styles";
import {ScrollView, TouchableOpacity, View, Alert, TouchableHighlight, TextInput} from "react-native";
import {Badge, Button, Card, CheckBox, Icon, List, ListItem, Text} from "react-native-elements";
import Swiper from "react-native-swiper";
import ModalDropdown from "react-native-modal-dropdown";
import Character from "../../om/Character";
import Item from "../../om/Item";
import Stats from "../../om/Stats";
import UpDownInput from "../../shared/upDownInput";
import Feature from "../../om/Feature";

// This looks very promising:
// http://www.dnd5eapi.co/docs/#base, https://github.com/adrpadua/5e-database

const dndAPI = "http://dnd5eapi.co/api";

class NewCharacter extends React.Component {
	swiper;
	checkBoxChange = {};
	availableLanguages = Feature.availableLanguages;
	stats;

	static alignmentOptions = [
		{name: "Lawful Good", id: "lawful-good"},
		{name: "Neutral Good", id: "neutral-good"},
		{name: "Chaotic Good", id: "chaotic-good"},
		{name: "Lawful Neutral", id: "lawful-neutral"},
		{name: "Neutral", id: "neutral"},
		{name: "Chaotic Neutral", id: "chaotic-neutral"},
		{name: "Lawful Evil", id: "lawful-evil"},
		{name: "Neutral Evil", id: "neutral-evil"},
		{name: "Chaotic Evil", id: "chaotic-evil"}
	];

	constructor(props) {
		super(props);
		this.state = {
			races: null,
			raceStats: null,
			classes: null,
			classStats: null,
			class: "",
			race: "",
			name: "",
			background: "",
			alignment: "",
			level: 1,
			skills: Stats.skillTypes,
			savingThrows: {},
			languages: {},
			strength: 10,
			dexterity: 10,
			constitution: 10,
			intelligence: 10,
			wisdom: 10,
			charisma: 10,
			maxHitPoints: 30,
			armorClass: 10,
			speed: 30,
			proficiencyBonus: 2,
		};

		stats = [
			{name: "Strength", property: "strength"},
			{name: "Dexterity", property: "dexterity"},
			{name: "Constitution", property: "constitution"},
			{name: "Intelligence", property: "intelligence"},
			{name: "Wisdom", property: "wisdom"},
			{name: "Charisma", property: "charisma"},
		];
	}

	componentDidMount() {
		Promise.all([this.loadClasses(), this.loadRaces()]).then(data => {
			console.log(data);
			this.setState({classes: data[0].results, races: data[1].results});
		}, err => {
			Alert.alert("Error retrieving data", err.message);
		});
	}

	loadClasses() {
		return fetch(`${dndAPI}/classes`).then(res => {
			return res.json();
		});
	}

	loadRaces() {
		return fetch(`${dndAPI}/races`).then(res => {
			return res.json();
		});
	}

	fetchData(url) {
		return fetch(url).then(res => {
			return res.json();
		});
	}

	onSelect(index, value, type) {
		let key = type;
		let obj = {};
		obj[key] = value;
		this.setState(obj)
	}

	onChangeLevel(newLevel) {
		this.setState({level: newLevel, proficiencyBonus: Character.getProficiencyBonus(newLevel)});
	}

	next() {
		Promise.all([this.fetchData(this.state.class.url), this.fetchData(this.state.race.url), this.fetchData(`${dndAPI}/languages`)]).then(data => {
			console.log(data);

			let selectedProfiencies = {};
			if(data[0].proficiency_choices) {
				let that = this;
				data[0].proficiency_choices.forEach((choiceList, index) => {
					choiceList.from.map(choice => {
						choice.name = choice.name.replace("Skill: ", "");
						choice.label = choice.name;
						choice.value = choice.name;
						return choice;
					});
					that.checkBoxChange[index] = (selectedItems) => {
						if(selectedItems.length <= this.state.proficiencyChoices[index].choose) {
							let selectedProfiencies = this.state.selectedProfiencies;
							selectedProfiencies[index] = selectedItems;
							return that.setState({selectedProfiencies: selectedProfiencies});
						}
						Alert.alert("Limit Reached", `Max number of proficiencies is: ${this.state.proficiencyChoices[index].choose}`);
					};
					selectedProfiencies[index] = [];
				});
			}

			this.setState({
				classStats: data[0],
				raceStats: data[1],
				proficiencyChoices: data[0].proficiency_choices,
				selectedProfiencies: selectedProfiencies
			});

			this.fetchData(data[0].starting_equipment.url).then(result => {
				let selectedEquipment = [];
				for(let i = 0; i < result.choices_to_make; i++) {
					selectedEquipment.push({});
				}
				this.setState({startingEquipment: result, selectedEquipment: selectedEquipment});
			}, err => {
				Alert.alert("Error retrieving data", err.message);
			});
			this.nextSlide();
		}, err => {
			this.nextSlide();
			Alert.alert("Error retrieving data", err.message);
		});
	}

	nextSlide() {
		this.swiper.scrollBy(1);
		console.log(this.state);
	}

	previousSlider() {
		if(!this.state.busy) {
			this.swiper.scrollBy(-1);
		}
	}

	createCharacter() {
		this.setState({busy: true});
		let newCharacter = new Character(this.state.name, this.state.class, this.state.race, this.state.alignment);

		if(this.state.optionalLanguage) {
			this.state.raceStats.languages.push({value: this.state.optionalLanguage, label: this.state.optionalLanguage});
		}
		newCharacter.languages = this.state.raceStats.languages;
		newCharacter.level = this.state.level;
		newCharacter.flaws = this.state.flaws;
		newCharacter.bonds = this.state.bonds;
		newCharacter.background = this.state.background;
		newCharacter.personalityTraits = this.state.personalityTraits;
		newCharacter.ideals = this.state.ideals;
		newCharacter.backgroundStory = this.state.backgroundStory;
		newCharacter.age = this.state.age;
		newCharacter.height = this.state.height;
		newCharacter.weight = this.state.weight;
		newCharacter.eyeColor = this.state.eyeColor;
		newCharacter.skinColor = this.state.skinColor;
		newCharacter.hairColor = this.state.hairColor;

		let stats = new Stats(newCharacter.characterId);
		stats.strength = this.state.strength;
		stats.dexterity = this.state.dexterity;
		stats.constitution = this.state.constitution;
		stats.intelligence = this.state.intelligence;
		stats.wisdom = this.state.wisdom;
		stats.charisma = this.state.charisma;

		stats.maxHitPoints = this.state.maxHitPoints;
		stats.hitPoints = this.state.maxHitPoints;
		stats.armorClass = this.state.armorClass;
		stats.speed = this.state.speed;
		stats.size = this.state.raceStats.size;
		Object.keys(this.state.skills).map(skill => {
			stats.setSkill(skill, this.state.skills[skill])
		});

		console.log(newCharacter);
		console.log(stats);
		console.log(this.state.languages);

		Promise.all([newCharacter.save(), stats.save()]).then(data => {
			Object.keys(this.state.languages).map(lang => {
				let newFeature = new Feature(newCharacter.characterId);
				newFeature.type = Feature.featureTypes.language.key;
				newFeature.name = Feature.availableLanguages[lang].name;
				newFeature.description = `The ability to speak ${Feature.availableLanguages[lang].name}`;
				newFeature.save();
			});
			setTimeout(() => {
				this.setState({busy: false});
				this.props.onCreate();
			}, 1000);
		}, err =>{
			Alert.alert(
				"Error creating user",
				err.message,
			);
		});
	};

	displayRow = (data) => {
		return (
			<TouchableHighlight>
				<View>
					<Text style={styles.dropdownItem}>{`${data.name}`}</Text>
				</View>
			</TouchableHighlight>
		)
	};

	displayLanguages = () => {
		if(this.state.languages) {
			let languages = "";
			Object.keys(this.state.languages).map((lang, index) => {
				languages += this.state.languages[lang].name + ", "
			});
			if(languages.length > 1) {
				return languages.slice(0, -2);
			}
		}
	};

	getSkillModifier(skill) {
		let proficient = this.state.skills[skill].proficient;
		let modifier = Stats.getModifier(this.state[this.state.skills[skill].type]);
		if(proficient){
			modifier += this.state.proficiencyBonus;
		}
		if(modifier > 0) {
			return `+${modifier}`
		}
		return modifier;
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
				<TouchableOpacity style={{height: 25, marginTop: 25, marginRight: 25, alignSelf: "flex-end"}}
				                  onPress={() => {
					                  this.props.close()
				                  }}>
					<Icon name='md-close' type='ionicon' size={25}/>
				</TouchableOpacity>
				<Swiper showsButtons={false} loop={false} scrollEnabled={false}
				        showsPagination={true} ref={component => this.swiper = component}>
					<ScrollView style={styles.slide}>
						<Text h3>Create a new Character</Text>
						<TextInput
							style={styles.input}
							autoCorrect={false}
							onChangeText={(text) => this.setState({name: text})}
							placeholder={"Enter your character name"}
							value={this.state.name}
						/>
						<ModalDropdown
							options={this.state.classes}
							textStyle={{width: "100%", fontSize: 20}}
							dropdownStyle={{width: "75%", maxHeight: "70%", height: "auto"}}
							renderRow={(row) => this.displayRow(row)}
							defaultValue={"Tap to select a class"}
							onSelect={(index, value) => {
								this.onSelect(index, value, "class")
							}}
							renderButtonText={rowData => `Class: ${rowData.name}`}
						/>
						<ModalDropdown
							options={this.state.races}
							textStyle={{width: "100%", marginTop: 25, fontSize: 20}}
							dropdownStyle={{width: "75%", maxHeight: "70%", height: "auto"}}
							renderRow={(row) => this.displayRow(row)}
							defaultValue={"Tap to select a race"}
							onSelect={(index, value) => {
								this.onSelect(index, value, "race")
							}}
							renderButtonText={rowData => `Race: ${rowData.name}`}
						/>
						<ModalDropdown
							options={NewCharacter.alignmentOptions}
							textStyle={{width: "100%", marginTop: 25, fontSize: 20}}
							dropdownStyle={{width: "75%", maxHeight: "70%", height: "auto"}}
							renderRow={(row) => this.displayRow(row)}
							defaultValue={"Tap to select an alignment"}
							onSelect={(index, value) => {
								this.onSelect(index, value, "alignment")
							}}
							renderButtonText={rowData => `Alignment: ${rowData.name}`}
						/>
						<Button
							raised
							large
							backgroundColor={"#2794F0"}
							rightIcon={{name: "chevron-right", type: "feather"}}
							buttonStyle={styles.button}
							onPress={() => {
								this.next()
							}}
							title='Next'/>
					</ScrollView>
					<ScrollView style={styles.slide}>
						{this.state.raceStats !== null && this.state.classStats !== null && (
							<View>
								<View style={{marginTop: 25}}>
									<Text h3>Starting Level</Text>
									<Text style={styles.subheader}>Select your starting level. Max level is 20. Proficiency bonus will be calculated automatically.</Text>
									<View style={styles.rowContainer}>
										<View style={styles.twoRows}>
											<Text style={styles.subHeaderFixedWidth}>Starting Level</Text>
											<UpDownInput value={this.state.level} max={Character.maxLevel} min={1} onChange={(newVal) => this.onChangeLevel(newVal)}/>
											<Text>Proficiency Bonus: {"\n"}+{this.state.proficiencyBonus}</Text>
										</View>
									</View>
								</View>
								<View style={{marginTop: 25}}>
									<Text h3>Health</Text>
									<Text style={styles.subheader}>Based on your selected class and race your characters size is: {this.state.raceStats.size}</Text>
									<View style={styles.rowContainer}>
										<View style={styles.twoRows}>
											<Text style={styles.subHeaderFixedWidth}>Max Hit Points</Text>
											<UpDownInput value={this.state.maxHitPoints} onChange={(newVal) => {this.setState({maxHitPoints: newVal});}}/>
										</View>
										<View style={styles.twoRows}>
											<Text style={styles.subHeaderFixedWidth}>Armor Class</Text>
											<UpDownInput value={this.state.armorClass} onChange={(newVal) => {this.setState({armorClass: newVal});}}/>
										</View>
										<View style={styles.twoRows}>
											<Text style={styles.subHeaderFixedWidth}>Speed</Text>
											<UpDownInput value={this.state.speed} onChange={(newVal) => {this.setState({speed: newVal});}}/>
										</View>
									</View>
								</View>
							</View>
						)}
						<View style={styles.buttonRow}>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								leftIcon={{name: "chevron-left", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.previousSlider()
								}}
								title='Previous'/>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								rightIcon={{name: "chevron-right", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.nextSlide()
								}}
								title='Next'/>
						</View>
					</ScrollView>
					<ScrollView style={styles.slide}>
						<View>
							<Text h3>Ability Scores</Text>
							<Text style={styles.subheader}>Select the stats your character has saving throws for and set the value. Modifiers will be calculated automatically.</Text>
							<View style={styles.rowContainer}>
								{
									stats.map((stat, index) => {
										return <View style={{marginTop: 15, flex: 1, flexDirection: "row"}} key={index}>
											<CheckBox
												title={stat.name}
												checked={this.state.savingThrows[stat.property]}
												iconType='material'
												checkedIcon='check'
												uncheckedIcon='add'
												onPress={() => {
													let savingThrows = this.state.savingThrows;
													savingThrows[stat.property] = !this.state.savingThrows[stat.property];
													this.setState({savingThrows: savingThrows})
												}}
												containerStyle={{
													backgroundColor: "white",
													flex: 3,
													borderTopWidth: 0,
													borderLeftWidth: 0,
													borderRightWidth: 0,
													justifyContent: "center",
													marginLeft: 0
												}}
											/>
											<View style={{flex: 2, alignItems: "center", justifyContent: "center"}}>
												<UpDownInput value={this.state[stat.property]}
												             min={Stats.minStatValue}
												             max={Stats.maxStatValue}
												             onChange={(newVal) => {
													             this.setState({[stat.property]: newVal});
												             }}/>
											</View>
											<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
												<Text style={{color: "#848484", fontSize: 10, marginBottom: 3}}>Modifier</Text>>
												<Text>{Stats.getModifier(this.state[stat.property], true)}</Text>
											</View>
										</View>
									})
								}
							</View>
						</View>
						<View style={styles.buttonRow}>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								leftIcon={{name: "chevron-left", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.previousSlider()
								}}
								title='Previous'/>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								rightIcon={{name: "chevron-right", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.nextSlide()
								}}
								title='Next'/>
						</View>
					</ScrollView>
					<ScrollView style={styles.slide}>
						{this.state.raceStats !== null && this.state.classStats !== null && (
							<View>
								<Text h3>Skills</Text>
								<Text style={styles.subheader}>Select the skills your character is proficient at. The modifiers will be updated automatically</Text>
								{Object.keys(this.state.skills).map((skill, index) => {
									return (
										<View style={{marginTop: 15, flex: 1, flexDirection: "row"}} key={index}>
											<CheckBox
												title={this.state.skills[skill].label}
												checked={this.state.skills[skill].proficient}
												iconType='material'
												checkedIcon='check'
												uncheckedIcon='add'
												onPress={() => {
													let skills = this.state.skills;
													skills[skill].proficient = !this.state.skills[skill].proficient;
													this.setState({skills: skills})}
												}
												containerStyle={{backgroundColor: "white", flex: 3, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, justifyContent: "center"}}
											/>
											<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
												<Badge
													value={this.getSkillModifier(skill)}
													containerStyle={ (this.state.skills[skill].proficient ? {backgroundColor: "#35bc00"} : "")}
												/>
												<Text style={{color: "#7a7a7a", paddingTop: 3, fontSize: 12}}>{this.state.skills[skill].type}</Text>
											</View>
										</View>
									)
								})}
							</View>
						)}
						<View style={styles.buttonRow}>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								leftIcon={{name: "chevron-left", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.previousSlider()
								}}
								title='Previous'/>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								rightIcon={{name: "chevron-right", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.nextSlide()
								}}
								title='Next'/>
						</View>
					</ScrollView>
					<ScrollView style={styles.slide}>
						<View>
							<Text h3>Language</Text>
							<Text style={styles.subheader}>Select all languages your character speaks. If there are other languages your character speaks, you can add them after your character is created.</Text>
							{Object.keys(this.availableLanguages).map((language, index) => {
								return (
									<View style={{marginTop: 15, flex: 1, flexDirection: "row"}} key={index}>
										<CheckBox
											title={Feature.availableLanguages[language].name}
											checked={this.state.languages[language] && this.state.languages[language].proficient}
											iconType='material'
											checkedIcon='check'
											uncheckedIcon='add'
											onPress={() => {
												let languages = this.state.languages;
												if(!languages[language]) {
													languages[language] = { name: Feature.availableLanguages[language].name};
												}
												languages[language].proficient = this.state.languages[language] ? !this.state.languages[language].proficient : true;
												this.setState({languages: languages})}
											}
											containerStyle={{backgroundColor: "white", flex: 3, borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0, justifyContent: "center"}}
										/>
									</View>
								)
							})}
						</View>
						<View style={styles.buttonRow}>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								leftIcon={{name: "chevron-left", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.previousSlider()
								}}
								title='Previous'/>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								rightIcon={{name: "chevron-right", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.nextSlide()
								}}
								title='Next'/>
						</View>
					</ScrollView>
					<ScrollView style={styles.slide}>
						<View>
							<Text h3>Character Information</Text>
							<Text style={styles.subheader}>All fields are optional and can be added later</Text>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={1}
								placeholder="Character Age"
								onChangeText={(text) => this.setState({age: text})}
								value={this.state.age}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={1}
								placeholder="Character Height"
								onChangeText={(text) => this.setState({height: text})}
								value={this.state.height}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={1}
								placeholder="Character Weight"
								onChangeText={(text) => this.setState({weight: text})}
								value={this.state.weight}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={1}
								placeholder="Character Eye Color"
								onChangeText={(text) => this.setState({eyeColor: text})}
								value={this.state.eyeColor}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={1}
								placeholder="Character Skin Color"
								onChangeText={(text) => this.setState({skinColor: text})}
								value={this.state.skinColor}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={1}
								placeholder="Character Hair Color"
								onChangeText={(text) => this.setState({hairColor: text})}
								value={this.state.hairColor}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={2}
								placeholder="Personality Traits"
								onChangeText={(text) => this.setState({personalityTraits: text})}
								value={this.state.personalityTraits}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={2}
								placeholder="Ideals"
								onChangeText={(text) => this.setState({ideals: text})}
								value={this.state.ideals}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={2}
								placeholder="Bonds"
								onChangeText={(text) => this.setState({bonds: text})}
								value={this.state.bonds}/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={2}
								placeholder="Flaws"
								onChangeText={(text) => this.setState({flaws: text})}
								value={this.state.flaws}/>
							<TextInput
								style={styles.multilineInput}
								onChangeText={(text) => this.setState({background: text})}
								placeholder={"Character background type (Charlatan, Noble, Soldier, Etc)"}
								value={this.state.background}
							/>
							<TextInput
								style={styles.multilineInput}
								multiline={true}
								numberOfLines={6}
								placeholder="Character Background Story"
								onChangeText={(text) => this.setState({backgroundStory: text})}
								value={this.state.backgroundStory}/>
						</View>
						<View style={styles.buttonRow}>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								leftIcon={{name: "chevron-left", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.previousSlider()
								}}
								title='Previous'/>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								rightIcon={{name: "chevron-right", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.nextSlide()
								}}
								title='Next'/>
						</View>
					</ScrollView>
					<ScrollView style={styles.slide}>
						<View>
							<Text h3>Summary</Text>
							<Text style={styles.subheader}>All items, spells and other proficiencies you can add after creating the initial character.</Text>
							<Card title="Character Details">
								<View style={styles.twoRows}>
									<Text style={styles.headerColumn}>Name</Text><Text style={styles.contentColumn}>{this.state.name}</Text>
								</View>
								<View style={styles.twoRows}>
									<Text style={styles.headerColumn}>Class</Text><Text style={styles.contentColumn}>{this.state.class.name}</Text>
								</View>
								<View style={styles.twoRows}>
									<Text style={styles.headerColumn}>Race</Text><Text style={styles.contentColumn}>{this.state.race.name}</Text>
								</View>
								<View style={styles.twoRows}>
									<Text style={styles.headerColumn}>Alignment</Text><Text style={styles.contentColumn}>{this.state.alignment.name}</Text>
								</View>
								<View style={styles.twoRows}>
									<Text style={styles.headerColumn}>Spoken Languages</Text>
									<Text style={styles.contentColumn}>
										{this.displayLanguages()}
									</Text>
								</View>
							</Card>

							<Card title="Stats">
								<List containerStyle={{marginTop: 0, borderTopWidth: 0}}>
									<ListItem
										containerStyle={styles.listItemContainer}
										key={0} hideChevron={true}
										rightTitleStyle={styles.badgeStyle}
										title="Strength"
										badge={{
											value: `${this.state.strength} | ${Stats.getModifier(this.state.strength, true)}`,
											containerStyle: this.state.savingThrows.strength ? styles.badgeStyleProficient : styles.badgeStyle
										}}
									/>
									<ListItem
										containerStyle={styles.listItemContainer}
										key={1} hideChevron={true}
										rightTitleStyle={styles.badgeStyle}
										title="Dexterity"
										badge={{
											value: `${this.state.dexterity} | ${Stats.getModifier(this.state.dexterity, true)}`,
											containerStyle: this.state.savingThrows.dexterity ? styles.badgeStyleProficient : styles.badgeStyle}}
									/>
									<ListItem
										containerStyle={styles.listItemContainer}
										key={2} hideChevron={true}
										rightTitleStyle={styles.badgeStyle}
										title="Constitution"
										badge={{
											value: `${this.state.constitution} | ${Stats.getModifier(this.state.constitution, true)}`,
											containerStyle: this.state.savingThrows.constitution ? styles.badgeStyleProficient : styles.badgeStyle}}
									/>
									<ListItem
										containerStyle={styles.listItemContainer}
										key={3} hideChevron={true}
										rightTitleStyle={styles.badgeStyle}
										title="Intelligence"
										badge={{
											value: `${this.state.intelligence} | ${Stats.getModifier(this.state.intelligence, true)}`,
											containerStyle: this.state.savingThrows.intelligence ? styles.badgeStyleProficient : styles.badgeStyle}}
									/>
									<ListItem
										containerStyle={styles.listItemContainer}
										key={4} hideChevron={true}
										rightTitleStyle={styles.badgeStyle}
										title="Wisdom"
										badge={{
											value: `${this.state.wisdom} | ${Stats.getModifier(this.state.wisdom, true)}`,
											containerStyle: this.state.savingThrows.wisdom ? styles.badgeStyleProficient : styles.badgeStyle}}
									/>
									<ListItem
										containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
										key={5} hideChevron={true}
										rightTitleStyle={styles.badgeStyle}
										title="Charisma"
										badge={{
											value: `${this.state.charisma} | ${Stats.getModifier(this.state.charisma, true)}`,
											containerStyle: this.state.savingThrows.charisma ? styles.badgeStyleProficient : styles.badgeStyle}}
									/>
								</List>
							</Card>

							<Card title="Skills">
								<List containerStyle={{marginTop: 0, borderTopWidth: 0}}>
									{
										this.state.skills ? (
											Object.keys(this.state.skills).map((key, i) => (
												<ListItem
													containerStyle={{borderTopWidth: 0}}
													key={i}
													hideChevron={true}
													rightTitleStyle={styles.badgeStyle}
													title={this.state.skills[key].label}
													subtitle={this.state.skills[key].type}
													badge={{
														value: this.getSkillModifier(key),
														containerStyle: this.state.skills[key].proficient ? styles.badgeStyleProficient : styles.badgeStyle}}
												/>
											))
										) : (
											<Text></Text>
										)
									}
								</List>

							</Card>
						</View>
						<View style={styles.buttonRow}>
							<Button
								raised
								medium
								backgroundColor={"#2794F0"}
								leftIcon={{name: "chevron-left", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.previousSlider()
								}}
								title='Previous'/>
							<Button
								loading={this.state.busy}
								raised
								medium
								backgroundColor={"#2794F0"}
								rightIcon={{name: "chevron-right", type: "feather"}}
								buttonStyle={styles.button}
								onPress={() => {
									this.createCharacter()
								}}
								title='Create Character'/>
						</View>
					</ScrollView>
				</Swiper>
			</View>
		);
	}
}

export default NewCharacter;
