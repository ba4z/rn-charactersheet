const React = require("react-native");
const {StyleSheet} = React;

export default {
	wrapper: {},
	slide1: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	slide2: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {
		color: "black",
		fontSize: 30,
		fontWeight: "bold"
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
		width: "45%",
		maxWidth: 200,
		justifyContent: "center",
		alignItems: "center",
		height: 200
	}
};
