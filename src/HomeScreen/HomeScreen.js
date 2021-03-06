import React from 'react';
import { Alert, Dimensions, View, Text, Button, FlatList, StyleSheet, Image, TouchableHighlight } from 'react-native';
import Swipeout from 'react-native-swipeout'
import { NavigationActions } from 'react-navigation'
import {AsyncStorage} from 'react-native'
import friendListObject from '../../data.js'
//var SearchBar = require('react-native-search-bar');

class HomeScreen extends React.Component {  
  constructor(props) {
    super(props);

    // UNCOMMENT THIS STUFF TO RESET THE DATABASE, THEN RECOMMENT AFTER RUNNING

    // this.state = {allData: [
    //     {key: 1, name: 'Claire R.', photo: require('../../assets/profilePictures/claire.png'), fire: require('../../assets/fires/small_fire.png'), lastConnected:"1 hour ago", lastConnectionType:"High-Fived", notificationCount:1},
    //     {key: 2, name:'John S.', photo: require('../../assets/profilePictures/john.png'), fire: require('../../assets/fires/large_fire.png'), lastConnected:"yesterday", lastConnectionType:"Sent Text", notificationCount:0},
    //     {key: 3, name:'Nate G.', photo: require('../../assets/profilePictures/nate.png'), fire: require('../../assets/fires/medium_fire.png'), lastConnected:"4 days ago", lastConnectionType:"Added Memory", notificationCount:0},
    //     {key: 4, name:'Ella E.', photo: require('../../assets/profilePictures/ella.png'), fire: require('../../assets/fires/dead_fire.png'), lastConnected:"2 weeks ago", lastConnectionType:"High-Fived", notificationCount:0}
    //   ], currData: [
    //     {key: 1, name:'Claire R.', photo: require('../../assets/profilePictures/claire.png'), fire: require('../../assets/fires/small_fire.png'), lastConnected:"1 hour ago", lastConnectionType:"High-Fived", notificationCount:1},
    //     {key: 2, name:'John S.', photo: require('../../assets/profilePictures/john.png'), fire: require('../../assets/fires/large_fire.png'), lastConnected:"yesterday", lastConnectionType:"Sent Text", notificationCount:0},
    //     {key: 3, name:'Nate G.', photo: require('../../assets/profilePictures/nate.png'), fire: require('../../assets/fires/medium_fire.png'), lastConnected:"4 days ago", lastConnectionType:"Added Memory", notificationCount:0},
    //     {key: 4, name:'Ella E.', photo: require('../../assets/profilePictures/ella.png'), fire: require('../../assets/fires/dead_fire.png'), lastConnected:"2 weeks ago", lastConnectionType:"High-Fived", notificationCount:0}
    //   ], width : Dimensions.get('window').width};
    // AsyncStorage.clear()
    // return 

    this.state = {isLoading: true}
    this._removeFriend = this._removeFriend.bind(this)
    this._removeFriendPressed = this._removeFriendPressed.bind(this)    
  }

  async componentWillMount() {
    let isSetUp = await AsyncStorage.getItem('isSetUp')
    if (!isSetUp) {
      friendObject = {
        allData: friendListObject.allData,
        currData: friendListObject.allData,
      }

      photos = {photos: friendListObject.pictures}

      await AsyncStorage.setItem('friends', JSON.stringify(friendObject))
      await AsyncStorage.setItem('photos', JSON.stringify(photos))
      await AsyncStorage.setItem('isSetUp', 'done!')
    }
    AsyncStorage.getItem('friends').then((list) => {
      if (list == null) return
      let friendsList = JSON.parse(list)
      this.setState({
        allData: friendsList.allData,
        currData: friendsList.currData,
        isLoading: false,
        width: Dimensions.get('window').width
      })
    })
  }


  
  _removeFriend(item) {

    //console.log(item)
    for (var i = 0; i < this.state.allData.length; i++) {
      if(this.state.allData[i].key === item.key) {
        this.state.allData.splice(i,1);
      }
    };
    let newFriendsList = {
      allData: this.state.allData,
      currData: this.state.allData
    }

    AsyncStorage.setItem('friends', JSON.stringify(newFriendsList))
    this.setState({currData : this.state.allData});
    
  }

  _removeFriendPressed(item) {
    Alert.alert('Delete ' + item.name + '?', 
      'This will delete all your memories with this friend.', 
      [
        {text: 'Delete', onPress: () => this._removeFriend(item)},
        {text: 'Cancel'}
      ])
  }

