import React from "react";
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import {
    Alert,
    BackHandler,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Platform,
} from 'react-native';
import { Picker }  from "@react-native-picker/picker";
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import { GluestackUIProvider  } from "@gluestack-ui/themed-native-base";
import Toast from "react-native-toast-message";


class ListScreen extends React.Component {
    constructor(inProps) {
        super(inProps);
        this.state = { listData : [ ] };
    };

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => true);

        this.loadRestaurants();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    loadRestaurants = async () => {
        try {
            const restaurants = await AsyncStorage.getItem('restaurants');
            const listData = restaurants ? JSON.parse(restaurants) : [];
            this.setState({ listData });
        } catch (error) {
            console.error('Failed to load restaurants: ', error);
        }
    };

    deleteRestaurant = async (item) => {
        try {
            const restaurants = await AsyncStorage.getItem('restaurants');
            let listData = restaurants ? JSON.parse(restaurants) : [];
            listData = listData.filter((restaurant) => restaurant.key !== item.key);
            await AsyncStorage.setItem("restaurants", JSON.stringify(listData));
            this.setState({ listData });

            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Restaurant Deleted',
                visibilityTime: 2000,
            });
        } catch (error) {
            console.error('Failed to delete restaurant', error);
        }
    };

    render() {
        return(
            <GluestackUIProvider>
                <View style = {styles.listScreenContainer}>
                    <CustomButton
                        text = 'Add Restaurant'
                        width = '94%'
                        onPress = {() => this.props.navigation.navigate('AddScreen')}
                    />
                    <FlatList
                        style = {styles.restaurantList}
                        data = {this.state.listData}
                        keyExtractor={(item) => item.key}
                        renderItem={({item}) => (
                            <View style = {styles.restaurantContainter}>
                                <Text style = {styles.restaurantName}>{item.name}</Text>
                                <CustomButton
                                    text = 'Delete'
                                    onPress = {() =>
                                        Alert.alert(
                                            "Please Confirm",
                                            'Are you sure you want to delete this restaurant?',
                                            [
                                                { text : 'Yes', onPress: () => this.deleteRestaurant(item) },
                                                { text : 'No' },
                                                { text : 'Cancel', style: 'cancel' },
                                            ],
                                            { cancelable : true }
                                        )
                                    }
                                />
                            </View>
                        )}    
                    />
                </View>
            </GluestackUIProvider>
    ); }
}

class AddScreen extends React.Component {
    constructor(inProps) {
        super(inProps);
        this.state = { name : '', cuisine : '', price : '', rating : '',
            phone : '', address : '', webSite : '', delivery : '',
            key : `r_${new Date().getTime()}`, errors : { }
        };
    }

    validateName = (name) => {
        if (!name.trim()) {
            return "Restaurant name is required";
        }
        if (name.length < 2) {
            return "Name must be at least 2 characters";
        }
        if (!/^[a-zA-Z0-9\s,'-]*$/.test(name)) {
            return "Name contains invalid characters";
        }
        return null;
    };

    validatePhone = (phone) => {
        if (!phone.trim()) {
            return "Phone number is required";
        }
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

        if (!phoneRegex.test(phone)) {
            return "Please enter a valid phone number";
        }
        return null;
    };

    validateAddress = (address) => {
        if (!address.trim()) {
            return "Address is required";
        }

        if (!/\d+/.test(address) || !/[a-zA-Z]/.test(address)) {
            return "Please enter a valid address (should include street number and name)";
        }

        if (address.length < 5) {
            return "Address is to short";
        }

        return null;
    };

    validateWebsite = (webSite) => {
        if (!webSite.trim()) {
            return "Website is required";
        }
        try {
            const urlRegex = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

            if (!urlRegex.test()) {
                return "Please enter a valid website URL (e.g https://example.com)";
            }

            if (!webSite.startsWith('http://') && !webSite.startsWith('https://')) {
                return "URL must start with http:// or https://";
            }
        } catch (e) {
            return "Please enter a valid website URl";
        }
        return null;
    };

    handleInputChange = (field, value) => {
        this.setState(prevState => ({
            [field] : value,
            errors : {
                ...prevState.errors,
                [field] : null
            }
        }));
    };

    validateAllFields = () => {
        const { name, phone, address, webSite, cuisine, price, rating, delivery } = this.state;
        
        const errors = {
            name: this.validateName(name),
            phone: this.validatePhone(phone),
            address: this.validateAddress(address),
            webSite: this.validateWebsite(webSite),
            cuisine: !cuisine ? "Cuisine is required" : null,
            price: !price ? "Price is required" : null,
            rating: !rating ? "Rating is required" : null,
            delivery: !delivery ? "Delivery is required" : null,
        };

        this.setState({ errors });
        return !Object.values(errors).some(error => error !== null);
    };

    saveRestaurant = async () => {
        if (!this.validateAllFields()) {
            const firstErrorField = Object.keys(this.state.errors).find(
                key => this.state.errors[key]
            );
            if (firstErrorField) {
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Validation Error',
                    text2: this.state.errors[firstErrorField],
                    visibilityTime: 3000,
                });
            }
            return;
        }

