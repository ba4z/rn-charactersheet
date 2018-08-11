import React from "react";
import styles from "./styles";
import {TouchableOpacity, View, ScrollView} from "react-native";
import {Button, Icon, Text} from "react-native-elements";
import {TextInput} from "@shoutem/ui/components/TextInput";

class NewInvite extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			email: ""
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
					<Text h3>Invite another player to your party</Text>
					<TextInput
						style={styles.input}
						autoFocus={true}
						autoCorrect={false}
						autoCapitalize="none"
						keyboardType={"email-address"}
						placeholder={"Player's email address"}
						onChangeText={(text) => this.setState({email: text})}
					/>
					<Button
						buttonStyle={styles.button}
						backgroundColor={styles.button.backgroundColor}
						raised
						onPress={() => this.props.inviteUser(this.state.email)}
						icon={{name: "md-add", type: "ionicon"}}
						title='Invite User'/>
				</View>
			</ScrollView>
		);
	}
}

export default NewInvite;