  onSave = user => {
    user.key = this.state.currData.length + new Date().getUTCMilliseconds();
    user.fire = require('../../assets/fires/tiny_fire.png');
    user.currFire = 'tiny'
    user.lastConnectionType = 'You: Added Friend';
    user.lastConnected = 'today';
    user.notificationCount = 1;
    newNotification = {key: 1, status: 'new', type: 'Added memory', date: "Dec 8", description: 'Became friends', icon: require('../../assets/icons/friends.png'), tintColor: '#51A39D'},
    user.notifications = [newNotification]
    delete user.phone;
    const copyData = this.state.allData.slice();
    copyData.unshift(user);

    let newFriendsList = {
      allData: copyData,
      currData: copyData
    }

    AsyncStorage.setItem('friends', JSON.stringify(newFriendsList))
    this.setState({currData: copyData});
    this.forceUpdate();
    // commented out time change for simplicity 

    // setTimeout(() => {
    //   dataCopy = this.state.currData;
    //   for (var i = 0; i < this.state.currData.length; i++) {
    //     if(this.state.currData[i].key === user.key) {
    //       dataCopy[i].lastConnected = '1 minute ago';
    //       this.setState({ currData : dataCopy });
    //     }
    //   };
    // }, 60000)
    // const backAction = NavigationActions.back({
    //     key: 'Home'
    // })
    // this.props.navigation.dispatch(backAction)
    
    
  };

  updateOrder = (item, action, newNotification) => {
    dataCopy = [];

    for (var i = 0; i < this.state.currData.length; i++) {
      if(this.state.currData[i].key === item.key) {
        dataCopy.push(this.state.currData[i])
      }
    };

    for (var i = 0; i < this.state.currData.length; i++) {
      if(this.state.currData[i].key !== item.key) {
        dataCopy.push(this.state.currData[i])
      }
    };

    dataCopy[0].lastConnected = 'today'
    dataCopy[0].lastConnectionType = 'You: ' + action


    notificationsCopy = dataCopy[0].notifications.slice()
    notificationsCopy.push(newNotification)
    dataCopy[0].notifications = notificationsCopy

    // UPDATE THE FIRE
    if (dataCopy[0].currFire == 'dead') {
      dataCopy[0].fire = require('../../assets/fires/tiny_fire.png')
      dataCopy[0].currFire = 'tiny'
    } else if (dataCopy[0].currFire == 'tiny') {
      dataCopy[0].fire = require('../../assets/fires/small_fire.png')
      dataCopy[0].currFire = 'small'
    } else if (dataCopy[0].currFire == 'small') {
      dataCopy[0].fire = require('../../assets/fires/medium_fire.png')
      dataCopy[0].currFire = 'medium'
    } else if (dataCopy[0].currFire == 'medium') {
      dataCopy[0].fire = require('../../assets/fires/large_fire.png')
      dataCopy[0].currFire = 'large'
    }

    this.setState({allData: dataCopy, currData: dataCopy})

    
    let newFriendsList = {
      allData: dataCopy,
      currData: dataCopy
    }
    AsyncStorage.setItem('friends', JSON.stringify(newFriendsList))
  }

  updateNotifications = (userKey, notificationKey) => {
    dataCopy = [];

    for (var i = 0; i < this.state.currData.length; i++) {
      if (this.state.currData[i].key === userKey) {
        notificationsCopy = this.state.currData[i].notifications.slice()
        for (var j = 0; j < notificationsCopy.length; j++) {
          if (notificationsCopy[j].key === notificationKey) {
            notificationsCopy[j].status = 'old'
          }
        }

        this.state.currData[i].notifications = notificationsCopy
      }

      dataCopy.push(this.state.currData[i])
    };

    this.setState({allData: dataCopy, currData: dataCopy})

    
    let newFriendsList = {
      allData: dataCopy,
      currData: dataCopy
    }
    AsyncStorage.setItem('friends', JSON.stringify(newFriendsList))
  }


