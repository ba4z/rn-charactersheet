import React from "react";
import styles from "./styles";
import {Alert} from "react-native";
import {Button, Card, ListItem} from "react-native-elements";
import Spell from "../../../../om/Spell";


class ViewSpell extends React.Component {

	constructor(props) {
		super(props);
		this.state = {spell: props.navigation.state.params.spell};
	}

	generateDiceLabel = () => {
		let label = "";
		let spell = this.state.spell;
		if(spell.diceAmount && spell.diceType) {
			label = spell.diceAmount + spell.diceType;
			if(spell.extraType) {
				label += ` ${spell.extraType}`;
			}
		}
		return label;
	};

	confirm() {
		Alert.alert(
			'Please Confirm',
			'Are you sure you want to remove this spell?',
			[
				{text: 'Cancel', onPress: () => {}},
				{text: 'Yes', onPress: () => {
						this.props.navigation.goBack();
						this.props.navigation.state.params.removeSpell(this.state.spell);
				}},
			]
		)
	}

	render() {
		return (
			<Card title={this.state.spell.name} >
				<ListItem
					containerStyle={{borderBottomWidth: 0.5}}
					key={3}
					title={`Spell Level: ${this.state.spell.level}`}
					leftIcon={{name: "chevrons-up", type: "feather"}}
					hideChevron={true}
				/>
				<ListItem
					containerStyle={{borderBottomWidth: 0}}
					key={4}
					title={this.state.spell.description}
					leftIcon={{name: "info", type: "feather"}}
					hideChevron={true}
				/>
				<Button
					buttonStyle={{marginTop: 25}}
					icon={{name: 'ios-trash-outline', type: "ionicon", size: 25}}
					backgroundColor='#03A9F4'
					onPress={() => {this.confirm()}}
					title='Remove' />
			</Card>
		);
	}
}

export default ViewSpell;
