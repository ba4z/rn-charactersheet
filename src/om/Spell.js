import firebase from "react-native-firebase";
let uuid = require("react-native-uuid");

class Spell {

	_lastModified; //timestamp
	_created; //timestamp
	characterId; //string
	spellId; //string
	_name; //string
	_type; //string
	_description; //string
	_level; //number
	_amountUsed; //number
	_amountAvailable; //number

	static spellTypes = {
		"spell": {name: "Spell", icon: "ios-color-wand", iconType: "ionicon", key: "spell"},
		"cantrip": {name: "Cantrip", icon: "magic", iconType: "font-awesome", key: "cantrip"},
	};

	constructor(characterId) {
		this._created = new Date().getTime();
		this.characterId = characterId;
		this.spellId = uuid.v1();
	}

	initFromDb(firebaseObj) {
		Object.keys(firebaseObj).forEach(key => {
			this[key] = firebaseObj[key];
		});
	}

	save() {
		let saveObject = JSON.parse(JSON.stringify(this));
		saveObject._lastModified = new Date().getTime();
		return firebase.database().ref(`spells/${firebase.auth().currentUser.uid}/${this.characterId}/${this.spellId}`).set(saveObject)
	}

	remove() {
		console.log("REMOVING SPELL");
		return firebase.database().ref(`spells/${firebase.auth().currentUser.uid}/${this.characterId}/${this.spellId}`).remove()
	}


	get created() {
		return this._created;
	}

	set created(value) {
		throw new Error("Can not update created date");
	}

	get name() {
		return this._name;
	}

	set name(value) {
		this._name = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		this._type = value;
	}

	get description() {
		return this._description;
	}

	set description(value) {
		this._description = value;
	}

	get lastModified() {
		return this._lastModified;
	}

	set lastModified(value) {
		this._lastModified = value;
	}


	get level() {
		return this._level;
	}

	set level(value) {
		this._level = value;
	}

	get amountUsed() {
		return this._amountUsed;
	}

	set amountUsed(value) {
		this._amountUsed = value;
	}

	get amountAvailable() {
		return this._amountAvailable;
	}

	set amountAvailable(value) {
		this._amountAvailable = value;
	}
}

export default Spell;

