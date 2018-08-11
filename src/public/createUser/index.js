import React from "react";
import styles from "./styles";
import {View} from "@shoutem/ui/components/View";
import {Button} from "@shoutem/ui/components/Button";
import {Alert, Text, TextInput} from "react-native";
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import {FormValidationMessage} from "react-native-elements";

class CreateUser extends React.Component {
	static navigationOptions = ({navigation}) => ({
		title: "Create a new Account"
	});

	constructor(props) {
		super(props);
		this.state = {}
	}

	createUser() {
		this.setState({busy: true});
		firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password).then(user => {
			user.updateProfile({displayName: this.state.name});
			this.setState({busy: false});
			this.props.navigation.navigate("CharacterList", {newCharacter: true});
		}).catch(error => {
			Alert.alert("Could not create account", error.message);
			this.setState({busy: false});
		});
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Spinner visible={this.state.busy} />
				<View style={styles.container}>
					<TextInput
						style={styles.input}
						placeholder={"Name"}
						returnKeyType={"send"}
						autoCapitalize = "none"
						onChangeText={(text) => this.setState({name: text})}
						onSubmitEditing={() => this.createUser()}
					/>
					<TextInput
						textContentType={"username"}
						style={styles.input}
						placeholder={"email"}
						returnKeyType={"send"}
						autoCapitalize = "none"
						keyboardType={"email-address"}
						onChangeText={(text) => this.setState({username: text})}
						onSubmitEditing={() => this.createUser()}
					/>
					<TextInput
						style={styles.input}
						secureTextEntry={true}
						placeholder={"Password"}
						textContentType={"password"}
						returnKeyType={"send"}
						autoCapitalize = "none"
						onChangeText={(text) => this.setState({password: text})}
						onSubmitEditing={() => this.createUser()}
					/>
					<FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
					<Button style={styles.loginButton} onPress={() => { this.createUser()}}>
						<Text style={styles.loginButtonText}>Create Account</Text>
					</Button>
				</View>
			</View>
		);
	}
}

export default CreateUser;
