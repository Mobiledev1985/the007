/**
 * @format
 */

import {AppRegistry, Platform, StatusBar, View, Alert, AppState} from 'react-native';
import React, {Component} from "react";
import App from './App';
import {name as appName} from './app.json';
import MyStatusBar from "./app/components/MyStatusBar";
import {Constants} from "./app/consts/Constants";
import {Colors} from "./app/consts/Colors";
import * as Util from "./app/utils/Util";
import Memory from './app/core/Memory';
import WebService from "./app/core/WebService";
import { EventRegister } from 'react-native-event-listeners';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import RootNavigator from "./app/components/RootNavigator";
import AsyncStorage from '@react-native-community/async-storage';
	

var TAG = "index.js";


function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      // App has been launched in the background by iOS, ignore
      return null;
    }
  
    return <App />;
}
  

AppRegistry.registerComponent(appName, () => HeadlessCheck);

// export default class MyApp extends React.Component {

//     constructor(props) {
//         super(props);
//         Util.StringFormat();
//         Util.StringStartsWith();
//     }

//     state = {
//         notificationCount: {
//             post: 0,
//             member: 0,
//             event: 0,
//             travel: 0,
//             gift: 0,
//             chat: 0
//         }
//     }

//     /****
//      * notify_type
//      * 
//      * 0: null
//      * 1: post
//      * 2: member
//      * 3: party
//      * 4: travel
//      * 5: gift
//      * 6: chat
//      * 7: profile
//      * 
//      */

//     componentDidMount() {
//         // this.getData();
        
//         setTimeout(SplashScreen.hide, 10);
//         Memory().env == "DEV";
//         // AppState.addEventListener('change', async(state) => {
//         //         if(state == "active") {
                   
//         //             this.callGetNotificationCountAPI();
                    
//         //         }
//         //     }
//         // )
//     }

//     callGetNotificationCountAPI = async () => {
//         try {

//             var userId = await AsyncStorage.getItem(Constants.KEY_USER_ID);
//             var userToken = await AsyncStorage.getItem(Constants.KEY_USER_TOKEN);
//             if(userId == "" || userId == null ||  userId == undefined || userToken == "" || userToken == null || userToken == undefined) {
//                 return;
//             }

//             let uri = Memory().env == "LIVE" ? Global.URL_GET_NOTIFICATION_COUNT : Global.URL_GET_NOTIFICATION_COUNT_DEV;

//             let params = new FormData();
//             params.append("token", userToken);
//             params.append("user_id", userId);
//             params.append("format", "json");

//             console.log(TAG + " callGetNotificationCountAPI uri " + uri);
//             console.log(TAG + " callGetNotificationCountAPI params " + JSON.stringify(params));

//             WebService.callServicePost(
//                 uri,
//                 params,
//                 this.handleGetNotificationCountResponse
//             );
//         } catch (error) {
//             console.log(error)
//             // if (error != undefined && error != null && error.length > 0) {
//             //     Alert.alert(error.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
//             // }
//         }
//     };

//     /** Handle send rose Data
//      *
//      * @param response
//      * @param isError
//      */

//     handleGetNotificationCountResponse = async(response, isError) => {
//         console.log(TAG + " callGetNotificationCountAPI result " + JSON.stringify(response));
//         console.log(TAG + " callGetNotificationCountAPI isError " + isError);
//         if (!isError) {
//             try {
//                 var result = response;
//                 if (result != null) {
//                     if (result.status == "success") {
//                         const {notificationCount} = this.state;
//                         var post_count = 0;
//                         var profile_count = 0;
//                         if(result.data != null) {
//                             if(result.data.length == 0) {
//                                 notificationCount.post = 0;
//                                 notificationCount.member = 0;
//                                 notificationCount.event = 0;
//                                 notificationCount.travel = 0;
//                                 notificationCount.gift = 0;
//                                 notificationCount.chat = 0;
//                             } else {
//                                 for(i = 0; i < result.data.length; i ++) {
//                                     if(result.data[i].notify_type == "1") {
//                                         // notificationCount.post = parseInt(result.data[i].count, 10);
//                                         post_count = parseInt(result.data[i].count, 10);
//                                     } else if(result.data[i].notify_type == "2") {
//                                         notificationCount.member = parseInt(result.data[i].count, 10);
//                                     } else if(result.data[i].notify_type == "3") {
//                                         notificationCount.event = parseInt(result.data[i].count, 10);
//                                     } else if(result.data[i].notify_type == "4") {
//                                         notificationCount.travel = parseInt(result.data[i].count, 10);
//                                     } else if(result.data[i].notify_type == "5") {
//                                         notificationCount.gift = parseInt(result.data[i].count, 10);
//                                     } else if(result.data[i].notify_type == "6") {
//                                         notificationCount.chat = parseInt(result.data[i].count, 10);
//                                     } else if(result.data[i].notify_type == "7") {
//                                         // notificationCount.profile = parseInt(result.data[i].count, 10);
//                                         profile_count = parseInt(result.data[i].count, 10);
//                                     } 
//                                 }
//                                 notificationCount.post = post_count + profile_count;
//                             }
                            
