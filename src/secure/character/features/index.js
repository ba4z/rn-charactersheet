import React from "react";
import {Modal, ScrollView, SectionList, TouchableOpacity, View} from "react-native";
import {Icon, ListItem, Text} from "react-native-elements";
import NewFeature from "./newFeature";
import Feature from "../../../om/Feature";

const compare = function (a, b) {
	if(a.name < b.name)
		return -1;
	if(a.name > b.name)
		return 1;
	return 0;
};


class FeaturesView extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			features: this.groupFeatures(this.props.features) || [],
			fbFeatures: props.features,
			showFeatureModal: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			features: this.groupFeatures(nextProps.features) || [],
			fbFeatures: nextProps.features,
			showFeatureModal: false
		});
	}

	groupFeatures(fbFeatures) {
		let featureList = [];
		if(fbFeatures) {
			Object.keys(fbFeatures).map((featureId) => {
				let newFeature = new Feature(this.props.characterId);
				newFeature.initFromDb(fbFeatures[featureId]);

				let group = featureList.filter(section => {
					return section.type === fbFeatures[featureId]._type;
				});
				if(!group[0]) {
					featureList.push({
						name: Feature.featureTypes[newFeature.type].name,
						type: newFeature.type,
						data: [newFeature]
					});
					return;
				}
				group[0].data.push(newFeature);
			});

			featureList.sort(compare);
			featureList.map(feature => {
				feature.data.sort(compare);
			});
		}
		return featureList;
	}

	showFeatureModal(show) {
		this.setState({showFeatureModal: show})
	}

	addFeature(newFeature) {
		this.props.addFeature(newFeature);
		this.showFeatureModal(false);
	}

	render() {
		return (
			<ScrollView>
				<Modal presentationStyle="formSheet"
				       animationType="slide"
				       visible={this.state.showFeatureModal}>
					<NewFeature addFeature={this.addFeature.bind(this)} characterId={this.props.characterId} show={this.showFeatureModal.bind(this)}/>
				</Modal>

				<SectionList
					renderItem={({item, index, section}) => {
						return (<TouchableOpacity style={{backgroundColor: "white"}} onPress={() => {
							this.props.viewFeature(item)
						}}><ListItem
							key={index}
							title={item.name}
							subtitle={item.description}
						/></TouchableOpacity>)
					}}
					renderSectionHeader={({section: {name}}) => {
						return (<Text h4 style={{fontWeight: "bold", padding: 10}}>{name}</Text>)
					}}
					sections={this.state.features}
					keyExtractor={(item, index) => item + index}
				/>
				<TouchableOpacity onPress={() => {this.showFeatureModal(true)}}
				                  style={{marginRight: 10, marginTop: 25, marginBottom: 25}}>
					<Icon name='plus' type='feather'/>
				</TouchableOpacity>
			</ScrollView>
		);
	}
}

export default FeaturesView;
