import Stats from "./Stats";
import firebase from "react-native-firebase";
let uuid = require("react-native-uuid");



class Character {

	_lastModified; //timestamp
	_created; //timestamp
	characterId; //string
	name; //string
	characterClass; // {name, url}
	race; //{name, url{
	alignment; //{id, name}
	_background; //string
	_level; //number
	_languages; //array
	_availableSpellsLeft; //map {level: amount}

	_avatarUrl; //image url

	_personalityTraits; //big string
	_ideals; //big string
	_bonds; //big string
	_flaws; //big string
	_backgroundStory; //big string

	_age; //string
	_height; //string
	_weight; //string
	_eyeColor; //string
	_skinColor; //string
	_hairColor; //string
	_connectedParty; //guid

	//Every 4 levels proficiency bonus increases by 1
	static baseProficiency = 2;
	static increaseProficiencyByLevel = 4;
	static maxLevel = 20;


	constructor(name, characterClass, race, alignment) {
		this._created = new Date().getTime();
		this.name = name;
		this.characterClass = characterClass;
		this.race = race;
		this.alignment = alignment;
		this.characterId = uuid.v1();
		this._level = 1;

		this._stats = new Stats();
		this._features = {};
		this._items = {};
		this._availableSpellsLeft = {};
	}

	initFromDb(firebaseObj) {
		Object.keys(firebaseObj).forEach(key => {
			this[key] = firebaseObj[key];
		});
	}

	save() {
		let saveObject = JSON.parse(JSON.stringify(this));
		delete saveObject._items;
		delete saveObject._features;
		delete saveObject._stats;

		saveObject._lastModified = new Date().getTime();
		return firebase.database().ref(`characters/${firebase.auth().currentUser.uid}/${this.characterId}`).set(saveObject)
	}

	levelUp() {
		this._level = this._level +1;
		return this.save();
	}

	static getProficiencyBonus(level) {
		let newBonus = Math.floor((level -1) / Character.increaseProficiencyByLevel);
		return Character.baseProficiency + newBonus;
	}

	get created() {
		return this._created;
	}

	set created(value) {
		throw new Error("Can not update created date");
	}

	get background() {
		return this._background;
	}

	set background(value) {
		this._background = value;
	}

	get level() {
		return this._level;
	}

	set level(value) {
		this._level = value;
	}

	get languages() {
		return this._languages;
	}

	set languages(value) {
		this._languages = value;
	}


	get personalityTraits() {
		return this._personalityTraits;
	}

	set personalityTraits(value) {
		this._personalityTraits = value;
	}

	get ideals() {
		return this._ideals;
	}

	set ideals(value) {
		this._ideals = value;
	}

	get bonds() {
		return this._bonds;
	}

	set bonds(value) {
		this._bonds = value;
	}

	get flaws() {
		return this._flaws;
	}

	set flaws(value) {
		this._flaws = value;
	}

	get backgroundStory() {
		return this._backgroundStory;
	}

	set backgroundStory(value) {
		this._backgroundStory = value;
	}

	get avatarUrl() {
		return this._avatarUrl;
	}

	set avatarUrl(value) {
		this._avatarUrl = value;
	}

	get lastModified() {
		return this._lastModified;
	}

	set lastModified(value) {
		this._lastModified = value;
	}

	get age() {
		return this._age;
	}

	set age(value) {
		this._age = value;
	}

	get height() {
		return this._height;
	}

	set height(value) {
		this._height = value;
	}

	get weight() {
		return this._weight;
	}

	set weight(value) {
		this._weight = value;
	}

	get eyeColor() {
		return this._eyeColor;
	}

	set eyeColor(value) {
		this._eyeColor = value;
	}

	get skinColor() {
		return this._skinColor;
	}

	set skinColor(value) {
		this._skinColor = value;
	}

	get hairColor() {
		return this._hairColor;
	}

	set hairColor(value) {
		this._hairColor = value;
	}

	get connectedParty() {
		return this._connectedParty;
	}

	set connectedParty(value) {
		this._connectedParty = value;
	}

	get availableSpellsLeft() {
		return this._availableSpellsLeft;
	}

	set availableSpellsLeft(value) {
		this._availableSpellsLeft = value;
	}
}

export default Character;
