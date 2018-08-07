import React from "react";
import styles from "./styles";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import Swiper from "react-native-swiper";
import {TextInput} from "@shoutem/ui/components/TextInput";
import {Button, Icon} from "react-native-elements";
import RadioForm from "react-native-simple-radio-button";
import UpDownInput from "../../../../shared/upDownInput";
import Item from "../../../../om/Item";

class NewItem extends React.Component {
	swiper;
	newItem;

	constructor(props) {
		super(props);
		this.newItem = new Item(this.props.characterId);
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
		};
	}

	cellViews = Object.keys(Item.itemTypes).map((type) => {
		return (
			<TouchableOpacity key={type} style={styles.gridItem} onPress={() => {
				this.selectType(type)
			}}>
				<Icon
					name={Item.itemTypes[type].icon}
					type={Item.itemTypes[type].iconType}
					size={50}
				/>
				<Text>{Item.itemTypes[type].name}</Text>
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

	getItemView(type) {
		switch (type) {
			case "weapon":
				return this.weaponView();
			case "armor":
				return this.armorView();
		}
	}

	moneyView(currencyType) {
		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<Text style={{...styles.text, ...styles.header}}>Set amount of {Item.itemTypes[currencyType].name}</Text>
				<Text style={{fontSize: 15, color: "orange", paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}>Warning: if you already have an amount of this currency, it will be overwritten by this number.</Text>
				<TextInput
					style={styles.input}
					keyboardType = 'numeric'
					placeholder={"Enter new amount"}
					maxLength={10}
					value={this.state.amount}
					onChangeText={(text) => this.setState({amount: text})}
					onBlur={() => {
						let newAmount = this.state.amount.replace(/[\D+]/g, "");
						this.setState({amount: newAmount});
					}}
				/>
				<Button title={`Set ${Item.itemTypes[currencyType].name} Amount`} onPress={() => this.saveCurrency(currencyType)} backgroundColor={"#2794F0"}/>
			</View>
		)
	}

	saveCurrency(currencyType) {
		this.newItem.name = Item.itemTypes[currencyType].name;
		this.newItem.description = Item.itemTypes[this.state.type].description;
		this.newItem.type = currencyType;
		this.newItem.amount = this.state.amount;
		this.props.setCurrency(this.newItem);
	}

	weaponView() {
		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<Text style={styles.text}>Set Weapon Stats</Text>
				<Text style={styles.subheader}>Select Dice Amount</Text>
				<RadioForm
					style={{marginTop: 10}}
					radioStyle={{paddingRight: 20}}
					formHorizontal={true}
					labelHorizontal={false}
					radio_props={Item.diceAmountOptions}
					initial={this.state.diceAmount}
					onPress={(value) => {
						this.setState({diceAmount: value})
					}}
				/>
				<Text style={styles.subheader}>Select Dice Type</Text>
				<RadioForm
					style={{marginTop: 10}}
					radioStyle={{paddingRight: 20}}
					radio_props={Item.diceTypeOptions}
					initial={this.state.diceType}
					onPress={(value) => {
						this.setState({diceType: value})
					}}
				/>
				<Text style={styles.subheader}>Damage Type</Text>
				<RadioForm
					style={{marginTop: 10}}
					radioStyle={{paddingRight: 20}}
					formHorizontal={true}
					labelHorizontal={false}
					radio_props={Item.damageTypeOptions}
					initial={this.state.extraType}
					onPress={(value) => {
						this.setState({extraType: value})
					}}
				/>
				<Text style={styles.subheader}>Attack Bonus</Text>
				<UpDownInput onChange={(newVal) => this.setState({extraAmount: newVal})} value={this.state.extraAmount}/>
				<Button style={{marginTop: 25, marginBottom: 25}} title='Add Weapon' onPress={() => this.saveItem()} backgroundColor={"#2794F0"}/>
			</View>

		);
	};

	armorView() {
		return (
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
				<Text style={styles.text}>Set Armor Class</Text>
				<UpDownInput onChange={(newVal) => this.setState({extraAmount: newVal})} value={this.state.extraAmount}/>
				<Button style={{marginTop: 25, marginBottom: 25}} title='Add Armor' onPress={() => this.saveItem()} backgroundColor={"#2794F0"}/>
			</View>
		);
	}

	saveItem() {
		this.newItem.name = this.state.name;
		this.newItem.description = this.state.description;
		this.newItem.type = this.state.type;
		this.newItem.diceAmount = this.state.diceAmount;
		this.newItem.diceType = this.state.diceType;
		this.newItem.damageType = this.state.damageType;
		this.newItem.extraType = this.state.extraType;
		this.newItem.extraAmount = this.state.extraAmount;
		this.newItem.amount = this.state.amount;
		this.newItem.url = this.state.url;
		this.newItem.save();
		this.props.addItem(this.newItem);
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
						{
							(this.state.type && Item.itemTypes[this.state.type].currency) ?
								(this.moneyView(this.state.type)) : (
								<View style={styles.slide}>
									<Text style={{...styles.text, ...styles.header}}>Describe Your
										New {this.state.type ? Item.itemTypes[this.state.type].name : ""}</Text>
									<TextInput
										style={styles.input}
										placeholder={"Name of Item"}
										onChangeText={(text) => this.setState({name: text})}
									/>
									<TextInput
										style={{...styles.input, ...styles.inputMultiLine}}
										placeholder={"Item Description"}
										multiline={true}
										numberOfLines={4}
										onChangeText={(text) => this.setState({description: text})}
									/>
									{
										this.getItemView(this.state.type) ? (
											<Button title='Continue' onPress={() => this.nextSlide()} backgroundColor={"#2794F0"} />
										) : (
											<Button title='Add Item' onPress={() => this.saveItem()} backgroundColor={"#2794F0"}/>
										)
									}
								</View>
							)}
					</ScrollView>
					<ScrollView>
						<View style={styles.slide}>
							{this.getItemView(this.state.type)}
						</View>
					</ScrollView>
				</Swiper>
			</View>
		);
	}
}

export default NewItem;
