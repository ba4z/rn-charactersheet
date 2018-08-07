import React from "react";
import styles from "./styles";
import {Alert} from "react-native";
import {Button, Card, ListItem} from "react-native-elements";
import Item from "../../../../om/Item";


class ViewItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {item: props.navigation.state.params.item};
	}

	generateDiceLabel = () => {
		let label = "";
		let item = this.state.item;
		if(item.diceAmount && item.diceType) {
			label = item.diceAmount + item.diceType;
			if(item.extraType) {
				label += ` ${item.extraType}`;
			}
		}
		return label;
	};

	confirm() {
		Alert.alert(
			'Please Confirm',
			'Are you sure you want to remove this item?',
			[
				{text: 'Cancel', onPress: () => {}},
				{text: 'Yes', onPress: () => {
						this.props.navigation.goBack();
						this.props.navigation.state.params.removeItem(this.state.item);
				}},
			]
		)
	}

	render() {
		return (
			<Card title={this.state.item.name} >
				{ this.state.item.type === Item.itemTypes.weapon.key &&
					<ListItem
						key={0}
						title={this.generateDiceLabel()}
						leftIcon={{name: "dice-multiple", type: "material-community"}}
						hideChevron={true}
					/>
				}

				{ this.state.item.type === Item.itemTypes.weapon.key && this.state.item.extraAmount &&
					<ListItem
						key={1}
						title={`+${this.state.item.extraAmount}`}
						leftIcon={{name: "sword", type: "material-community"}}
						hideChevron={true}
					/>
				}

				{this.state.item.type === Item.itemTypes.armor.key &&
					<ListItem
						key={2}
						title={`+${this.state.item.extraAmount}`}
						leftIcon={{name: "shield", type: "font-awesome"}}
						hideChevron={true}
					/>
				}
				<ListItem
					containerStyle={{borderBottomWidth: 0}}
					key={3}
					title={`Amount: ${this.state.item.amount}`}
					leftIcon={{name: "info", type: "feather"}}
					hideChevron={true}
				/>
				<ListItem
					containerStyle={{borderBottomWidth: 0}}
					key={4}
					title={this.state.item.description}
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

export default ViewItem;