  /*function filterData(text) {
    var newData = [];
    for (var i = 0; i < allData.length; i++) {
      if(allData[i].key.toLowerCase.includes(text.toLowerCase()))
        newData.push(allData[i]);
    };
    currData = newData;
  }*/
  _removeNotifications(key) {
    dataCopy = this.state.currData;
    for (var i = 0; i < this.state.currData.length; i++) {
      if(this.state.currData[i].key === key) {
        dataCopy[i].notificationCount = 0;
        this.setState({ currData : dataCopy });
        this.setState({ allData : dataCopy });
      }
    };

    let newFriendsList = {
      allData: dataCopy,
      currData: dataCopy
    }
    AsyncStorage.setItem('friends', JSON.stringify(newFriendsList))
  }

  _renderItem(item, navigation) {
    let swipeBtns = [{
      text: 'High Five',
      backgroundColor: '#CDBB79',
      underlayColor: 'rgba(0, 0, 0, 0.6)',
      onPress: () => {
        // UPDATE DATABASE and ORDER

        newNotification = {
          key: item.notifications.length + 1, 
          status: 'old', 
          type: 'High-fived', 
          date: "Dec 8", 
          description: 'You high-fived ' + item.name, 
          icon: require('../../assets/icons/hand.png'), 
          tintColor: '#CDBB79'
        }

        this.updateOrder(item, 'High-fived', newNotification)
        
        Alert.alert('Success','High five sent!');
      }
    },
    {
      text: 'Remove',
      backgroundColor: 'crimson',
      underlayColor: 'rgba(0, 0, 0, 0.6)',
      onPress: () => {this._removeFriendPressed(item)}
    }];
    return(
          <Swipeout right={swipeBtns} backgroundColor= 'transparent' autoClose={true}>
            <TouchableHighlight underlayColor='rgba(200,200,200,0.8)'
            onPress={() => {
              this._removeNotifications(item.key);
              // navigation.navigate('Detail', {name: item.name, photo: item.photo, fire: item.fire, lastConnected: item.lastConnected});
              navigation.navigate('Detail', {notifications: this.updateNotifications, update: this.updateOrder, key: item.key, name: item.name});
            }}> 
              <View style={{flex: 1, height: 100, width:this.state.width, flexDirection: 'row', justifyContent: 'center'}}>
                <Image source={item.photo} style={{height:83, width:83, borderRadius:83/2, marginRight:10, marginTop:10, position:'absolute', left:10}}/>
                <View style={{display:item.notificationCount==0?'none':'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', backgroundColor:'#EE4948',height:26, width:26, borderRadius:26/2, position:'absolute', top:7, left:7}}>
                  <Text style={{color:'#FFF', fontSize:14,}}>{item.notificationCount}</Text>
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'center', position:'absolute', left: 103, top:15}}>
                  <Text numberOfLines={1} style={{width: this.state.width/1.8, fontSize: 36, color:'#444', fontWeight:item.notificationCount==0?'normal':'bold'}}>{item.name}</Text>
                  <Text style={{fontSize: 14, color:'#888'}}>{item.lastConnectionType} {item.lastConnected}</Text>
                </View>
                <Image source={item.fire} style={{position:'absolute', right:0, width: 95, height: 95}}/>
              </View>
            </TouchableHighlight>
          </Swipeout>);
  }

  render() {
    if (this.state.isLoading) {
      return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading...</Text></View>;
    }

    const { navigate } = this.props.navigation;
    return(
    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
      
      <FlatList
        visible={this.state.currData.length!==0}
        data={this.state.currData}
        extraData={this.state}
        renderItem={({item}) => this._renderItem(item, {navigate})}

        ItemSeparatorComponent={this.renderSeparator}
      />
      <TouchableHighlight underlayColor='rgba(200,200,200,0.8)'
            onPress={() => navigate('AddFriend', {onSave: this.onSave})} style={{position:'absolute', right:20, bottom:20, height:64, width:64, borderRadius:64/2}}> 
        <View style={{alignItems: 'center', justifyContent:'center', flexDirection:'column', backgroundColor:'#EE4948',height:64, width:64, borderRadius:64/2, shadowColor: '#000000', shadowOffset: {width: 0, height: 4}, shadowRadius: 4, shadowOpacity: 0.7}}>
          <Text style={{color:'#FFF', fontSize:32, marginBottom:5}}>+</Text>
        </View>
      </TouchableHighlight>
    </View>

  )};

  renderSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: '90%',
            backgroundColor: '#999',
            marginLeft: '5%',
            marginRight: '5%'
          }}
        />
      );
    };
  }

export default HomeScreen;