import firebase from "react-native-firebase";
let uuid = require("react-native-uuid");

class Feature {

	_lastModified; //timestamp
	_created; //timestamp
	characterId; //string
	featureId; //string
	_amount; //number
	_name; //string
	_type; //string
	_description; //string

	static availableLanguages = {
		common: {
			"name": "Common",
			"url": "http://www.dnd5eapi.co/api/languages/1"
		},
		dwarfish:
			{
				"name": "Dwarvish",
				"url": "http://www.dnd5eapi.co/api/languages/2"
			},
		elvish:
			{
				"name": "Elvish",
				"url": "http://www.dnd5eapi.co/api/languages/3"
			},
		giant:
			{
				"name": "Giant",
				"url": "http://www.dnd5eapi.co/api/languages/4"
			},
		gnomish:
			{
				"name": "Gnomish",
				"url": "http://www.dnd5eapi.co/api/languages/5"
			},
		goblin:
			{
				"name": "Goblin",
				"url": "http://www.dnd5eapi.co/api/languages/6"
			},
		hafling:
			{
				"name": "Halfling",
				"url": "http://www.dnd5eapi.co/api/languages/7"
			},
		orc:
			{
				"name": "Orc",
				"url": "http://www.dnd5eapi.co/api/languages/8"
			},
		abyssal:
			{
				"name": "Abyssal",
				"url": "http://www.dnd5eapi.co/api/languages/9"
			},
		celestial:
			{
				"name": "Celestial",
				"url": "http://www.dnd5eapi.co/api/languages/10"
			},
		draconic:
			{
				"name": "Draconic",
				"url": "http://www.dnd5eapi.co/api/languages/11"
			},
		deepspeech:
			{
				"name": "Deep Speech",
				"url": "http://www.dnd5eapi.co/api/languages/12"
			},
		infernal:
			{
				"name": "Infernal",
				"url": "http://www.dnd5eapi.co/api/languages/13"
			},
		primordial:
			{
				"name": "Primordial",
				"url": "http://www.dnd5eapi.co/api/languages/14"
			},
		sylvan:
			{
				"name": "Sylvan",
				"url": "http://www.dnd5eapi.co/api/languages/15"
			},
		undercommon:
			{
				"name": "Undercommon",
				"url": "http://www.dnd5eapi.co/api/languages/16"
			}
	};

	static featureTypes = {
		"feature": {name: "Features", icon: "star", iconType: "evilicon", key: "feature"},
		"language": {name: "Languages & Other Proficiencies", icon: "ios-globe-outline", iconType: "ionicon", key: "language"},
		"spell": {name: "Spells", icon: "ios-color-wand", iconType: "ionicon", key: "spell"},
		"cantrip": {name: "Cantrips", icon: "magic", iconType: "font-awesome", key: "cantrip"},
	};

	constructor(characterId) {
		this._created = new Date().getTime();
		this.characterId = characterId;
		this.featureId = uuid.v1();
	}

	initFromDb(firebaseObj) {
		Object.keys(firebaseObj).forEach(key => {
			this[key] = firebaseObj[key];
		});
	}

	save() {
		let saveObject = JSON.parse(JSON.stringify(this));
		saveObject._lastModified = new Date().getTime();
		return firebase.database().ref(`features/${firebase.auth().currentUser.uid}/${this.characterId}/${this.featureId}`).set(saveObject)
	}

	remove() {
		return firebase.database().ref(`features/${firebase.auth().currentUser.uid}/${this.characterId}/${this.featureId}`).remove()
	}


	get created() {
		return this._created;
	}

	set created(value) {
		throw new Error("Can not update created date");
	}

	get amount() {
		return this._amount;
	}

	set amount(value) {
		this._amount = value;
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
}

export default Feature;