//                             await AsyncStorage.setItem('POST', `${notificationCount.post}`);
//                             await AsyncStorage.setItem('MEMBER', `${notificationCount.member}`);
//                             await AsyncStorage.setItem('EVENT', `${notificationCount.event}`);
//                             await AsyncStorage.setItem('TRAVEL', `${notificationCount.travel}`);
//                             await AsyncStorage.setItem('GIFT', `${notificationCount.gift}`);
//                             await AsyncStorage.setItem('CHAT', `${notificationCount.chat}`);
//                             this.setState({
//                                 notificationCount
//                             });
//                             EventRegister.emit(Constants.EVENT_NOTIFICATION_CHANGED, '');
//                         }
//                     } else {
                        
//                     }
//                 }
//             } catch (error) {
//                 console.log(error)
//             }
//         } else {
            
//         }
//     };

//     getData = async () => {
//         // const {notificationCount} = this.state;
//         // let post = await AsyncStorage.getItem('POST');
//         // if (post == null) {
//         //     post = 0;
//         //     await AsyncStorage.setItem('POST', `${post}`);
//         // }
//         // notificationCount.post = parseInt(post);

//         // let member = await AsyncStorage.getItem('MEMBER');
//         // if (member == null) {
//         //     member = 0;
//         //     await AsyncStorage.setItem('MEMBER', `${member}`);
//         // }
//         // notificationCount.member = parseInt(member);

//         // let event = await AsyncStorage.getItem('EVENT');
//         // if (event == null) {
//         //     event = 0;
//         //     await AsyncStorage.setItem('EVENT', `${event}`);
//         // }
//         // notificationCount.event = parseInt(event);

//         // let travel = await AsyncStorage.getItem('TRAVEL');
//         // if (travel == null) {
//         //     travel = 0;
//         //     await AsyncStorage.setItem('TRAVEL', `${travel}`);
//         // }
//         // notificationCount.travel = parseInt(travel);

//         // let gift = await AsyncStorage.getItem('GIFT');
//         // if (gift == null) {
//         //     gift = 0;
//         //     await AsyncStorage.setItem('GIFT', `${gift}`);
//         // }
//         // notificationCount.gift = parseInt(gift);

//         // let chat = await AsyncStorage.getItem('CHAT');
//         // if (chat == null) {
//         //     chat = 0;
//         //     await AsyncStorage.setItem('CHAT', `${chat}`);
//         // }
//         // notificationCount.chat = parseInt(chat);

//         // this.setState({notificationCount});
//         // firebase.messaging().hasPermission()
//         // .then(enabled => {
//         //     if (enabled) {
//         //         firebase.messaging().getToken()
//         //         .then(token => {
                    
//         //             AsyncStorage.setItem(Constants.FIREBASE_ID, token);
//         //         })
//         //         .catch(error => {
//         //             console.log("pppppppppppppppppppppppppppppppppppppppppppppppppppppppp")
//         //             console.log(error);
                    
//         //         })
//         //     } else {
//         //         console.log("elseelseelseelseelseelseelseelseelseelseelseelseelseelseelseelseelseelse")
//         //         firebase.messaging().requestPermission()
//         //         .then(() => {
//         //             firebase.messaging().registerForNotifications();
//         //         })
//         //         .catch(error => {
//         //             console.log(error);
//         //         })
//         //     }
//         // })

//         // this.onNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed(async (notification) => {
//         //     console.log('sdsdfsdf');
//         // })
//         // // firebase.messaging().subscribeToTopic('push_channel');
//         // //This will be trigger when app is foreground
//         // this.notificationListener = firebase.notifications().onNotification(async (notification) => {
//         //     const badgeCount = await getCurrentBadgeCount();
//         //     updateNotificationsBadgeCount(badgeCount + 1);
//         // // await firebase.notifications().displayNotification(notification);
//         //     if(! (await firebase.messaging().hasPermission())) {
//         //         firebase.messaging().requestPermission()
//         //             .then(() => {
//         //                 firebase.messaging().registerForNotifications();
//         //             })
//         //             .catch(error => {
//         //                 console.log(rejected);
//         //             })
//         //     }

//         //     const {title, body} = notification;

