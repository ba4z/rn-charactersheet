import React from "react";
import styles from "./styles";
import {Alert, Modal} from "react-native";
import {Button, Card, ListItem, Text} from "react-native-elements";
import Item from "../../../../om/Item";


class ViewItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			spell: props.navigation.state.params.spell,
			partyId: props.navigation.state.params.partyId,
			showShareModal: false
		};
	}

	generateDiceLabel = () => {
		let label = "";
		let item = this.state.spell;
		if(item.diceAmount && item.diceType) {
			label = item.diceAmount + item.diceType;
			if(item.extraType) {
				label += ` ${item.extraType}`;
			}
		}
		return label;
	};

	removeItem() {
		Alert.alert(
			'Please Confirm',
			'Are you sure you want to remove this item?',
			[
				{text: 'Cancel', onPress: () => {}},
				{text: 'Yes', onPress: () => {
					this.props.navigation.goBack();
					this.props.navigation.state.params.removeItem(this.state.spell);
				}},
			]
		)
	}

	shareItem() {
		this.setState({showShareModal: true});
	}


	render() {
		return (
			<Card title={this.state.spell.name} >
				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.showShareModal}>
					<Text h3>Sharing will be available soon!</Text>
				</Modal>


				{ this.state.spell.type === Item.itemTypes.weapon.key &&
					<ListItem
						key={0}
						title={this.generateDiceLabel()}
						leftIcon={{name: "dice-multiple", type: "material-community"}}
						hideChevron={true}
					/>
				}

				{ this.state.spell.type === Item.itemTypes.weapon.key && this.state.spell.extraAmount &&
					<ListItem
						key={1}
						title={`+${this.state.spell.extraAmount}`}
						leftIcon={{name: "sword", type: "material-community"}}
						hideChevron={true}
					/>
				}

				{this.state.spell.type === Item.itemTypes.armor.key &&
					<ListItem
						key={2}
						title={`+${this.state.spell.extraAmount}`}
						leftIcon={{name: "shield", type: "font-awesome"}}
						hideChevron={true}
					/>
				}
				<ListItem
					containerStyle={{borderBottomWidth: 0.5}}
					key={3}
					title={`Amount: ${this.state.spell.amount}`}
					leftIcon={{name: "info", type: "feather"}}
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
					onPress={() => {this.removeItem()}}
					title='Remove' />
				<Button
					buttonStyle={{marginTop: 25}}
					icon={{name: 'ios-share-alt', type: "ionicon", size: 25}}
					backgroundColor='#03A9F4'
					onPress={() => {this.shareItem()}}
					title='Share Item' />
			</Card>
		);
	}
}

export default ViewItem;
