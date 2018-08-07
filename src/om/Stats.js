import firebase from "react-native-firebase";

const defaultStats = {
	hitPoints: 10,
	maxHitPoints: 30,
	armorClass: 10,
	speed: 10,
	tmpHitPoints: 10,
	deathSaves: {successes: 0, fails: 0},
	hitDice: 0,

	strength: 15,
	dexterity: 15,
	constitution: 15,
	intelligence: 15,
	inspiration: 5,
	wisdom: 15,
	charisma: 15,
	passiveWisdom: 0,
	proficienyBonus: 0,

	skills: {
		acrobatics: {
			label: "Acrobatics",
			modifier: "+1",
			type: "dexterity"
		},
		animalHandling: {
			label: "Animal Handling",
			modifier: "-1",
			type: "wisdom"
		},
		arcana: {
			label: "Arcana",
			modifier: "+1",
			type: "intelligence"
		},
		athletics: {
			label: "Athletics",
			modifier: "+7",
			type: "strength"
		},
		deception: {
			label: "Deception",
			modifier: "+3",
			type: "charisma"
		},
		history: {
			label: "History",
			modifier: "+4",
			type: "intelligence"
		},
		insight: {
			label: "Insight",
			modifier: "+2",
			type: "wisdom"
		},
		intimidation: {
			label: "Intimidation",
			modifier: "+6",
			type: "charisma"
		},
		investigation: {
			label: "Investigation",
			modifier: "+1",
			type: "intelligence"
		},
		medicine: {
			label: "Medicine",
			modifier: "-1",
			type: "wisdom"
		},
		nature: {
			label: "Nature",
			modifier: "+1",
			type: "intelligence"
		},
		perception: {
			label: "Perception",
			modifier: "-1",
			type: "wisdom"
		},
		performance: {
			label: "Performance",
			modifier: "-3",
			type: "charisma"
		},
		persuasion: {
			label: "Persuasion",
			modifier: "+6",
			type: "charisma"
		},
		religion: {
			label: "Religion",
			modifier: "+4",
			type: "intelligence"
		},
		sleightOfHand: {
			label: "Sleight of Hand",
			modifier: "+2",
			type: "dexterity"
		},
		stealth: {
			label: "Stealth",
			modifier: "+1",
			type: "dexterity",
			disadvantage: true,
		},
		survival: {
			label: "Survival",
			modifier: "-1",
			type: "wisdom"
		}
	}
};

function sortObject(o) {
	return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}


class Stats {
	_characterId;
	_strength;
	_dexterity;
	_constitution;
	_intelligence;
	_wisdom;
	_charisma;
	_inspiration;
	_passiveWisdom;
	_proficiencyBonus;
	_size;

	_hitPoints;
	_maxHitPoints;
	_armorClass;
	_deathSaves;
	_speed;
	_skills;

	static skillTypes = {
		acrobatics: {
			label: "Acrobatics",
			modifier: 0,
			type: "dexterity"
		},
		animalHandling: {
			label: "Animal Handling",
			modifier: 0,
			type: "wisdom"
		},
		arcana: {
			label: "Arcana",
			modifier: 0,
			type: "intelligence"
		},
		athletics: {
			label: "Athletics",
			modifier: 0,
			type: "strength"
		},
		deception: {
			label: "Deception",
			modifier: 0,
			type: "charisma"
		},
		history: {
			label: "History",
			modifier: 0,
			type: "intelligence"
		},
		insight: {
			label: "Insight",
			modifier: 0,
			type: "wisdom"
		},
		intimidation: {
			label: "Intimidation",
			modifier: 0,
			type: "charisma"
		},
		investigation: {
			label: "Investigation",
			modifier: 0,
			type: "intelligence"
		},
		medicine: {
			label: "Medicine",
			modifier: 0,
			type: "wisdom"
		},
		nature: {
			label: "Nature",
			modifier: 0,
			type: "intelligence"
		},
		perception: {
			label: "Perception",
			modifier: 0,
			type: "wisdom"
		},
		performance: {
			label: "Performance",
			modifier: 0,
			type: "charisma"
		},
		persuasion: {
			label: "Persuasion",
			modifier: 0,
			type: "charisma"
		},
		religion: {
			label: "Religion",
			modifier: 0,
			type: "intelligence"
		},
		sleightOfHand: {
			label: "Sleight of Hand",
			modifier: 0,
			type: "dexterity"
		},
		stealth: {
			label: "Stealth",
			modifier: 0,
			type: "dexterity",
		},
		survival: {
			label: "Survival",
			modifier: 0,
			type: "wisdom"
		}
	};