//         //     let post_new = await AsyncStorage.getItem('POST');
//         //     if (post_new == null) {
//         //         post_new = 0;
//         //     }
//         //     notificationCount.post = parseInt(post_new);

//         //     let member_new = await AsyncStorage.getItem('MEMBER');
//         //     if (member_new == null) {
//         //         member_new = 0;
//         //     }
//         //     notificationCount.member = parseInt(member_new);

//         //     let event_new = await AsyncStorage.getItem('EVENT');
//         //     if (event_new == null) {
//         //         event_new = 0;
//         //     }
//         //     notificationCount.event = parseInt(event_new);

//         //     let travel_new = await AsyncStorage.getItem('TRAVEL');
//         //     if (travel_new == null) {
//         //         travel_new = 0;
//         //     }
//         //     notificationCount.travel = parseInt(travel_new);

//         //     let gift_new = await AsyncStorage.getItem('GIFT');
//         //     if (gift_new == null) {
//         //         gift_new = 0;
//         //     }
//         //     notificationCount.gift = parseInt(gift_new);

//         //     let chat_new = await AsyncStorage.getItem('CHAT');
//         //     if (chat_new == null) {
//         //         chat_new = 0;
//         //     }
//         //     notificationCount.chat = parseInt(chat_new);
            
//         //     const pageNum = parseInt(notification.data['gcm.notification.toPage']);
//         //     switch (pageNum) {
//         //         case 1:
//         //             notificationCount.post = notificationCount.post + 1;
//         //             await AsyncStorage.setItem('POST', `${notificationCount.post}`);
//         //             break;
//         //         case 2:
//         //             notificationCount.member = notificationCount.member + 1;
//         //             await AsyncStorage.setItem('MEMBER', `${notificationCount.member}`);
//         //             break;
//         //         case 3:
//         //             notificationCount.event = notificationCount.event + 1;
//         //             await AsyncStorage.setItem('EVENT', `${notificationCount.event}`);
//         //             break;
//         //         case 4:
//         //             notificationCount.travel = notificationCount.travel + 1;
//         //             await AsyncStorage.setItem('TRAVEL', `${notificationCount.travel}`);
//         //             break;
//         //         case 5:
//         //             notificationCount.gift = notificationCount.gift + 1;
//         //             await AsyncStorage.setItem('GIFT', `${notificationCount.gift}`);
//         //             break;
//         //         case 6:
//         //             notificationCount.chat = notificationCount.chat + 1;
//         //             await AsyncStorage.setItem('CHAT', `${notificationCount.chat}`);
//         //             break;
//         //         case 7:
//         //             notificationCount.post = notificationCount.post + 1;
//         //             await AsyncStorage.setItem('POST', `${notificationCount.post}`);
//         //             break;
//         //         default:
//         //             break;
//         //     }
//         //     this.setState({notificationCount})
//         //     showMessage({
//         //         type: 'info',
//         //         message: title,
//         //         description: body,
//         //         autoHide: true,
//         //         hideOnPress: true,
//         //         duration: 1850,
//         //         backgroundColor: Colors.black, // background color
//         //         color: Colors.gold,

//         //     })

//         //     EventRegister.emit(Constants.EVENT_NOTIFICATION_CHANGED, '');
//         // })

//         // this.notificationOpenedListener = firebase.notifications().onNotificationOpened( async (notificationOpen) => {
//         //     console.log(notificationOpen);
            
//         //     const badgeCount = await getCurrentBadgeCount();
//         //     updateNotificationsBadgeCount(badgeCount - 1);
            
//         // })

//         // firebase.notifications().getInitialNotification()
//         // .then( async notificationOpen => {
//         //     if (notificationOpen) {
//         //     const badgeCount = await getCurrentBadgeCount()
//         //     updateNotificationsBadgeCount(badgeCount - 1)
            
//         //     }
//         // })
//         // .catch(err => console.log(err))
//         //     this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
//         //     console.log("LOG: ", fcmToken);
//         // })
//     }

//     // onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
//     //     console.log("LOG: ", fcmToken);
//     // })

//     componentWillUnmount() {
//         // this.onTokenRefreshListener();
//         // this.notificationListener();
//         // this.notificationOpenedListener();
//     }



//     render() {
//         console.log(this.state);
//         const {notificationCount} = this.state;
//         return (
//         <View style={{ flex: 1, flexDirection: "column" }}>
//             <MyStatusBar backgroundColor={Colors.black} barStyle="light-content" />
//             <RootNavigator
//                 ref={nav => {this.navigator = nav}}
//                 screenProps={{notificationCount}}
//             />
//             {/* <FlashMessage position="top" /> */}
//             {/* <App/> */}
//         </View>
//         );
//     }
// }

// AppRegistry.registerComponent(appName, () => MyApp);
   
