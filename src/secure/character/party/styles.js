const React = require("react-native");
const {StyleSheet} = React;

import Dimensions from 'Dimensions';
const {width, height} = Dimensions.get('window');

export default {
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 25,
		flexDirection: "column",
	},
	header: {
		fontSize: 25,
		margin: 10
	},
	button: {
		backgroundColor: "#2794F0",
		marginTop: 25,
		width: 300
	}

};
