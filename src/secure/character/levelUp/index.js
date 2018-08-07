import React from "react";
import {ScrollView, Text, View} from "react-native";
import {Button, Card} from "react-native-elements";
import UpDownInput from "../../../shared/upDownInput";
import Character from "../../../om/Character";


class LevelUp extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			stats: props.currentStats
		}
	}

	render() {
		return (
			<ScrollView>
				<Card
					containerStyle={{borderWidth: 0}}
					title="Level Up!"
					image={{uri: "https://qph.fs.quoracdn.net/main-qimg-d52e0a64616d59e3e2411ce47d07349c-c"}}>
					<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
						<Text style={{marginBottom: 10}}>
							Congrats on leveling up! Choose your new stats below.
						</Text>
						<Text style={{marginBottom: 10, fontSize: 20, marginTop: 20}}>
							Your new proficiency bonus will be: +{Character.getProficiencyBonus(this.props.currentLevel +1)}
						</Text>
						<Text style={{opacity: 0.6}}>
							Was +{Character.getProficiencyBonus(this.props.currentLevel)} (updated every 4 levels)
						</Text>
						<View style={{
							width: 300,
							alignItems: "center"
						}}>
							<Text style={{fontSize: 20, marginTop: 20}}>Select your new max health:</Text>
							<UpDownInput value={this.state.stats._maxHitPoints} onChange={(newVal) => {
								let currentStats = this.state.stats;
								currentStats._maxHitPoints = newVal;
								this.setState({stats: currentStats});
							}}/>
						</View>
						<View style={{flex: 1, flexDirection: "row"}}>
							<Button
								backgroundColor="#03A9F4"
								onPress={() => {
									this.props.levelUp(this.state.stats);
									this.props.close(false)
								}}
								buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 10}}
								title="Confirm"/>
							<Button
								backgroundColor="#03A9F4"
								onPress={() => {
									this.props.close(false)
								}}
								buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
								title="Close"/>
						</View>
					</View>
				</Card>
			</ScrollView>
		);
	}
}

export default LevelUp;
