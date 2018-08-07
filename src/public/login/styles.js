const React = require("react-native");
const {StyleSheet} = React;

export default {
	container: {
		backgroundColor: "#FBFAFA",
		flex: 3,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingTop: 50
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
	loginButton: {
		marginTop: 50
	},
	loginButtonText: {
		fontSize: 25
	},
	createAccountButton: {
		marginTop: 25
	}
};
