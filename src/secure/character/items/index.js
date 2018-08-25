import React from "react";
import {Icon, List, ListItem} from "react-native-elements";
import {Alert, Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
import NewItem from "./newItem";
import Item from "../../../om/Item";

class ItemsView extends React.Component {
	static navigationOptions = ({navigation}) => ({
		title: `Items`,
	});

	constructor(props) {
		super(props);
		this.state = {
			fbItems: props.items,
			items: this.processItems(props.items),
			addItemModal: false
		};
	}

	processItems(items) {
		let updatedItems = {};
		if(items) {
			Object.keys(items).map((itemId) => {
				let newItem = new Item(this.props.characterId);
				newItem.initFromDb(items[itemId]);
				updatedItems[itemId] = newItem;
			});
		}
		updatedItems = this.sortObject(updatedItems);
		return updatedItems;
	}

	sortObject(o) {
		return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
	}


	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.setState({
			fbItems: nextProps.items,
			items: this.processItems(nextProps.items)
		});
	}

	showAddItemModal(visible) {
		this.setState({addItemModal: visible});
	}

	setCurrency(currencyItem) {
		let existingCurrency = new Item(this.props.characterId);
		existingCurrency.initFromDb(currencyItem);

		if(this.state.fbItems) {
			let fbItems = this.state.fbItems;
			let saved = false;
			Object.keys(fbItems).forEach(filterItemKey => {
				if(fbItems[filterItemKey]._type === currencyItem._type) {
					existingCurrency.initFromDb(fbItems[filterItemKey]);
					existingCurrency.amount = currencyItem._amount;
					existingCurrency.save();
					fbItems[filterItemKey] = existingCurrency;
					saved = true;
				}
			});
			if(!saved) {
				existingCurrency.save();
				fbItems[currencyItem.itemId] = existingCurrency;
			}
			this.setState({fbItems: fbItems});
			this.processItems(fbItems);
		}
		this.addItem(existingCurrency);
	}

	addItem(newItem) {
		this.props.addItem(newItem);
		this.showAddItemModal(false);
	}

	getItemSubtitle(item) {
		switch(item.type) {
			case Item.itemTypes.weapon.key:
				return `${item.diceAmount}${item.diceType} ${item.extraType}, Attack Bonus: +${item.extraAmount}`;
			case Item.itemTypes.armor.key:
				return `AC Bonus: +${item.extraAmount}`;
			default:
				return item.description;
		}
	}

	render() {
		return (
			<ScrollView>

				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.addItemModal}>
					<NewItem addItem={this.addItem.bind(this)} show={this.showAddItemModal.bind(this)} characterId={this.props.characterId} setCurrency={this.setCurrency.bind(this)}/>
				</Modal>

				<List containerStyle={{marginBottom: 20}}>
					{
						Object.entries(this.state.items).map(([itemId, item])=> (
							<ListItem
								onPress={() => {this.props.viewItem(item, itemId)}}
								roundAvatar
								underlayColor={"#dedede"}
								leftIcon={{
									name: Item.itemTypes[item.type].icon,
									type: Item.itemTypes[item.type].iconType
								}}
								key={itemId}
								title={item.name}
								badge={{value: item.amount}}
								subtitle={this.getItemSubtitle(item)}
							/>
						))
					}
				</List>
				<TouchableOpacity onPress={() => { this.showAddItemModal(true);}}
				                  style={{marginRight: 10}}>
					<Icon name='plus' type='feather'/>
				</TouchableOpacity>
			</ScrollView>
		);
	}
}

export default ItemsView;
