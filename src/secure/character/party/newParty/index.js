import React from "react";
import styles from "./styles";
import {TouchableOpacity, View, ScrollView} from "react-native";
import {Button, Icon, Text} from "react-native-elements";
import {TextInput} from "@shoutem/ui/components/TextInput";

class NewParty extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: ""
		};
	}

	render() {
		return (
			<ScrollView>
				<TouchableOpacity style={{height: 25, marginTop: 25, marginRight: 25, alignSelf: "flex-end"}}
				                  onPress={() => {
					                  this.props.closeModal()
				                  }}>
					<Icon name='md-close' type='ionicon' size={25}/>
				</TouchableOpacity>
				<View style={{flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
					<Text h3>Create new party!</Text>
					<TextInput
						style={styles.input}
						placeholder={"Party Name"}
						onChangeText={(text) => this.setState({name: text})}
					/>
					<Button
						buttonStyle={styles.button}
						backgroundColor={styles.button.backgroundColor}
						raised
						onPress={() => this.props.createParty()}
						icon={{name: "md-add", type: "ionicon"}}
						title='Create Party'/>
				</View>
			</ScrollView>
		);
	}
}

export default NewParty;
