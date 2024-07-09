import React, { useEffect, useState, useRef, Fragment } from 'react'
import {
    Alert,
    View,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Keyboard,
    FlatList
} from 'react-native'
import * as ValidationUtils from "../utils/ValidationUtils";
import WebService from "../core/WebService";
import { Colors } from "../consts/Colors";
import * as Global from "../consts/Global";
import ProgressIndicator from "./ProgressIndicator";
import { Constants } from "../consts/Constants";
import { stylesGlobal } from '../consts/StyleSheet'
import Memory from '../core/Memory'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImageCompressor } from './ImageCompressorClass';
import CustomPopupView from "../customview/CustomPopupView";
import BannerView from "../customview/BannerView";
import AsyncStorage from '@react-native-community/async-storage';
import ModalDropdown from '../custom_components/react-native-modal-dropdown/ModalDropdown';
import { useNavigation } from '@react-navigation/native';

var TAG = "AddAlbumScreen";
let isNewAlbum = false;

export default function AddAlbumScreen ({route}) {

    const navigation = useNavigation();
    const inputRef = useRef();
    const [is_portrait, setIs_portrait] = useState(true);
    const [loading, setLoading] = useState(false);

    const [showModel, setShowModel] = useState(false);
    const [album_id, setAlbum_id] = useState("");
    const [valueEventTitle, setValueEventTitle] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [selected_category, setSelected_category] = useState(Global.selected_category);
    const [category_array, setCategory_array] = useState(Global.category_array_others);
    const [searchText, setSearchText] = useState("");
    const [addbutton_click, setAddbutton_click] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [userId, setUserId] = useState("");
    const [userToken, setUserToken] = useState("");
    const [userSlug, setUserSlug] = useState("");
    const [userImagePath, setUserImagePath] = useState("");
    const [userImageName, setUserImageName] = useState("");

    useEffect(() => {
        refreshProfileImage();
        if (Dimensions.get("window").width < Dimensions.get("window").height) {
            setIs_portrait(true);
        } else {
            setIs_portrait(false);
        }
        let layoutChangeDetector = Dimensions.addEventListener("change", () => {
            if (Dimensions.get("window").width < Dimensions.get("window").height) {
                setIs_portrait(true);
            } else {
                setIs_portrait(false);
            }
        })
        const getLocalData = async () =>{
            try {
                var userId = await AsyncStorage.getItem(Constants.KEY_USER_ID);
                var userToken = await AsyncStorage.getItem(Constants.KEY_USER_TOKEN);
                var userSlug = await AsyncStorage.getItem(Constants.KEY_USER_SLUG);
                setUserId(userId);
                setUserToken(userToken);
                setUserSlug(userSlug);
            } catch (error) {
                console.log("error: " + error)
            }
        }
        getLocalData().then(()=>{
            callGetAlbumAPI()
        })
      return () => {
        layoutChangeDetector.remove();
      }
    }, [])

    /**
     * display pre data of album in edit mode
     */
    const setData = (data) => {
        setAlbum_id(data.id);
        setValueEventTitle(data.album_name);
        setIsEdit(true);
        for (i = 0; i < category_array.length; i++) {
            if (category_array[i].value.toString() == data.visibility.toString()) {
                setSelected_category(i);
                break;
            }
        }
    }

    const clearData = () => {
        setValueEventTitle("");
        setIsEdit(false);
        setSelected_category(Global.selected_category);
    }

    const callGetAlbumAPI = async () => {
        try {
            setLoading(true);
            let uri = Memory().env == "LIVE" ? Global.URL_GET_ALBUM : Global.URL_GET_ALBUM_DEV
            let params = new FormData();
            params.append("token", userToken);
            params.append("user_id", userId);
            params.append("format", "json");
            WebService.callServicePost(
                uri,
                params,
                handleGetAlbumResponse
            );
        } catch (error) {
            setLoading(false);
            if (error != undefined && error != null && error.length > 0) {
                Alert.alert(error.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    };
    /**
     * Handle Get Schedule API
     */
    const handleGetAlbumResponse = (response, isError) => {
        setLoading(false);
        if (!isError) {
            var result = response;
            if (result != undefined && result != null) {
                if (result.data != undefined && result.data != null) {
                    if (result.data.albumList != undefined && result.data.albumList != null) {
                        let dataSourceTemp = result.data.albumList;
                        setDataSource(dataSourceTemp);
                        if(route.params.move2Album){
                            if(dataSourceTemp && dataSourceTemp.length > 0)
                            {
                                var senderItem = dataSourceTemp.filter((item, index) => (item.id == route.params.albumData.album_id));
                                if(senderItem.length > 0)
                                {
                                    navigation.navigate('ShowAlbumImage', {
                                        userId: userId,
                                        userToken: userToken,
                                        getDataAgain: callGetAlbumAPI,
                                        albumData: senderItem[0]
                                    })
                                }
                            }   
                        } else if(isNewAlbum){
                            isNewAlbum = false;
                            navigation.navigate('ShowAlbumImage', {
                                userId: userId,
                                userToken: userToken,
                                getDataAgain: callGetAlbumAPI,
                                albumData: dataSourceTemp[0],
                                openImagePicker: true,
                            })
                        }
                    }
                }
            }
        } else {
            if (response != undefined && response != null && response.length > 0) {
                Alert.alert(response.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    };

    /**
     * call Album API
     */
    const callAlbumAPI = async () => {
        if (ValidationUtils.isEmptyOrNull(valueEventTitle.trim())) {
            Alert.alert(Constants.EMPTY_ALBUM_NAME, "");
            return;
        }
        try {
            setLoading(true);
            let uri;
            if (isEdit) {
                uri = Memory().env == "LIVE" ? Global.URL_UPDATE_ALBUMS : Global.URL_UPDATE_ALBUMS_DEV;
            } else {
                uri = Memory().env == "LIVE" ? Global.URL_ADD_ALBUMS : Global.URL_ADD_ALBUMS_DEV
            }

            let params = new FormData();
            params.append("format", "json");
            params.append("user_id", userId);
            params.append("token", userToken);
            params.append("album_name", valueEventTitle.trim());
            params.append("visibility", category_array[selected_category].value);

            if (isEdit) {
                params.append("hdn_album_id", album_id);
            }
            WebService.callServicePost(uri, params, handleResponse);
        } catch (error) {
            setLoading(false);
            if (error != undefined && error != null && error.length > 0) {
                Alert.alert(error.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    };

    /**
     * handle redit or add album API response
     */
    const handleResponse = (response, isError) => {
        setLoading(false);
        if (!isError) {
            var result = response;
            if (result != undefined && result != null) {
                var dataSourceTemp = dataSource;
                clearData();
                setAddbutton_click(false);
                callGetAlbumAPI();
            }
        } else {
            if (response != undefined && response != null && response.length > 0) {
                Alert.alert(response.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    };

    const callDeleteAlbumAPI = async (album_id) => {
        try {
            setLoading(true);
            setAlbum_id(album_id);

            let uri = Memory().env == "LIVE" ? Global.URL_DELETE_ALBUMS : Global.URL_DELETE_ALBUMS_DEV
            let params = new FormData();
            params.append("token", userToken);
            params.append("user_id", userId);
            params.append("format", "json");
            params.append("album_id", album_id);
            WebService.callServicePost(
                uri,
                params,
                handleDeleteAlbumResponse
            );
        } catch (error) {
            setLoading(false);
            console.error(error);
            if (error != undefined && error != null && error.length > 0) {
                Alert.alert(error.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    };
    /**
     * Handle Delete Album API
     */
    const handleDeleteAlbumResponse = (response, isError) => {
        // setLoading(false);
        if (!isError) {
            var result = response;
            if (result != undefined && result != null) {
                callGetAlbumAPI();
            }
        } else {
            setLoading(false);
            if (response != undefined && response != null && response.length > 0) {
                Alert.alert(response.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    };

    const renderBannerView = () => {
        return (
            <BannerView
                screenProps={navigation}
            />
        )
    }

    const refreshProfileImage = async () => {
        try {
            var userImagePath = await AsyncStorage.getItem(Constants.KEY_USER_IMAGE_URL);
            var userImageName = await AsyncStorage.getItem(Constants.KEY_USER_IMAGE_NAME);
            setUserImageName(userImageName);
            setUserImagePath(userImagePath);
        } catch (error) {
            if (error != undefined && error != null && error.length > 0) {
                Alert.alert(error.replace(/<\/?[^>]+>/gi, '').replace(/\\n/g, '').replace(/\"/g, ""));
            }
        }
    }

    const hidePopupView = () => {
        setShowModel(false);
    }

    const logoutUser = async () => {
        hidePopupView()
        try {
            await AsyncStorage.setItem(Constants.KEY_USER_ID, "");
            await AsyncStorage.setItem(Constants.KEY_USER_TOKEN, "");
            navigation.navigate("SignInScreen", { isGettingData: false });
        } catch (error) {
            console.log(TAG + " logoutUser error " + error);
        }
    }

    const handleEditCompleteSearchText = () => {
        searchText = searchText.trim();
        setSearchText(searchText);
        if (searchText.length > 0) {
            navigation.navigate('Dashboard', { selected_screen: "members", search_text: searchText });
        }
    };

    const renderPopupView = () => {
        return (
            <CustomPopupView
                showModel={showModel}
                openMyAccountScreen={(show_myaccount, myaccount_initial_tab) => { navigation.navigate('Dashboard', { selected_screen: "myaccount", myaccount_initial_tab: myaccount_initial_tab }) }}
                logoutUser={logoutUser}
                closeDialog={() => { setShowModel(false)}}
                prop_navigation={navigation}
            >
            </CustomPopupView>
        );
    }

    /**
     * display top header view
     */
    const renderHeaderView = () => {
        let imageUrl = userImagePath + Constants.THUMB_FOLDER + userImageName;
        return (
            <View style={stylesGlobal.headerView}>
                <TouchableOpacity style={stylesGlobal.header_backbuttonview_style} onPress={() => { route.params.getDataAgain(); navigation.goBack(); }}>
                    <Image style={stylesGlobal.header_backbuttonicon_style} source={require("../icons/icon_back.png")} />
                </TouchableOpacity>
                <TouchableOpacity style={stylesGlobal.header_logoview_style} onPress={() => navigation.navigate('Dashboard', { logoclick: true })}>
                    <Image
                        style={stylesGlobal.header_logo_style}
                        source={require("../icons/logo_new.png")}
                    />
                </TouchableOpacity>
                <View style={stylesGlobal.header_searchview_style}>
                    <TextInput
                        ref = {inputRef}
                        autoCorrect={false}
                        underlineColorAndroid="transparent"
                        returnKeyType={"search"}
                        style={[stylesGlobal.header_searchtextview_style, stylesGlobal.font]}
                        onChangeText={searchText => setSearchText(searchText)}
                        value={searchText}
                        defaultValue=""
                        multiline={false}
                        autoCapitalize='sentences'
                        onSubmitEditing={handleEditCompleteSearchText}
                        keyboardType='ascii-capable'
                        placeholder="Search members..."
                    />
                    <TouchableOpacity style={stylesGlobal.header_searchiconview_style} onPress={() => {
                        if (searchText == "") {
                            inputRef.current.focus();
                        } else {
                            Keyboard.dismiss();
                            setSearchText("");
                        }
                    }}
                    >
                        {
                            searchText != "" &&
                            <Image
                                style={stylesGlobal.header_searchicon_style}
                                source={require("../icons/connection-delete.png")}
                            />
                        }
                        {
                            searchText == "" &&
                            <Image
                                style={stylesGlobal.header_searchicon_style}
                                source={require("../icons/dashboard_search.png")}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={stylesGlobal.header_avatarview_style} onPress={() => setShowModel(true)}>
                    <View style={stylesGlobal.header_avatarsubview_style}>
                        <ImageCompressor style={stylesGlobal.header_avatar_style} uri={imageUrl} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    /**
     * display edit or add album form view
     */
    const renderForm = () => {
        return (
            <View style={{ flex: 1 }}>
                {
                    !addbutton_click &&
                    <View style={{ width: '100%', alignItems: 'flex-end', marginTop: 10, marginBottom: 10, }}>
                        <TouchableOpacity style={[{ width: 80, height: 30, marginRight: 10, backgroundColor: Colors.gold, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }, stylesGlobal.shadow_style]}
                            onPress={() => {setAddbutton_click(true); isNewAlbum = true}}
                        >
                            <Text style={[stylesGlobal.font, { fontSize: 14, color: Colors.white }]}>{"Add"}</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    addbutton_click &&
                    <View style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                        <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row' }}>
                            <View style={[styles.headView, { flex: 1 }]}>
                                <Text style={[styles.headingText, stylesGlobal.font_bold]}><Text style={{ color: Colors.red }}>{"*"}</Text>{"Album name"}</Text>
                                <TextInput
                                    // ref='valueEventTitle'
                                    multiline={true}
                                    returnKeyType='default'
                                    numberOfLines={1}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize='sentences'
                                    onChangeText={value => {
                                        setValueEventTitle(value)
                                    }}
                                    value={valueEventTitle}
                                    style={[styles.textInputText, stylesGlobal.font, { flex: 1 }]}
                                    onSubmitEditing={(event) => {

                                    }}
                                    keyboardType='ascii-capable'
                                ></TextInput>
                            </View>
                            <View style={{ width: 80, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <ModalDropdown
                                    dropdownStyle={{ height: 35 * 5 + 5 * 6, paddingLeft: 5, paddingTop: 5, paddingRight: 5, backgroundColor: '#ffffff', borderRadius: 3, borderColor: '#000000', borderWidth: 1 }}
                                    defaultIndex={0}
                                    options={category_array}
                                    onSelect={(index) => {
                                        setSelected_category(index);
                                    }}
                                    renderButton={() => {
                                        return (
                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Image style={[styles.ageIcon, { width: 30, height: 30, resizeMode: 'contain' }]} source={category_array[selected_category].icon_path} />
                                                <Text style={[stylesGlobal.font, { fontSize: 11 }]}>{category_array[selected_category].label}</Text>
                                            </View>
                                        )
                                    }}
                                    renderRow={(item, index, highlighted) => {
                                        return (
                                            <View style={[styles.visibility_button, selected_category == index ? { backgroundColor: Colors.gold } : { backgroundColor: Colors.black }]}>
                                                <Image style={{ width: 20, height: 20, marginLeft: 8 }} resizeMode={'contain'} source={item.icon_path} />
                                                <Text style={[styles.visibility_text, stylesGlobal.font, { marginLeft: 5 }]}>{item.label}</Text>
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                        </View>
                        {renderBottomButton()}
                    </View>
                }
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ width: '100%', }}
                        columnWrapperStyle={{ width: '100%' }}
                        numColumns={is_portrait ? 3 : 5}
                        key={is_portrait ? 3 : 5}
                        keyExtractor={(item, index) => index.toString()}
                        data={dataSource}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ alignItems: 'center', justifyContent: 'center', width: is_portrait ? '33%' : '20%', aspectRatio: 1 }}>
                                    {renderAlbumItem(item)}
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
        );
    }

    /**
     * display bottom cancel and save buttons
     */
    const renderBottomButton = () => {
        let cancelButton = (<TouchableOpacity
            style={[styles.submitGold, { margin: 5 }, stylesGlobal.shadow_style]}
            underlayColor="#fff"
            onPress={() => {
                clearData();
                setAddbutton_click(false);
                isNewAlbum = false;
            }}
        >
            <Text style={[styles.submitTextWhite, stylesGlobal.font]}>Cancel</Text>
        </TouchableOpacity>);

        let saveButton = (<TouchableOpacity
            style={[styles.submitGold, { margin: 5 }, stylesGlobal.shadow_style]}
            underlayColor="#fff"
            onPress={() => {
                callAlbumAPI();
            }}
        >
            <Text style={[styles.submitTextWhite, stylesGlobal.font]}>Save</Text>
        </TouchableOpacity>);

        return (
            <View>
                <View style={{ alignItems: "center", flexDirection: 'row', justifyContent: 'center', margin: 40 }}>
                    {cancelButton}
                    {saveButton}
                </View>
            </View>
        );

    };

    /**
    *  display album row data
    */
    const renderAlbumItem = (data) => {
        var url = '';
        if (data.imgpath != null && data.filename != null) {
           // url = data.imgpath + Constants.THUMB_FOLDER + data.filename;
             url = data.imgpath + data.filename;
        }
        let current_icon_path = "";
        for (let i = 0; i < category_array.length; i++) {
            if (category_array[i].value == data.visibility) {
                // defaultIndex = i;
                current_icon_path = category_array[i].icon_path;
                break;
            }
        }

        return (
            <TouchableOpacity style={styles.containerRow} onPress={() => {
                navigation.navigate('ShowAlbumImage', {
                    userId: userId,
                    userToken: userToken,
                    getDataAgain: callGetAlbumAPI,
                    albumData: data
                })
            }}>
                <View style={styles.image}>
                    {
                        !url &&
                        <Image style={styles.image} resizeMode={"contain"} source={require("../icons/Background-Placeholder_Camera.png")} />
                    }

                    {
                        url &&
                        <ImageCompressor style={[styles.image, styles.thumnailImage]} uri={url} resizeMode={"cover"} default={require('../icons/Background-Placeholder_Camera.png')} />
                    }
                </View>
                <View style={{ width: '100%', position: 'absolute', bottom: 0, left: 0, marginLeft: 2}}>
                    <View style={styles.titleView}>
                        <Text style={[{ color: Colors.white }, stylesGlobal.font]} numberOfLines={1}>{data.album_name}</Text>
                    </View>
                    <View style={styles.viewRow}>
                        <ModalDropdown
                            style={styles.iconView}
                            dropdownStyle={{ height: 30 * 5 + 5 * 6, paddingLeft: 5, paddingTop: 5, paddingRight: 5, backgroundColor: '#ffffff', borderRadius: 3, borderColor: '#000000', borderWidth: 1 }}
                            defaultIndex={0}
                            options={category_array}
                            onSelect={(index) => {
                                var valueEventTitle = "";
                                var selected_category = 0;
                                var album_id = 0;
                                var dataSourceTemp = dataSource;
                                for (let i = 0; i < dataSourceTemp.length; i++) {
                                    if (dataSourceTemp[i].id == data.id) {
                                        valueEventTitle = dataSourceTemp[i].album_name;
                                        selected_category = index;
                                        album_id = dataSourceTemp[i].id;
                                        dataSourceTemp[i].visibility = category_array[index].value;
                                        break;
                                    }
                                }
                                setDataSource(dataSourceTemp);
                                setValueEventTitle(valueEventTitle);
                                setSelected_category(selected_category);
                                setAlbum_id(album_id);
                                setIsEdit(true);
                                callAlbumAPI()

                            }}
                            renderButton={() => {
                                return (
                                    <View style={styles.iconView}>
                                        <Image style={[styles.ageIcon, { width: 20, height: 20, resizeMode: 'contain' }]} source={current_icon_path} />
                                    </View>
                                )
                            }}
                            renderRow={(item, index, highlighted) => {
                                return (
                                    <View style={[styles.visibility_button, { width: 100, height: 30 }, data.visibility == category_array[index].value ? { backgroundColor: Colors.gold } : { backgroundColor: Colors.black }]}>
                                        <Image style={{ width: 20, height: 20, marginLeft: 8 }} resizeMode={'contain'} source={item.icon_path} />
                                        <Text style={[styles.visibility_text, stylesGlobal.font, { marginLeft: 5, fontSize: 10 }]}>{item.label}</Text>
                                    </View>
                                )
                            }}
                        />
                        <TouchableOpacity style={styles.iconView}
                            onPress={() => {
                                setData(data);
                                setAddbutton_click(true);
                            }}>
                            <Image style={[styles.ageIcon, { width: 20, height: 20, resizeMode: 'contain' }]} source={require("../icons/ic_edit.png")}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconView}
                            onPress={() => Alert.alert(Constants.DELETE_ALBUM_TITLE, Constants.DELETE_ALBUM_MESSAGE_PREFFIX + " '" + data.album_name + "' and all of its images?",
                                [{
                                    text: 'Yes', onPress: () => {
                                        callDeleteAlbumAPI(data.id)
                                    }
                                }
                                    , {
                                    text: 'No', onPress: () => {
                                    }
                                }],
                                { cancelable: false })}>
                            <Image style={[styles.ageIcon, { width: 20, height: 20 }]} resizeMode={"contain"} source={require("../icons/ic_delete.png")} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.black }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black }}>
                {renderHeaderView()}
                {renderBannerView()}
                {renderPopupView()}
                <View style={styles.card_view}>
                    <View style={{ alignItems: 'center', width: '100%', height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.card_titlecolor }}>
                        <Text style={[styles.headText, stylesGlobal.font]}>{"GALLERY"}</Text>
                    </View>
                    <KeyboardAwareScrollView style={{ flex: 1 }}
                        extraScrollHeight={20}
                        enableAutomaticScroll={true}
                        keyboardShouldPersistTaps = "handled"
                        keyboardDismissMode="on-drag">
                        {renderForm()}
                        {loading == true ? <ProgressIndicator /> : null}
                    </KeyboardAwareScrollView>
                </View>
            </SafeAreaView>
        </Fragment>
    );
}

const styles = {
    container: {
        flex: 1,
        padding: 10,
        width: '100%',
        height: '100%',
    },
    card_view: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: Colors.white,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        overflow: 'hidden'
    },
    textInputText: {
        color: Colors.black,
        marginTop: 3,
        padding: 5,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        textAlignVertical: "center",
        fontSize: 13,
        height: 40,
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 2,
    },
    headText: {
        color: Colors.gold,
        fontSize: 20,
    },
    headView: {
        marginTop: 9,
    },
    headingText: {
        color: Colors.black,
        fontSize: 14,
    },
    submitTextWhite: {
        color: Colors.white,
        textAlign: "center",
        fontSize: 14,
    },
    submitGold: {
        // padding: 10,
        // paddingHorizontal: 15,
        paddingVertical: 10,
        width: 120,
        backgroundColor: Colors.gold,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 0,
        marginBottom: 20
    },
    image: {
        width: '100%',
        height: '100%',
    },
    thumnailImage:{
        aspectRatio: 1/1,
        objectFit: 'cover',
        width: '100%'
    },
    iconView: {
        height: 30,
        width: 30,
        marginRight: 5,
        marginLeft: -5,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    containerRow: {
        width: '100%',
        aspectRatio: 1,
        padding: 2
    },
    titleView: {
        justifyContent: 'flex-start',
        backgroundColor: Colors.black,
        padding: 2,
        opacity: 0.80,
        width: '100%',
    },
    viewRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: Colors.black,
        // padding: 5,
        // marginLeft: 2,
        opacity: 0.80,
    },
    visibility_button: {
        width: 120,
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 3,
        borderColor: '#000000',
        borderWidth: 1,
        marginBottom: 5
    },
    visibility_text: {
        fontSize: 14,
        color: Colors.white
    },
}
