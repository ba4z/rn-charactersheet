import React from "react";
import styles from "./styles";
import {Icon, List, ListItem} from "react-native-elements";
import {Alert, Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
import NewSpell from "./newSpell";
import Spell from "../../../om/Spell";
import UpDownInput from "../../../shared/upDownInput";

class SpellsView extends React.Component {
	static navigationOptions = ({navigation}) => ({
		title: `Items`,
	});

	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			fbItems: props.spells,
			spells: this.processSpells(props.spells),
			addItemModal: false,
			spellSlots: {}
		};
	}

	processSpells(spells) {
		let updatedSpells = {};
		if(spells) {
			Object.keys(spells).map((spellId) => {
				let newSpell = new Spell(this.props.characterId);
				newSpell.initFromDb(spells[spellId]);
				updatedSpells[spellId] = newSpell;
			});
		}
		updatedSpells = this.sortObject(updatedSpells);
		return updatedSpells;
	}

	sortObject(o) {
		return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.setState({
			fbItems: nextProps.spells,
			spells: this.processSpells(nextProps.spells)
		});
	}

	showAddSpellModal(visible) {
		this.setState({addItemModal: visible});
	}

	addSpell(newItem) {
		this.props.addSpell(newItem);
		this.showAddSpellModal(false);
	}

	generateSpellSlots(level) {
		let spellSlots = [];
		if(level > Spell.maxSpellLevel) {
			level = Spell.maxSpellLevel;
		}
		for (let i = 0; i < level; i++) {
			spellSlots.push(<View key={i}>
				<Text style={{display: "flex", textAlign: "center"}}>Level {i + 1}</Text>
				<UpDownInput value={this.state.spellSlots[i]} color="#c10303" min={"0"} onChange={(newVal) => {
					let currentSpellSlots = this.state.spellSlots;
					currentSpellSlots[i] = newVal;
					this.setState({spellSlots: currentSpellSlots})}
				}/>
			</View>);
		}
		return spellSlots;
	}

	render() {
		return (
			<ScrollView>

				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.addItemModal}>
					<NewSpell addSpell={this.addSpell.bind(this)} show={this.showAddSpellModal.bind(this)} characterId={this.props.character.characterId}/>
				</Modal>

				<View>
					<Text style={styles.header}>Spell slots left per Level</Text>
					<View style={{flex: 1, justifyContent: "center", flexDirection: "row", marginTop: 25}}>
						{this.generateSpellSlots(this.props.character.level)}
					</View>
				</View>

				<List containerStyle={{marginBottom: 20}}>
					{
						Object.entries(this.state.spells).map(([spellId, spell])=> (
							<ListItem
								onPress={() => {this.props.viewSpell(spell, spellId)}}
								roundAvatar
								underlayColor={"#dedede"}
								leftIcon={{
									name: Spell.spellTypes[spell.type].icon,
									type: Spell.spellTypes[spell.type].iconType
								}}
								key={spellId}
								title={spell.name}
								badge={{value: `Level: ${spell.level}`}}
								subtitle={spell.description}
							/>
						))
					}
				</List>
				<TouchableOpacity onPress={() => { this.showAddSpellModal(true);}}
				                  style={{marginRight: 10}}>
					<Icon name='plus' type='feather'/>
				</TouchableOpacity>
			</ScrollView>
		);
	}
}

export default SpellsView;
