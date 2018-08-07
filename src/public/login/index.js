import React from "react";
import styles from "./styles";
import {View} from "@shoutem/ui/components/View";
import {Button} from "@shoutem/ui/components/Button";
import {Image, Text, TextInput} from "react-native";
import firebase from "react-native-firebase";
import Spinner from "react-native-loading-spinner-overlay";
import errorCodes from "../errorCodes";
import {FormValidationMessage} from "react-native-elements";

class LoginPage extends React.Component {
	passwordInput;

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			busy: false,
			errorMessage: null
		}
	}

	onLogin() {
		this.setState({busy: true});
		firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.username, this.state.password).then(result => {
			this.passwordInput.clear();
			this.setState({busy: false, username: "", password: "", errorMessage: null});
			this.props.navigation.navigate("CharacterList");
		}, err => {
			console.log(err.code);
			this.passwordInput.clear();
			this.setState({busy: false, password: ""});
			if(errorCodes[err.code]) {
				return this.setState({errorMessage: errorCodes[err.code]});
			}
			this.setState({errorMessage: err.message});
		});
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<Spinner visible={this.state.busy} />

				<View style={{flex: 1}}>
					<Image style={{flex: 1}}
					       source={{uri: "https://clearmountaindevelopment.com/wp-content/uploads/2018/06/the-witcher-3-wild-hunt-geralt-and-ciri_1152x720.jpg"}}/>
				</View>
				<View style={styles.container}>
					<TextInput
						textContentType={"username"}
						style={styles.input}
						placeholder={"Username or email"}
						returnKeyType={"send"}
						autoCapitalize = "none"
						keyboardType={"email-address"}
						onChangeText={(text) => this.setState({username: text})}
						onSubmitEditing={() => this.onLogin()}
					/>
					<TextInput
						style={styles.input}
						secureTextEntry={true}
						placeholder={"Password"}
						textContentType={"password"}
						ref={input => { this.passwordInput = input }}
						returnKeyType={"send"}
						autoCapitalize = "none"
						onChangeText={(text) => this.setState({password: text})}
						onSubmitEditing={() => this.onLogin()}
					/>
					<FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
					<Button style={styles.loginButton} onPress={() => { this.onLogin()}}>
						<Text style={styles.loginButtonText}>Login</Text>
					</Button>
					<Button style={styles.createAccountButton} onPress={() => { this.props.navigation.navigate("CreateUser");}}>
						<Text>Create User</Text>
					</Button>
				</View>
			</View>
		);
	}
}

export default LoginPage;
