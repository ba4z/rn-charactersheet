import React, {Component} from "react";
import styles from "./styles";
import {Button, Icon} from "react-native-elements";
import {Text, View} from "react-native";

class UpDownInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			value: props.value || 0,
			max: props.max || null,
			min: props.min || null,
			iconType: props.iconType,
			stepSize: props.stepSize || 1
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			value: nextProps.value || 0,
			max: nextProps.max || null,
			min: nextProps.min || null,
			iconType: nextProps.iconType
		});
	}

	updateValue(newVal) {
		if(this.state.max && newVal > this.state.max) {
			return;
		}
		if(this.state.min && newVal < this.state.min) {
			return;
		}
		this.setState({value: newVal});
		this.props.onChange(newVal);
	}

	display() {
		let returnValue = this.state.value;
		if(this.props.max) {
			returnValue += ` / ${this.state.max}`
		}
		return returnValue;
	}

	render() {
		return (
			<View style={styles.container}>
				<Button
					style={styles.button}
					onPress={() => {
						this.updateValue(this.state.value + this.state.stepSize);
					}}
					title=""
					transparent={true}
					activeOpacity={0.2}
					icon={{name: "chevron-up", type: "entypo", size: 25, color: "#2794F0"}}
				/>
				<View style={styles.group}>
					{this.props.icon &&
						<Icon
							name={this.props.icon}
							type={this.props.iconType || "font-awesome"}
							size={25}
							iconStyle={{marginRight: 15}}
							color={this.props.color}
						/>
					}
					<Text style={{marginLeft: -8}}>
						{this.display()}
					</Text>
				</View>
				<Button
					style={styles.button}
					onPress={() => {
						this.updateValue(this.state.value - this.state.stepSize);
					}}
					title=""
					transparent={true}
					activeOpacity={0.2}
					icon={{name: "chevron-down", type: "entypo", size: 25, color: "#2794F0"}}
				/>
			</View>

		);
	}
}

export default UpDownInput;