        try {
            const restaurants = await AsyncStorage.getItem('restaurants');
            const listData = restaurants ? JSON.parse(restaurants) : [];
            listData.push(this.state);
            await AsyncStorage.setItem("restaurants", JSON.stringify(listData));

            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Restaurant saved successfully',
                visibilityTime: 2000,
            });

            this.props.navigation.navigate("ListScreen");
        } catch (error) {
            console.error('Failed to save restaurant', error);
            
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Error saving restaurant',
                text2: 'Please try again',
                visibilityTime: 3000,
            });
        }

    };

    render() {
        const { errors } = this.state; 
        return (
        <ScrollView style = {styles.addScreenContainer}>
            <View style = {styles.addScreenInnerContainer}>
                <View style = {styles.addScreenFormContainer}>
                    <CustomTextInput
                        label = 'name'
                        maxLength = {50}
                        stateHolder = {this}
                        stateFieldName = 'name'
                        onChangeText = {(text) => this.handleInputChange('name', text)}
                        error = { errors.name }
                    />
                    <Text style = {styles.fieldLabel}>Cuisine</Text>
                    <View style = {[
                        styles.pickerContainer,
                        errors.cuisine ? {borderColor : 'red'} : {}
                        ]}>
                        <Picker
                            style = {styles.picker}
                            selectedValue = {this.state.cuisine}
                            onValueChange = {
                                (inItemValue) => this.handleInputChange('cuisine', inItemValue)
                            }
                        >
                            <Picker.Item label="Select a cuisine..." value="" />
                                <Picker.Item label="Algerian" value="Algerian" />
                                <Picker.Item label="American" value="American" />
                                <Picker.Item label="BBQ" value="BBQ" />
                                <Picker.Item label="Belgian" value="Belgian" />
                                <Picker.Item label="Brazilian" value="Brazilian" />
                                <Picker.Item label="British" value="British" />
                                <Picker.Item label="Cajun" value="Cajun" />
                                <Picker.Item label="Canadian" value="Canadian" />
                                <Picker.Item label="Chinese" value="Chinese" />
                                <Picker.Item label="Cuban" value="Cuban" />
                                <Picker.Item label="Egyptian" value="Egyptian" />
                                <Picker.Item label="Filipino" value="Filipino" />
                                <Picker.Item label="French" value="French" />
                                <Picker.Item label="German" value="German" />
                                <Picker.Item label="Greek" value="Greek" />
                                <Picker.Item label="Haitian" value="Haitian" />
                                <Picker.Item label="Hawaiian" value="Hawaiian" />
                                <Picker.Item label="Indian" value="Indian" />
                                <Picker.Item label="Irish" value="Irish" />
                                <Picker.Item label="Italian" value="Italian" />
                                <Picker.Item label="Japanese" value="Japanese" />
                                <Picker.Item label="Jewish" value="Jewish" />
                                <Picker.Item label="Kenyan" value="Kenyan" />
                                <Picker.Item label="Korean" value="Korean" />
                                <Picker.Item label="Latvian" value="Latvian" />
                                <Picker.Item label="Libyan" value="Libyan" />
                                <Picker.Item label="Mediterranean" value="Mediterranean" />
                                <Picker.Item label="Mexican" value="Mexican" />
                                <Picker.Item label="Mormon" value="Mormon" />
                                <Picker.Item label="Nigerian" value="Nigerian" />
                                <Picker.Item label="Other" value="Other" />
                                <Picker.Item label="Peruvian" value="Peruvian" />
                                <Picker.Item label="Polish" value="Polish" />
                                <Picker.Item label="Portuguese" value="Portuguese" />
                                <Picker.Item label="Russian" value="Russian" />
                                <Picker.Item label="Salvadorian" value="Salvadorian" />
                                <Picker.Item label="Sandwiche Shop" value="Sandwiche Shop" />
                                <Picker.Item label="Scottish" value="Scottish" />
                                <Picker.Item label="Seafood" value="Seafood" />
                                <Picker.Item label="Spanish" value="Spanish" />
                                <Picker.Item label="Steak House" value="Steak House" />
                                <Picker.Item label="Sushi" value="Sushi" />
                                <Picker.Item label="Swedish" value="Swedish" />
                                <Picker.Item label="Tahitian" value="Tahitian" />
                                <Picker.Item label="Thai" value="Thai" />
                                <Picker.Item label="Tibetan" value="Tibetan" />
                                <Picker.Item label="Turkish" value="Turkish" />
                                <Picker.Item label="Welsh" value="Welsh" />
                        </Picker>
                    </View>
                        {errors.cuisine && (
                            <Text style = {{ color: 'red', marginLeft: 10, marginBottom: 10}}>
                                {errors.cuisine}
                            </Text>
                        )}

                    <Text style = {styles.fieldLabel}>Price</Text>
                    <View style = {[
                        styles.pickerContainer,
                        errors.price ? {borderColor: 'red'} : {}
                    ]}>
                        <Picker
                            style = {styles.picker}
                            selectedValue = {this.state.price}
                            onValueChange = {
                                (inItemValue) => this.handleInputChange('price', inItemValue)
                            }
                        >
                            <Picker.Item label="Select price range..." value="" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>
                    {errors.price && (
                        <Text style = {{ color: 'red', marginLeft: 10, marginBottom: 10 }}>
                            {errors.price}
                        </Text>
                    )}

                    <Text style={styles.fieldLabel}>Rating</Text>
                        <View style = {(
                            styles.pickerContainer,
                            errors.rating ? {borderColor: 'red'} : {}
                        )}>
                        <Picker
                            style={styles.picker}
                            selectedValue={this.state.rating}
                            onValueChange={
                            (inItemValue) => this.handleInputChange('rating', inItemValue)
                            }
                        >
                            <Picker.Item label="Select a rating..." value="" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>
                    {errors.rating && (
                        <Text style = {{ color: 'red', marginLeft: 10, marginBottom: 10 }}>
                            {errors.rating}
                        </Text>
                    )}

                    <CustomTextInput
                        label = 'Phone Number'
                        maxLength = {20}
                        stateHolder = {this}
                        stateFieldName = 'phone'
                        onChangeText = {(text) => this.handleInputChange('phone', text)}
                        keyboardType = "phone-pad"
                        error = {errors.phone}
                    />
                    <CustomTextInput
                        label = 'Address'
                        maxLength = {20}
                        stateHolder = {this}
                        stateFieldName = 'address'
                        onChangeText = {(text) => this.handleInputChange('address', text)}
                        error = {errors.address}
                    />
                    <CustomTextInput
                        label = "Web Site"
                        maxLength = {20}
                        stateHolder = {this}
                        stateFieldName = 'webSite'
                        onChangeText = {(text) => this.handleInputChange('webSite', text)}
                        error = {errors.webSite}
                    />

                    <Text style = {styles.fieldLabel}>Delivery?</Text>
                    <View style = {[
                        styles.pickerContainer,
                        errors.delivery ? {borderColor : 'red'} : {}
                    ]}>
                        <Picker
                            style = {styles.picker}
                            selectedValue = {this.state.delivery}
                            onValueChange = {
                                (inItemValue) => this.handleInputChange('delivery', inItemValue)
                            }
                        >
                            <Picker.Item label="Select delivery option..." value="" />
                            <Picker.Item label="Yes" value="Yes" />
                            <Picker.Item label="No" value="No" />
                        </Picker>
                    </View>
                    {errors.delivery && (
                        <Text style = {{ color: 'red', marginLeft: 10, marginBottom: 10 }}>
                            {errors.delivery}
                        </Text>
                    )}
                </View>

                <View style = {styles.addScreenButtonsContainer}>
                    <CustomButton
                        text = 'Cancel'
                        width = '44%'
                        onPress = {
                            () => { this.props.navigation.navigate('ListScreen'); }
                        }
                    />
                    <CustomButton
                        text = 'Save'
                        width = '44%'
                        onPress = {this.saveRestaurant}
                    />
                </View>
            </View>
        </ScrollView>
    ); }
}

