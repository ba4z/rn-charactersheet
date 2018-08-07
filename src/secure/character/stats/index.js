import React, {Component} from "react";
import styles from "./styles";
import {Icon, List, ListItem} from "react-native-elements";
import {ScrollView, Text, View} from "react-native";
import UpDownInput from "../../../shared/upDownInput";
import Stats from "../../../om/Stats";
import Character from "../../../om/Character";

class StatsView extends React.Component {

	stats;

	constructor(props) {
		super(props);
		console.log(props);
		stats = new Stats(this.props.characterId);
		stats.initFromDb(this.props.stats);
		this.state = {stats: stats, proficiencyBonus: Character.getProficiencyBonus(this.props.character.level)};
	}

	componentWillReceiveProps(nextProps) {
		let localStats = new Stats(nextProps.characterId);
		localStats.initFromDb(nextProps.stats);
		stats = localStats;
		this.setState({stats: stats, proficiencyBonus: Character.getProficiencyBonus(nextProps.character.level)});
	}

	updateArmor(newVal) {
		stats.armorClass = newVal;
		stats.save().then(result => {
			this.setState({stats: stats});
		});
	}

	updateHitPoints(newVal) {
		stats.hitPoints = newVal;
		stats.save().then(result => {
			this.setState({stats: stats});
		});
	}

	updateSpeed(newVal) {
		stats.speed = newVal;
		stats.save().then(result => {
			this.setState({stats: stats});
		});
	}

	getSkillValue(skillType, i) {
		let skill = this.state.stats.skills[skillType];
		let skillMod = Stats.getModifier(this.state.stats[skill.type]);
		if(skill.proficient) {
			skillMod += this.state.proficiencyBonus;
		}
		if(skillMod > 0){
			skillMod = `+${skillMod}`;
		}

		return skillMod;
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<View style={{flex: 1, justifyContent: "center", flexDirection: "row", marginTop: 25}}>
						<UpDownInput value={this.state.stats.hitPoints} max={this.state.stats.maxHitPoints} icon="heart" iconType="font-awesome"
						             color="#c10303" onChange={this.updateHitPoints.bind(this)}/>
						<UpDownInput value={this.state.stats.armorClass} icon="shield" iconType="font-awesome"
						             onChange={this.updateArmor.bind(this)}/>
						<UpDownInput value={this.state.stats.speed} icon="run" iconType="material-community"
						             onChange={this.updateSpeed.bind(this)} stepSize={5} min={5}/>
					</View>
					<View style={styles.iconRow}>
						<View style={styles.iconGroup}>
							<Text style={styles.iconText}>Strength</Text>
							<Icon
								name='sword'
								containerStyle={styles.icon}
								type='material-community'
								size={50}
								color='black'
							/>
							<Text style={styles.statText}>{Stats.getModifier(this.state.stats.strength, true)}</Text>
							<Text style={styles.iconText}>{this.state.stats.strength}</Text>

						</View>
						<View style={styles.iconGroup}>
							<Text style={styles.iconText}>Dexterity</Text>
							<Icon
								name='run-fast'
								containerStyle={styles.icon}
								type='material-community'
								size={50}
								color='black'
							/>
							<Text style={styles.statText}>{Stats.getModifier(this.state.stats.dexterity, true)}</Text>
							<Text style={styles.iconText}>{this.state.stats.dexterity}</Text>
						</View>
						<View style={styles.iconGroup}>
							<Text style={styles.iconText}>Constitution</Text>
							<Icon
								containerStyle={styles.icon}
								name='book'
								type='entypo'
								size={50}
								color='black'
							/>
							<Text style={styles.statText}>{Stats.getModifier(this.state.stats.constitution, true)}</Text>
							<Text style={styles.iconText}>{this.state.stats.constitution}</Text>
						</View>
						<View style={styles.iconGroup}>
							<Text style={styles.iconText}>Intelligence</Text>
							<Icon
								name='graduation-cap'
								containerStyle={styles.icon}
								type='entypo'
								size={50}
								color='black'
							/>
							<Text style={styles.statText}>{Stats.getModifier(this.state.stats.intelligence, true)}</Text>
							<Text style={styles.iconText}>{this.state.stats.intelligence}</Text>
						</View>
						<View style={styles.iconGroup}>
							<Text style={styles.iconText}>Wisdom</Text>
							<Icon
								name='lightbulb-on'
								containerStyle={styles.icon}
								type='material-community'
								size={50}
								color='black'
							/>
							<Text style={styles.statText}>{Stats.getModifier(this.state.stats.wisdom, true)}</Text>
							<Text style={styles.iconText}>{this.state.stats.wisdom}</Text>
						</View>
						<View style={styles.iconGroup}>
							<Text style={styles.iconText}>Charisma</Text>
							<Icon
								name='street-view'
								containerStyle={styles.icon}
								type='font-awesome'
								size={50}
								color='black'
							/>
							<Text style={styles.statText}>{Stats.getModifier(this.state.stats.charisma, true)}</Text>
							<Text style={styles.iconText}>{this.state.stats.charisma}</Text>
						</View>
					</View>
				</View>
				<View style={styles.container}>
					<Text style={{fontSize: 25, textAlign: "center"}}>Skills</Text>
					<List containerStyle={{marginBottom: 20}}>
						{
							this.state.stats && this.state.stats.skills ? (
								Object.keys(this.state.stats.skills).map((key, i) => (
									<ListItem
										key={i}
										hideChevron={true}
										rightTitleStyle={{color: "black", fontWeight: "bold"}}
										title={this.state.stats.skills[key].label}
										subtitle={this.state.stats.skills[key].type}
										badge={
											{value: this.getSkillValue(key, i),
											 containerStyle: (this.state.stats.skills[key].proficient ? {backgroundColor: "#35bc00"} : "")}
											}
									/>
								))
							) : (
								<Text></Text>
							)
						}
					</List>
				</View>

			</ScrollView>
		);
	}
}

export default StatsView;