	static increaseModifierByLevel = 2;
	static baseModifier = -5;
	static minStatValue = 3;
	static maxStatValue = 30;

	constructor(characterId) {
		this._characterId = characterId;
		this._savingThrows = {};
		this._skills = {};
		this._modifiers = {};
	}

	initFromDb(firebaseObj) {
		if(firebaseObj) {
			Object.keys(firebaseObj).forEach(key => {
				this[key] = firebaseObj[key];
			});
		}
		this._skills = (sortObject(this._skills));
	}

	save() {
		return firebase.database().ref(`stats/${firebase.auth().currentUser.uid}/${this._characterId}`).set(this);
	}

	getSkill(skillType) {
		return this._skills[skillType];
	}

	setSkill(skillType, value) {
		this._skills[skillType] = value;
	}

	static getModifier(value, asString) {
		let newModifier = Math.floor(value / Stats.increaseModifierByLevel);
		newModifier = Stats.baseModifier + newModifier;
		if(asString && newModifier > 0){
			return `+${newModifier}`
		}
		return newModifier;
	}

	get skills() {
		return this._skills;
	}

	set skills(value) {
		this._skills = value;
	}

	get strength() {
		return this._strength;
	}

	set strength(value) {
		this._strength = value;
	}

	get dexterity() {
		return this._dexterity;
	}

	set dexterity(value) {
		this._dexterity = value;
	}

	get constitution() {
		return this._constitution;
	}

	set constitution(value) {
		this._constitution = value;
	}

	get intelligence() {
		return this._intelligence;
	}

	set intelligence(value) {
		this._intelligence = value;
	}

	get wisdom() {
		return this._wisdom;
	}

	set wisdom(value) {
		this._wisdom = value;
	}

	get charisma() {
		return this._charisma;
	}

	set charisma(value) {
		this._charisma = value;
	}

	get savingThrows() {
		return this._savingThrows;
	}

	set savingThrows(value) {
		this._savingThrows = value;
	}

	get modifiers() {
		return this._modifiers;
	}

	set modifiers(value) {
		this._modifiers = value;
	}

	get inspiration() {
		return this._inspiration;
	}

	set inspiration(value) {
		this._inspiration = value;
	}

	get passiveWisdom() {
		return this._passiveWisdom;
	}

	set passiveWisdom(value) {
		this._passiveWisdom = value;
	}

	get proficiencyBonus() {
		return this._proficiencyBonus;
	}

	set proficiencyBonus(value) {
		this._proficiencyBonus = value;
	}

	get hitPoints() {
		return this._hitPoints;
	}

	set hitPoints(value) {
		this._hitPoints = value;
	}

	get armorClass() {
		return this._armorClass;
	}

	set armorClass(value) {
		this._armorClass = value;
	}

	get deathSaves() {
		return this._deathSaves;
	}

	set deathSaves(value) {
		this._deathSaves = value;
	}

	get speed() {
		return this._speed;
	}

	set speed(value) {
		this._speed = value;
	}

	get maxHitPoints() {
		return this._maxHitPoints;
	}

	set maxHitPoints(value) {
		this._maxHitPoints = value;
	}

	get size() {
		return this._size;
	}

	set size(value) {
		this._size = value;
	}
}

export default Stats;
