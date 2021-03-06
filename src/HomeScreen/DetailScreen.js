import React from 'react';
import { Alert, View, Text, Button, StyleSheet, Image, TouchableHighlight, ScrollView, FlatList, Modal, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import * as OpenAnything from 'react-native-openanything';
import {AsyncStorage} from 'react-native'
import MemoriesScreen from "../MemoriesScreen/MemoriesScreen.js"
import { NavigationActions } from 'react-navigation'

// name accessed via {navigation.state.params.name}



export default class DetailScreen extends React.Component {

	static navigationOptions = ({navigation}) => ({
      title: navigation.state.params.name + "'s Profile",
    })


	constructor(props) {
    	super(props);
    	this.state = {modalVisible: false, isLoading: true};
    	this._notificationPress = this._notificationPress.bind(this)
  	}

  	async componentWillMount() {
  		let key = this.props.navigation.state.params.key
	    AsyncStorage.getItem('friends').then((list) => {
			if (list == null) return
			let friendsList = JSON.parse(list).allData
			var friend = 0
			for (var i = 0; i < friendsList.length; i++) {
				if (friendsList[i].key === key) {
					friend = friendsList[i];
					break;
				}
			}

			notificationsCopy = friend.notifications
			if (notificationsCopy ) {
				notificationsCopy.sort(function(a, b) { return a < b })
				for (i = 0; i < notificationsCopy.length; i++) {
					if (notificationsCopy[i].status === 'new') {
						setTimeout(() => {this.refs.notifSwiper.scrollBy(1) }, 300)
					}
				}
			} else {
				notificationsCopy = []
			}
			

			this.setState({
				name: friend.name,
				photo: friend.photo,
				fire: friend.fire,
				currFire: friend.currFire,
				lastConnected: friend.lastConnected,
				lastConnectedType: friend.lastConnectedType,
				notifications: notificationsCopy,
				isLoading: false,
			})
	    })
  	}

  	_schedulePress = function() {
  		
  	}

  	_sendTextPress = function(name) {
  		OpenAnything.Text('+18326460004', 'Hey, ' + name + ' it\'s been a while since we talked! Want to meet up this week?');
  		setTimeout(() => {
  			notificationsCopy = []
  			for (var i = 0; i < this.state.notifications.length; i++) {
  				notificationsCopy.push(this.state.notifications[i]);
  			}

			notificationsCopy.sort(function(a, b) { return a > b })
			newNotification = {
				key: notificationsCopy.length + 1, 
				status: 'old', 
				type: 'Sent text', 
				date: "Dec 8", 
				description: 'You texted ' + this.state.name, 
				icon: require('../../assets/icons/send-text.png'), 
				tintColor: '#B7695C'
			}
			notificationsCopy.push(newNotification)
			notificationsCopy.sort(function(a, b) { return a < b })			


	  		this.setState({
				name: this.state.name,
				photo: this.state.photo,
				fire: this.state.fire,
				currFire: this.state.currFire,
				lastConnected: "today",
				lastConnectedType: "You: Sent text",
				notifications: notificationsCopy,
				isLoading: false,
			})

			// SOMEHOW NEED TO UPDATE THE DB *******
			item = {
				key: this.props.navigation.state.params.key
			}

			this.props.navigation.state.params.update(item, "Sent text", newNotification)
  		}, 500);
  	};

  	_highFivePress = function() {
  		this._setModalVisible(true)
  	};

  	_sendHighFive = function() {
  		this._setModalVisible(false)
  		setTimeout(() => {
  			notificationsCopy = []
  			for (var i = 0; i < this.state.notifications.length; i++) {
  				notificationsCopy.push(this.state.notifications[i]);
  			}

			notificationsCopy.sort(function(a, b) { return a > b })
			newNotification = {
				key: notificationsCopy.length + 1, 
				status: 'old', 
				type: 'High-fived', 
				date: "Dec 8", 
				description: 'You high-fived ' + this.state.name, 
				icon: require('../../assets/icons/hand.png'), 
				tintColor: '#CDBB79'
			}
			notificationsCopy.push(newNotification)
			notificationsCopy.sort(function(a, b) { return a < b })

			// UPDATE THE FIRE
		    if (this.state.currFire == 'dead') {
		      this.state.fire = require('../../assets/fires/tiny_fire.png')
		      this.state.currFire = 'tiny'
		    } else if (this.state.currFire == 'tiny') {
		      this.state.fire = require('../../assets/fires/small_fire.png')
		      this.state.currFire = 'small'
		    } else if (this.state.currFire == 'small') {
		      this.state.fire = require('../../assets/fires/medium_fire.png')
		      this.state.currFire = 'medium'
		    } else if (this.state.currFire == 'medium') {
		      this.state.fire = require('../../assets/fires/large_fire.png')
		      this.state.currFire = 'large'
		    }		

	  		this.setState({
				name: this.state.name,
				photo: this.state.photo,
				fire: this.state.fire,
				currFire: this.state.currFire,
				lastConnected: "today",
				lastConnectedType: 'You: High-fived',
				notifications: notificationsCopy,
				isLoading: false,
			})


			Alert.alert('Success','High five sent!');

			// SOMEHOW NEED TO UPDATE THE DB *******

			item = {
				key: this.props.navigation.state.params.key
			}

			this.props.navigation.state.params.update(item, "High-fived", newNotification)
  		}, 500);
  	};

  	_notificationPress = function(which) {
  		notificationsCopy = this.state.notifications.slice()

  		changed = false
  		for (var i = 0; i < notificationsCopy.length; i++) {
  			if (notificationsCopy[i].key === which) {
  				notificationsCopy[i].status = 'old'
  				changed = true
  			}
  		}

  		if (!changed) {
  			return;
  		}

  		// this.state.notifications = notificationsCopy
  		this.setState({ notifications: notificationsCopy})
  		this.props.navigation.state.params.notifications(this.props.navigation.state.params.key, which)
  	};

  	_setModalVisible = function(visible) {
  		var newState = this.state;
  		newState.modalVisible = visible;
		this.setState(newState);
	}

  	render() {
  		if (this.state.isLoading) {
	      return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading...</Text></View>;
	    }
	    const navigation = this.props.navigation

  		return (
	  		<View style={[styles.container, {backgroundColor: '#EEEEEE'}]}>
			    {/* Name and thumbnail icon */}
			    <View style={styles.title}>
			    	<Image source={this.state.photo} style={styles.thumbnail}/>
			    	<Text numberOfLines={1} style={styles.name}>{this.state.name}</Text>
			    </View>
			   

				{/* Fire/Notifications swiper */}
				<Swiper ref="notifSwiper" paginationStyle={{ bottom: 5}} width={300} style={styles.swiper} showsButtons={false} removeClippedSubviews={false} loop={false}>
			        <View style={styles.slide}>
			          <Image source={this.state.fire} style={styles.fireIcon}/>
			        </View>
			        <ScrollView style={styles.slideScrollView}>
			        	<Text style={{fontSize: 23, textAlign: 'center', textDecorationLine: 'underline', marginBottom: 5}}>Recent Activity</Text>
			        	<FlatList
					      data={this.state.notifications}

					      renderItem={({item}) => 
				      		<TouchableHighlight  flex={3} underlayColor={'silver'} onPress={() => this._notificationPress(item.key)}>
					    		<View style={styles.notification}>
					    			<Image source={item.icon} style={[styles.notificationIcon, {tintColor: item.tintColor}]}/>
					    			<View>
										<Text style={{fontSize: 20, marginLeft: 10, fontWeight: item.status == 'new' ? '800' : 'normal', color: item.status == 'new' ? 'black' : 'black'}}>{item.description}</Text>
						    			<Text style={{fontSize: 20, marginLeft: 10, fontWeight: item.status == 'new' ? '800' : 'normal', color: item.status == 'new' ? 'black' : 'black'}}>{item.date}</Text>
					    			</View>
					    		</View>	
					    	</TouchableHighlight>}
				   		/>
			        </ScrollView>
			        
			    </Swiper>

			    <View>
			    	<Text style={styles.captionText}>last connected {this.state.lastConnected}</Text>
			    </View>

			    <View style={styles.buttonContainer}>
				    <View style={styles.iconButton}>
				    	<TouchableOpacity activeOpacity={0.25} onPress={() => navigation.navigate('Schedule', {name: navigation.state.params.name, editable: false})}>
				    		<Image source={require('../../assets/icons/calendar.png')} style={styles.icon}/>
				    	</TouchableOpacity>
				    	<Text style={styles.buttonText}>View</Text>
				    	<Text style={styles.buttonText}>Schedule</Text>
				    </View>

				    <View style={styles.iconButton}>
				    	<TouchableOpacity activeOpacity={0.25} onPress={() => {
				    		const navigateAction = NavigationActions.navigate({
							  routeName: 'Memories',
							  params: {},
							  action: NavigationActions.navigate({ routeName: 'Memories', params: {friendName: this.state.name, friendKey: this.props.navigation.state.params.key } })
							})

				    		navigation.dispatch(navigateAction)				    		
				    		// navigation.navigate('Memories', {filterFriend: this.state.name , filterFriendKey: this.props.navigation.state.params.key})
				    	}}>
				    		<Image source={require('../../assets/icons/friends.png')} style={[styles.icon, {tintColor: '#51A39D'}]}/>
				    	</TouchableOpacity>
				    	<Text style={styles.buttonText}>Shared</Text>
				    	<Text style={styles.buttonText}>Memories</Text>
				    </View>

				    <View style={styles.iconButton}>
				    	<TouchableOpacity activeOpacity={0.25} onPress={() => this._sendTextPress(this.state.name)}>
				    		<Image source={require('../../assets/icons/send-text.png')} style={[styles.icon, {tintColor: '#B7695C'}]}/>
				    	</TouchableOpacity>
				    	<Text style={styles.buttonText}>Send</Text>
				    	<Text style={styles.buttonText}>Text</Text>
				    </View>

				    <View style={styles.iconButton}>
				    	<TouchableOpacity activeOpacity={0.25} onPress={() => this._highFivePress()}>
				    		<Image source={require('../../assets/icons/hand.png')} style={[styles.icon, {tintColor: '#CDBB79'}]}/>
				    	</TouchableOpacity>
				    	<Text style={styles.buttonText}>Send</Text>
				    	<Text style={styles.buttonText}>High-Five</Text>
				    </View>
			    	
			    </View>
			    <View>
			        <Modal animationType="slide" transparent={false} visible={this.state.modalVisible} >
		         		<View style={{marginTop: 20, flexDirection: 'column'}}>
			         		<View style={{margin: 20, flexDirection: 'row'}}>
				         		<TouchableOpacity activeOpacity={0.25} onPress={() => this._setModalVisible(false)}>
						    		<Image source={require('../../assets/icons/cancel.png')} style={styles.modalCancel}/>
						    	</TouchableOpacity>
			         		</View>
			         		<View style={{marginTop: 50, flexDirection: 'column', alignItems: 'center'}}>
				         		<Text style={styles.modalText}>Give {this.state.name} a high five!</Text>
				         		<TouchableOpacity activeOpacity={0.25} onPress={() => this._sendHighFive()}>
						    		<Image source={require('../../assets/icons/hand.png')} style={styles.modalIcon}/>
						    	</TouchableOpacity>
						    	<Text style={[styles.modalText]}>tap to confirm</Text>
			         		</View>
		         		</View>

		         	
			        </Modal>
			    </View>
			</View>
		);
  	}

}

const styles = StyleSheet.create({
	container: {  
		flex:1,
		alignItems: 'center', 
		justifyContent: 'center', 
	},

	title: {
		flexDirection: 'row',
		alignContent: 'flex-start',
		alignItems: 'flex-start',
		marginLeft: 30,
		marginTop: 20,
		marginBottom: 20,
		width: '100%',
	},

	thumbnail: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},

	name: {
		fontSize: 40,
		color: 'dimgray',
		lineHeight: 100,
		marginLeft: 20,
		width: 275
	},

	swiper: {
	},

	slide: {
		justifyContent: 'center',
   		alignItems: 'center',
	},

	slideScrollView: {
		marginTop: 20,
		marginBottom: 20,
	},

	fireIcon: {
		width: 250,
		height: 250,
	},

	captionText: {
		fontSize: 25,
		color: 'black',
		padding: 10,
		marginBottom: 20,
	},

	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	iconButton: {
		flexDirection:'column',
		padding: 10,
		justifyContent: 'center',
   		alignItems: 'center',
   		marginBottom: 10,
	},

	icon: {
		width: 70,
		height: 70,
	},

	buttonText: {
		fontSize: 17.5,
		color: 'black',
	},

	notification:{
		borderBottomColor: 'black',
		borderBottomWidth: 0.5,
		flexDirection: 'row',
		width: '100%',
		padding: 10,
	},

	notificationIcon: {
		width: 40,
		height: 40,
	},

	notificationText: {
		fontSize: 20,
		marginLeft: 10,
	},

	modalView: {
		flexDirection: 'row',
		margin: 20,
	},

	modalText: {
		fontSize: 30,
		fontFamily: 'Avenir Next',
	},

	modalCancel: {
		width: 50, 
		height: 50,
	},

	modalIcon: {
		width: 175,
		height: 175,
		margin: 75,
		marginLeft: 65,
		tintColor: '#CDBB79'
	},

});