const React = require("react-native");
const {StyleSheet} = React;

export default {
	container: {
		flex: 1, alignItems: "stretch", justifyContent: "center", paddingTop: 10, flexDirection: "column"
	},
	iconRow: {
		flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, flexWrap: "wrap"
	},
	iconGroup: {
		alignItems: "center", justifyContent: "space-between", width: 100, marginBottom: 20
	},
	icon: {
		opacity: 0.2,
	},
	iconText: {
		paddingTop: 5,
		paddingBottom: 3,
		opacity: 0.5
	},
	statText: {
		paddingBottom: 3,
		marginTop: 5,
		fontSize: 20
	}

};
