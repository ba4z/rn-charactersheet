const React = require("react-native");

const {StyleSheet, Dimensions} = React;

const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

export default {
	headerImage: {
		height: 400,
		flex: 1,
		width: null,
		marginBottom: 25
	},
	content: {
		paddingLeft: 25,
		paddingRight: 25,
	},
	container: {
		flex: 1,
		paddingBottom: 30,
		bottom: 0,
	},
	cardStyle: {
		flex: 1,
	},
	header: {
		fontSize: 25
	},
	cardText: {
		marginBottom: 10
	}
};
