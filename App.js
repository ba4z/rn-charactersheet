import React from "react";
import LoginPage from "./src/public/login";
import {createStackNavigator} from "react-navigation";
import CharacterList from "./src/secure/characterList";
import CharacterView from "./src/secure/character";
import NewCharacter from "./src/secure/newCharacter";
import ViewItem from "./src/secure/character/items/viewItem";
import ViewFeature from "./src/secure/character/features/viewFeature";
import CreateUser from "./src/public/createUser";
import InfoView from "./src/secure/character/info";
import ViewSpell from "./src/secure/character/spells/viewSpell";

const RootStack = createStackNavigator({
	Login: {
		screen: LoginPage
	},
	CreateUser: {
		screen: CreateUser
	},
	CharacterList: {
		screen: CharacterList
	},
	Character: {
		screen: CharacterView
	},
	ViewItem: {
		screen: ViewItem
	},
	ViewFeature: {
		screen: ViewFeature
	},
	NewCharacter: {
		screen: NewCharacter,
	},
	CharacterInfo: {
		screen: InfoView
	},
	ViewSpell: {
		screen: ViewSpell
	}
});

export default class App extends React.Component {

	constructor(props) {
		super(props);
	}


	render() {
		return (
			<RootStack style={{flex: 1}}/>
		);
	}
}
