import React from "react";
import styles from "./styles";
import {Text, Alert} from "react-native";
import {Button, Card} from "react-native-elements";


class ViewFeature extends React.Component {
	// static navigationOptions = ({navigation}) => ({
	// 	title: `${navigation.state.params.item.name}`
	// });

	constructor(props) {
		super(props);
		this.state = {
			feature: props.navigation.state.params.feature
		};
	}

	confirm() {
		Alert.alert(
			'Please Confirm',
			'Are you sure you want to remove this item?',
			[
				{text: 'Cancel', onPress: () => {}},
				{text: 'Yes', onPress: () => {
						this.props.navigation.goBack();
						this.props.navigation.state.params.removeFeature(this.state.feature)
				}},
			]
		)
	}

	render() {
		return (
			<Card title={this.state.feature.name} >
				<Text style={{marginBottom: 10}}>
					{this.state.feature.description}
				</Text>
				<Button
					icon={{name: 'ios-trash-outline', type: "ionicon", size: 25}}
					backgroundColor='#03A9F4'
					onPress={() => {this.confirm()}}
					title='Remove' />
			</Card>
		);
	}
}

export default ViewFeature;
