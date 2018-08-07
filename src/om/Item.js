import firebase from "react-native-firebase";
let uuid = require("react-native-uuid");

class Item {
	_created;
	_lastModified;
	characterId;
	itemId;
	_name;
	_description;
	_diceAmount;
	_diceType;
	_damageType;
	_type;
	_extraType;
	_extraAmount;
	_amount;
	_url; //optional

	static diceAmountOptions = [
		{label: "1 Die", value: 1},
		{label: "2 Dice", value: 2}
	];

	static diceTypeOptions = [
		{label: "4 Sided", value: "d4"},
		{label: "6 Sided", value: "d6"},
		{label: "8 Sided", value: "d8"},
		{label: "10 Sided", value: "d10"},
		{label: "12 Sided", value: "d12"},
	];

	static damageTypeOptions = [
		{label: "Bludgeoning", value: "bludgeoning"},
		{label: "Piercing", value: "piercing"},
		{label: "Slashing", value: "slashing"},
	];

	static itemTypes = {
		"weapon": {
			name: "Weapon",
			icon: "sword",
			iconType: "material-community",
			key: "weapon"
		},
		"armor": {
			name: "Armor",
			icon: "shield-outline",
			iconType: "material-community",
			key: "armor"
		},
		"tools": {
			name: "Tools",
			icon: "tools",
			iconType: "entypo",
			key: "tools"
		},
		"potions": {
			name: "Potions",
			icon: "lab-flask",
			iconType: "entypo",
			key: "potions"
		},
		"gear": {
			name: "Adventuring Gear",
			icon: "suitcase",
			iconType: "font-awesome",
			key: "gear"
		},
		"platinum": {
			name: "Platinum",
			icon: "database",
			iconType: "entypo",
			key: "platinum",
			currency: true,
			description: "The most valuable currency. Worth 10 Gold, 100 silver or 1000 copper"
		},
		"gold": {
			name: "Gold",
			icon: "database",
			iconType: "entypo",
			key: "gold",
			currency: true,
			description: "A valuable currency. Worth 10 silver or 100 copper"

		},
		"silver": {
			name: "Silver",
			icon: "database",
			iconType: "entypo",
			key: "silver",
			currency: true,
			description: "A common currency. Worth 10 copper"
		},
		"copper": {
			name: "Copper",
			icon: "database",
			iconType: "entypo",
			key: "copper",
			currency: true,
			description: "A least valuable currency."
		}
	};

	constructor(characterId) {
		this._created = new Date().getTime();
		this.characterId = characterId;
		this.itemId = uuid.v1();
	}

	initFromDb(firebaseObj) {
		Object.keys(firebaseObj).forEach(key => {
			this[key] = firebaseObj[key];
		});
	}

	save() {
		let saveObject = JSON.parse(JSON.stringify(this));
		saveObject._lastModified = new Date().getTime();
		return firebase.database().ref(`items/${firebase.auth().currentUser.uid}/${this.characterId}/${this.itemId}`).set(saveObject);
	}

	remove() {
		return firebase.database().ref(`items/${firebase.auth().currentUser.uid}/${this.characterId}/${this.itemId}`).remove();
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
	}

	get created() {
		return this._created;
	}

	set created(value) {
		throw new Error("Can not update created date");
	}

	get description() {
		return this._description;
	}

	set description(value) {
		this._description = value;
	}

	get diceAmount() {
		return this._diceAmount;
	}

	set diceAmount(value) {
		this._diceAmount = value;
	}

	get diceType() {
		return this._diceType;
	}

	set diceType(value) {
		this._diceType = value;
	}

	get damageType() {
		return this._damageType;
	}

	set damageType(value) {
		this._damageType = value;
	}

	get extraType() {
		return this._extraType;
	}

	set extraType(value) {
		this._extraType = value;
	}

	get extraAmount() {
		return this._extraAmount;
	}

	set extraAmount(value) {
		this._extraAmount = value;
	}

	get amount() {
		return this._amount;
	}

	set amount(value) {
		this._amount = value;
	}

	get url() {
		return this._url;
	}

	set url(value) {
		this._url = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get lastModified() {
		return this._lastModified;
	}

	set lastModified(value) {
		this._lastModified = value;
	}
}

export default Item;

