const React = require("react-native");
const {StyleSheet} = React;

export default {
	dropdownItem: {
		padding: 15
	},
	input: {
		width: "95%",
		height: 35,
		borderColor: "#474747",
		marginBottom: 25,
		borderBottomWidth: 1,
		fontSize: 20,
		marginTop: 25
	},
	multilineInput: {
		borderColor: "#474747",
		marginBottom: 25,
		borderBottomWidth: 1,
		fontSize: 20,
		marginTop: 25
	},
	slide: {
		flex: 1, width: "80%", marginLeft: "10%", marginBottom: 50
	},
	buttonRow: {
		flex: 1, flexDirection: "row", justifyContent: "center"
	},
	button: {
		marginTop: 25, marginBottom: 25
	},
	subheader: {
		fontSize: 20
	},
	subHeaderFixedWidth: {
		fontSize: 20,
		width: "30%"
	},
	rowContainer: {
		flex: 1,
		flexDirection: "column"
	},
	twoRows: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start"
	},
	headerColumn: {
		flex: 1,
		fontWeight: "bold"
	},
	contentColumn: {
		flex: 2
	},
	listItemContainer: {
		borderTopWidth: 0,
		borderBottomWidth: 0.5
	},
	badgeStyle: {
		backgroundColor: "#03A9F4"
	},
	badgeStyleProficient: {
		backgroundColor: "#35bc00"
	}

};
