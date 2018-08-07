import React from "react";
import styles from "./styles";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import Swiper from "react-native-swiper";
import {TextInput} from "@shoutem/ui/components/TextInput";
import {Button, Icon} from "react-native-elements";
import FeaturesView from "../index";
import Feature from "../../../../om/Feature";

class NewFeature extends React.Component {
	swiper;
	newFeature;

	cellViews = Object.keys(Feature.featureTypes).map((type) => {
		return (
			<TouchableOpacity key={type} style={styles.gridItem} onPress={() => this.selectType(type)}>
				<Icon
					name={Feature.featureTypes[type].icon}
					type={Feature.featureTypes[type].iconType}
					size={50}
				/>
				<Text style={{textAlign: "center"}}>{Feature.featureTypes[type].name}</Text>
			</TouchableOpacity>
		);
	});

	constructor(props) {
		super(props);
		this.newFeature = new Feature(props.characterId);
		console.log(this.newFeature);
		this.state = {
			currentSlide: 0,
			newFeatureType: "",
			newFeatureTitle: "",
			newFeatureDescription: "",
			newAmount: 1,
		};
	}

	selectType(type) {
		this.setState({newFeatureType: type});
		this.nextSlide();
	}

	nextSlide() {
		this.setState({currentSlide: this.state.currentSlide++});
		this.swiper.scrollBy(this.state.currentSlide);
	}

	saveItem() {
		this.newFeature.type = this.state.newFeatureType;
		this.newFeature.name = this.state.newFeatureTitle;
		this.newFeature.description = this.state.newFeatureDescription;
		this.newFeature.amount = this.state.newAmount;
		this.newFeature.save();
		this.props.addFeature(this.newFeature);
	}

	render() {
		return (
			<View style={{backgroundColor: "white", justifyContent: "center", alignItems: "center", flex: 1}}>
				<TouchableOpacity style={{alignSelf: "flex-end", margin: 25}} onPress={() => {
					this.props.show(false);
				}}>
					<Icon name='md-close' type='ionicon' size={25}/>
				</TouchableOpacity>
				<Swiper style={styles.wrapper} showsButtons={false} loop={false} scrollEnabled={false}
				        showsPagination={false} ref={component => this.swiper = component}>
					<ScrollView style={{flex: 1}}>
						<View style={styles.slide1}>
							<Text style={styles.text}>Select Type</Text>
							<View style={styles.grid}>
								{this.cellViews}
							</View>
						</View>
					</ScrollView>
					<ScrollView>
						<View style={styles.slide2}>
							<Text style={{...styles.text, ...styles.header}}>Describe Your
								New {this.state.newFeatureType ? Feature.featureTypes[this.state.newFeatureType].name : ""}</Text>
							<TextInput
								style={styles.input}
								placeholder={"Name of Item"}
								onChangeText={(text) => this.setState({newFeatureTitle: text})}
							/>
							<TextInput
								style={{...styles.input, ...styles.inputMultiLine}}
								placeholder={"Item Description (stats, abilities, etc)"}
								multiline={true}
								numberOfLines={4}
								onChangeText={(text) => this.setState({newFeatureDescription: text})}
							/>
							<Button title='Continue' onPress={() => this.saveItem()} backgroundColor={"#2794F0"}/>
						</View>
					</ScrollView>
				</Swiper>
			</View>
		);
	}
}

export default NewFeature;
