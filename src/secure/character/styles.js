const React = require("react-native");
import { Platform } from 'react-native'
const {StyleSheet} = React;

export default {
	container: {
		backgroundColor: "#FBFAFA",
	},
	avatarRow: {
		flex: 0.3,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		padding: 10,
	},
	avatarText: {
		flexDirection: "column",
		paddingLeft: 25
	},
	levelUp: {
		width: 200,
		marginTop: 10,
		flexDirection: "column",
	},
	modal: {
		backgroundColor: "white",
		margin: 15,
		height: null,
		alignItems: undefined,
		justifyContent: undefined,
	},
	tabLabelStyle: {
		color: "black",
		fontSize: Platform.isPad ? null : 10
	}

};
