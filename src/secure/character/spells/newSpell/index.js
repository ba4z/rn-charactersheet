import React from "react";
import styles from "./styles";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import Swiper from "react-native-swiper";
import {TextInput} from "@shoutem/ui/components/TextInput";
import {Button, Icon} from "react-native-elements";
import RadioForm from "react-native-simple-radio-button";
import UpDownInput from "../../../../shared/upDownInput";
import Spell from "../../../../om/Spell";

class newSpell extends React.Component {
	swiper;
	newSpell;

	constructor(props) {
		super(props);
		this.newSpell = new Spell(this.props.characterId);
		console.log(this.newSpell);
		this.state = {
			currentSlide: 0,
			type: "",
			name: "",
			description: "",
			diceAmount: 1,
			diceType: "d4",
			extraType: "",
			extraAmount: "",
			amount: "1",
			spellLevel: 1
		};
	}

	cellViews = Object.keys(Spell.spellTypes).map((type) => {
		return (
			<TouchableOpacity key={type} style={styles.gridItem} onPress={() => {
				this.selectType(type)
			}}>
				<Icon
					name={Spell.spellTypes[type].icon}
					type={Spell.spellTypes[type].iconType}
					size={50}
				/>
				<Text>{Spell.spellTypes[type].name}</Text>
			</TouchableOpacity>
		);
	});

	selectType(type) {
		this.setState({type: type});
		this.nextSlide();
	}

	closeModal() {
		this.props.show(false);
	}

	saveSpell() {
		this.newSpell.name = this.state.name;
		this.newSpell.description = this.state.description;
		this.newSpell.type = this.state.type;
		this.newSpell.level = this.state.spellLevel;
		this.newSpell.amount = this.state.amount;
		this.newSpell.save();
		this.props.addSpell(this.newSpell);
	}

	nextSlide() {
		this.setState({currentSlide: this.state.currentSlide++});
		this.swiper.scrollBy(this.state.currentSlide);
	}

	render() {
		return (
			<View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
				<TouchableOpacity style={{height: 25, marginTop: 25, marginRight: 25, alignSelf: "flex-end"}}
				                  onPress={() => {
					                  this.closeModal()
				                  }}>
					<Icon name='md-close' type='ionicon' size={25}/>
				</TouchableOpacity>
				<Swiper style={styles.wrapper} showsButtons={false} loop={false} scrollEnabled={false}
				        showsPagination={false} ref={component => this.swiper = component}>
					<ScrollView>
						<View style={styles.slide}>
							<Text style={styles.text}>Select Type</Text>
							<View style={styles.grid}>
								{this.cellViews}
							</View>
						</View>
					</ScrollView>
					<ScrollView>
						<View style={styles.slide}>
							<Text style={{...styles.text, ...styles.header}}>Describe Your
								New {this.state.type ? Spell.spellTypes[this.state.type].name : ""}</Text>
							<TextInput
								style={styles.input}
								placeholder={"Name of Spell"}
								onChangeText={(text) => this.setState({name: text})}
							/>
							<TextInput
								style={{...styles.input, ...styles.inputMultiLine}}
								placeholder={"Description"}
								multiline={true}
								numberOfLines={4}
								onChangeText={(text) => this.setState({description: text})}
							/>

							<Button title='Continue' onPress={() => this.nextSlide()}
							        backgroundColor={"#2794F0"}/>
						</View>
					</ScrollView>
					<ScrollView>
						<View style={styles.slide}>
							<Text
								style={{...styles.text, ...styles.header}}> Set {this.state.type ? Spell.spellTypes[this.state.type].name : ""} Stats</Text>

							<Text style={styles.subheader}>Spell Level</Text>
							<UpDownInput value={this.state.spellLevel}
							             onChange={(newVal) => this.setState({spellLevel: newVal})}/>
							<Button title='Add Spell' onPress={() => this.saveSpell()}
							        backgroundColor={"#2794F0"}/>
						</View>

					</ScrollView>
				</Swiper>
			</View>
		);
	}
}

export default newSpell;