const Stack = createStackNavigator();

const RestaurantsScreen = () => {
    return(
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="ListScreen"
        >
            <Stack.Screen name="ListScreen" component={ListScreen}/>
            <Stack.Screen name="AddScreen" component={AddScreen}/>
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    listScreenContainer : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        ...Platform.select({
            ios : {
                paddingTop : Constants.statusBarHeight
            },
            android : { }
        })
    },

    restaurantList : {
        width : '94%'
    },

    restaurantContainter : {
        flexDirection : 'row',
        marginTop : 4,
        marginBottom : 4,
        borderColor : '#e0e0e0',
        borderBottomWidth : 2,
        alignItems : 'center'
    },

    restaurantName : {
        flex : 1
    },

    addScreenContainer : {
        marginTop : Constants.statusBarHeight
    },

    addScreenInnerContainer : {
        flex : 1,
        alignItems : 'center',
        paddingTop : 20,
        width : '100%'
    },

    addScreenFormContainer : {
        width : '96%'
    },

    fieldLabel : {
        marginLeft : 10
    },

    pickerContainer : {
        ...Platform.select({
            ios : { },
            android : {
                width : '96%',
                borderRadius : 8,
                borderColor : '#c0c0c0',
                borderWidth : 2,
                marginLeft : 10,
                marginBottom : 20,
                marginTop : 4
            }
        })
    },

    picker : {
        ...Platform.select({
            ios : {
                width : '96%',
                borderRadius : 8,
                borderColor : '#c0c0c0',
                borderWidth : 2,
                marginLeft : 10,
                marginBottom : 20,
                marginTop : 4
            },
            android : { }
        })
    },

    addScreenButtonsContainer : {
        flexDirection : 'row',
        justifyContent : 'center'
    }
});

export default RestaurantsScreen;