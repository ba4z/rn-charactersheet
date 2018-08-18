import {Dimensions} from "react-native";

const React = require("react-native");
const totalHeight = Dimensions.get("window").height;
const {StyleSheet} = React;

export default {
	wrapper: {},
	slide: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold",
	},
	subheader: {
		color: "black",
		fontSize: 20,
		fontWeight: "bold",
		marginTop: 25
	},
	header: {
		marginBottom: 25
	},
	input: {
		maxWidth: 400,
		width: "80%",
		height: 35,
		borderColor: "#474747",
		marginBottom: 25,
		borderBottomWidth: 1,
		fontSize: 20,
	},
	inputMultiLine: {
		height: 200
	},
	grid: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		alignItems: "center",
	},
	gridItem: {
		width: "33%",
		justifyContent: "center",
		alignItems: "center",
		height: 150
	}
};
