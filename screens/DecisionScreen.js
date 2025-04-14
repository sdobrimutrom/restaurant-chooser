import React from "react";
import CustomButton from "@/components/CustomButton";
import {
    Alert,
    BackHandler,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Checkbox from "expo-checkbox";
import { GluestackUIProvider } from "@gluestack-ui/themed-native-base";

const styles = StyleSheet.create({
    decisionTimeScreenContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    decisionTimeScreenTouchable: {
        alignItems: "center",
        justifyContent: "center",
    },
    listScreenContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "ios" ? Constants.statusBarHeight : 0,
    },
    whosGoingHeadline: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
    },
    whosGoingItemTouchable: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,
    },
    whosGoingCheckbox: {
        marginRight: 20,
    },
    whosGoingName: {
        flex: 1,
    },
    preFiltersContainer: {
        marginTop: Constants.statusBarHeight,
    },
    preFiltersInnerContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
        width: "100%",
    },
    preFiltersScreenFormContainer: {
        width: "96%",
    },
    preFiltersHeadlineContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    preFiltersHeadline: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
      },
      fieldLabel: {
        marginLeft: 10,
      },
      pickerContainer: {
        borderRadius: 8,
        borderColor: "#c0c0c0",
        borderWidth: 2,
        width: "96%",
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 4,
      },
      picker: {
        width: "96%",
      },
      selectedContainer: {
        flex: 1,
        justifyContent: "center",
      },
      selectedInnerContainer: {
        alignItems: "center",
      },
      selectedName: {
        fontSize: 32,
      },
      selectedDetails: {
        paddingTop: 80,
        paddingBottom: 80,
        alignItems: "center",
      },
      selectedDetailsLine: {
        fontSize: 18,
      },
      vetoContainer: {
        flex: 1,
        justifyContent: "center",
      },
      vetoContainerInner: {
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      },
      vetoHeadlineContainer: {
        paddingBottom: 40,
      },
      vetoHeadline: {
        fontSize: 32,
        fontWeight: "bold",
      },
      vetoScrollViewContainer: {
        height: "50%",
      },
      vetoParticipantContainer: {
        paddingTop: 20,
        paddingBottom: 20,
      },
      vetoParticipantName: {
        fontSize: 24,
      },
      vetoButtonContainer: {
        width: "100%",
        alignItems: "center",
        paddingTop: 40,
      },
      choiceScreenHeadline: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 20,
      },
      choiceScreenListContainer: {
        width: "94%",
      },
      choiceScreenListItem: {
        flexDirection: "row",
        marginTop: 4,
        marginBottom: 4,
        borderColor: "#e0e0e0",
        borderBottomWidth: 2,
        alignItems: "center",
      },
      choiceScreenListItemName: {
        flex: 1,
      },
      postChoiceScreenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      },
      postChoiceHeadline: {
        fontSize: 32,
        paddingBottom: 80,
      },
      postChoiceDetailsContainer: {
        borderWidth: 2,
        borderColor: "#000000",
        padding: 10,
        width: "96%",
      },
      postChoiceDetailsRowContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignContent: "flex-start",
      },
      postChoiceDetailsLabel: {
        width: 70,
        fontWeight: "bold",
        color: "#ff0000",
      },
      postChoiceDetailsValue: {
        width: 300,
      },        
});

const getRandom = (inMin, inMax) => {
    inMin = Math.ceil(inMin);
    inMax = Math.ceil(inMax);
    return Math.floor(Math.random() * (inMax - inMin + 1)) + inMin;
};

class DecisionTimeScreen extends React.Component {
    render() {
        return(
            <View style = {styles.decisionTimeScreenContainer}>
                <TouchableOpacity
                    style = {styles.decisionTimeScreenTouchable}
                    onPress = {async () => {
                        try {
                            const people = await AsyncStorage.getItem("people");
                            const restaurants = await AsyncStorage.getItem("restaurants");

                            if (!people || JSON.parse(people).length === 0) {
                                Alert.alert(
                                    "That ain't gonna work, chief",
                                    "You haven't added any people. You should probably do that first, no?",
                                    [{ text: "OK" }],
                                    { cancelable: false }
                                );
                            } else if (!restaurants || JSON.parse(restaurants).length === 0) {
                                Alert.alert(
                                    "That ain't gonna work, chief",
                                    "You haven't added any restaurants. You should probably do that first, no?",
                                    [{ text: "OK" }],
                                    { cancelable: false }
                                );
                            } else {
                                this.props.navigation.navigate("WhosGoingScreen");
                            }
                        } catch (error) {
                            console.error("Failed to load data: ", error);
                        }
                    }}
                    >
                        <Image source={require("../assets/its-decision-time.android.png")}/>
                        <Text style = {{ paddingTop: 20 }}>(click the food to get going)</Text>
                    </TouchableOpacity>
            </View>
        );
    }
}

class WhosGoingScreen extends React.Component {
    constructor(inProps) {
        super(inProps);
        this.state = {
            people: [],
            selected: {},
            error: null,
        };
    }

    async componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);

        try {
            const people = await AsyncStorage.getItem("people");
            const parsedPeople = people ? JSON.parse(people) : [];
            const selected = {};

            parsedPeople.forEach((person) => {
                if (person && person.key) {
                    selected[person.key] = false;
                }
            });

            this.setState({ people: parsedPeople, selected });
        } catch (error) {
            console.error("Failed to load people: ", error);
            this.setState({ error: "Failed to load people. Please try again later." });
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    }

    render() {
        if (this.state.error) {
            return(
                <View style = {styles.listScreenContainer}>
                    <Text style = {styles.errorText}>{this.state.error}</Text>
                </View>
            );
        }

        return(
            <GluestackUIProvider>
                <View style = {styles.listScreenContainer}>
                    <Text style = {styles.whosGoingHeadline}>Who's Going?</Text>

                    <FlatList
                        style = {{ width: "94%" }}
                        data = {this.state.people.filter(item => item)}
                        keyExtractor={(item) => item?.key || Math.random().toString()}
                        renderItem={({ item }) => {
                            if (!item || !item.key) return null;

                            return (
                                <TouchableOpacity
                                    style = {styles.whosGoingItemTouchable}
                                    onPress={() => this.handlePersonSelect(item.key)}
                                >
                                    <Checkbox
                                        style = {styles.whosGoingCheckbox}
                                        value = {this.state.selected[item.key] || false}
                                        onValueChange={() => this.handlePersonSelect(item.key)}
                                    />
                                    <Text style = {styles.whosGoingName}>
                                        {item.firstName} {item.lastName} ({item.relationship})
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                    <CustomButton
                        text = "Next"
                        width = "94%"
                        onPress = {this.handleNext}
                    /> 
                </View>
            </GluestackUIProvider>
        );
    }

    handleBackButton = () => {
        return true;
    };

    handlePersonSelect = (key) => {
        const selected = { ...this.state.selected };
        selected[key] = !selected[key];
        this.setState({ selected });
    };

    handleNext = () => {
        const selectedParticipants = this.state.people
            .filter((person) => person && person.key && this.state.selected[person.key])
            .map((person) => ({ ...person, vetoed: "no" }));

        if (selectedParticipants.length === 0) {
            Alert.alert(
                "Uhh, you awake?",
                "You didn't select anyone to go. Wanna give it another try?",
                [{ text: "OK "}],
                { cancelable: false }
            );
        } else {
            this.props.navigation.navigate("PreFiltersScreen", { participants: selectedParticipants });
        }
    };
}

class PreFiltersScreen extends React.Component {
    constructor(inProps) {
        super(inProps);
        this.state = {
            cuisine: "",
            price: "",
            rating: "",
            delivery: "",
            error: null,
        };
    }

    render() {
        if (this.state.error) {
            return (
                <View style = {styles.preFiltersContainer}>
                    <Text style = {styles.errorText}>{this.state.error}</Text>
                </View>
            );
        }

        return(
            <GluestackUIProvider>
                <ScrollView style = {styles.preFiltersContainer}>
                    <View style = {styles.preFiltersInnerContainer}>
                        <View style = {styles.preFiltersScreenFormContainer}>
                            <View style = {styles.preFiltersHeadlineContainer}>
                                <Text style = {styles.preFiltersHeadline}>Pre-filters</Text>
                            </View>

                            <Text style = {styles.fieldLabel}>Cuisine</Text>
                            <View style = {styles.pickerContainer}>
                                <Picker
                                    style = {styles.picker}
                                    selectedValue={this.state.cuisine}
                                    onValueChange={(itemValue) => this.setState({ cuisine: itemValue })}
                                >
                                    <Picker.Item label = "" value = ""/>
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
                                    <Picker.Item label = "Other" value = "Other"/>
                                </Picker>
                            </View>

                            <Text style = {styles.fieldLabel}>Price &lt;=</Text>
                            <View style ={styles.pickerContainer}>
                                <Picker
                                    style = {styles.picker}
                                    selectedValue={this.state.price}
                                    onValueChange={(itemValue) => this.setState({ price: itemValue })}
                                >
                                    <Picker.Item label = "" value = ""/>
                                    <Picker.Item label = "1" value = "1"/>
                                    <Picker.Item label = "2" value = "2"/>
                                    <Picker.Item label = "3" value = "3"/>
                                    <Picker.Item label = "4" value = "4"/>
                                    <Picker.Item label = "5" value = "5"/>
                                </Picker>
                            </View>

                            <Text style = {styles.fieldLabel}>Rating &gt;=</Text>
                            <View style = {styles.pickerContainer}>
                                <Picker
                                    style = {styles.picker}
                                    selectedValue={this.state.rating}
                                    onValueChange={(itemValue) => this.setState({ rating: itemValue })}
                                >
                                    <Picker.Item label = "" value = ""/>
                                    <Picker.Item label = "1" value = "1"/>
                                    <Picker.Item label = "2" value = "2"/>
                                    <Picker.Item label = "3" value = "3"/>
                                    <Picker.Item label = "4" value = "4"/>
                                    <Picker.Item label = "5" value = "5"/>
                                </Picker>
                            </View>

                            <Text style = {styles.fieldLabel}>Delivery?</Text>
                            <View style = {styles.pickerContainer}>
                                <Picker
                                    style = {styles.picker}
                                    selectedValue={this.state.delivery}
                                    onValueChange={(itemValue) => this.setState({ delivery: itemValue })}
                                >
                                    <Picker.Item label = "" value = ""/>
                                    <Picker.Item label = "Yes" value = "Yes"/>
                                    <Picker.Item label = "No" value = "No"/>
                                </Picker>
                            </View>

                            <CustomButton
                                text = "Next"
                                width = "94%"
                                onPress = { this.handleFilterRestaurants }
                            />
                        </View>
                    </View>
                </ScrollView>
            </GluestackUIProvider>
        );
    }

    handleFilterRestaurants = async () => {
        try {
            const restaurants = await AsyncStorage.getItem("restaurants");
            const parsedRestaurants = restaurants ? JSON.parse(restaurants) : [];
    
            const { cuisine, price, rating, delivery } = this.state;
            const filteredRestaurants = parsedRestaurants.filter((restaurant) => {
                return (
                    (cuisine === "" || restaurant.cuisine === cuisine) &&
                    (price === "" || restaurant.price <= price) &&
                    (rating === "" || restaurant.rating >= rating) &&
                    (delivery === "" || restaurant.delivery === delivery)
                );
            });
    
            if (filteredRestaurants.length === 0) {
                Alert.alert(
                    "Well, that's and easy choice",
                    "None of your restaurants match these criteria. Maybe try loosening them up a bit?",
                    [{ text: "OK" }],
                    { cancelable: false }
                );
            } else {
                this.props.navigation.navigate("ChoiseScreen", {
                    participants: this.props.route.params.participants,
                    filteredRestaurants,
                });
            }
        } catch (error) {
            console.error("Failed to filter restaurants: ", error);
            this.setState({ error: "Failed to filter restaurants. Please try again later." });
        }
    }
}

class ChoiseScreen extends React.Component {
    constructor(inProps) {
        super(inProps);
        const participants = (inProps.route.params.participants || []).map(p => ({ ...p }));
        const anyVetoLeft = participants.some(p => p.vetoed === "no");

        this.state = {
            participantsList: participants,
            filteredRestaurants: inProps.route.params.filteredRestaurants || [],
            selectedVisible: false,
            vetoVisible: false,
            vetoDisabled: !anyVetoLeft,
            vetoText: anyVetoLeft ? "Veto" : "No Vetoes Left",
            chosenRestaurant: null,
        };
    }

    render() {
        const { participantsList, filteredRestaurants, chosenRestaurant } = this.state;

        return (
            <GluestackUIProvider>
                <View style={styles.listScreenContainer}>
                    <Modal visible={this.state.selectedVisible} animationType="slide">
                        {chosenRestaurant ? (
                            <View style={styles.selectedContainer}>
                                <View style={styles.selectedInnerContainer}>
                                    <Text style={styles.selectedName}>{chosenRestaurant.name}</Text>
                                    <View style={styles.selectedDetails}>
                                        <Text style={styles.selectedDetailsLine}>
                                            {chosenRestaurant.cuisine} restaurant
                                        </Text>
                                        <Text style={styles.selectedDetailsLine}>
                                            With a price rating of {"$".repeat(chosenRestaurant.price || 0)}
                                        </Text>
                                        <Text style={styles.selectedDetailsLine}>
                                            that {chosenRestaurant.delivery === "Yes" ? "DOES" : "DOES NOT"} deliver.
                                        </Text>
                                    </View>
                                    <CustomButton
                                        text="Accept"
                                        width="94%"
                                        onPress={() => {
                                            this.setState({ selectedVisible: false, vetoVisible: false });
                                            this.props.navigation.navigate("PostChoiceScreen", {
                                                chosenRestaurant: chosenRestaurant,
                                            });
                                        }}
                                    />
                                    <CustomButton
                                        text={this.state.vetoText}
                                        width="94%"
                                        disabled={this.state.vetoDisabled ? "true" : "false"}
                                        onPress={() => {
                                            const vetoStillAvailable = this.state.participantsList.some(
                                                (p) => p && p.vetoed === "no"
                                            );

                                            if (vetoStillAvailable) {
                                                this.setState({
                                                    selectedVisible: false,
                                                    vetoVisible: true,
                                                    vetoText: "Veto",
                                                    vetoDisabled: false,
                                                });
                                            } else {
                                                this.setState({
                                                    vetoText: "No Vetoes Left",
                                                    vetoDisabled: true,
                                                });
                                                Alert.alert("No vetoes left", "All participants have already used their veto.");
                                            }
                                        }}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.selectedContainer}>
                                <Text>No restaurant selected</Text>
                            </View>
                        )}
                    </Modal>

                    <Modal visible={this.state.vetoVisible} animationType="slide">
                        <View style={styles.vetoContainer}>
                            <View style={styles.vetoContainerInner}>
                                <Text style={styles.vetoHeadline}>Who's vetoing?</Text>
                                <ScrollView style={styles.vetoScrollViewContainer}>
                                    {participantsList.map((participant) => {
                                        if (participant && participant.vetoed === "no") {
                                            return (
                                                <TouchableOpacity
                                                    key={participant.key}
                                                    style={styles.vetoParticipantContainer}
                                                    onPress={() => {
                                                        const updatedParticipants = participantsList.map(p =>
                                                            p.key === participant.key ? { ...p, vetoed: "yes" } : p
                                                        );

                                                        const updatedRestaurants = this.state.filteredRestaurants.filter(
                                                            (restaurant) =>
                                                                restaurant && restaurant.key !== this.state.chosenRestaurant?.key
                                                        );

                                                        const vetoStillAvailable = updatedParticipants.some(
                                                            (p) => p && p.vetoed === "no"
                                                        );

                                                        this.setState({
                                                            participantsList: updatedParticipants,
                                                            selectedVisible: false,
                                                            vetoVisible: false,
                                                            vetoText: vetoStillAvailable ? "Veto" : "No Vetoes Left",
                                                            vetoDisabled: !vetoStillAvailable,
                                                            filteredRestaurants: updatedRestaurants,
                                                        });

                                                        if (updatedRestaurants.length === 1) {
                                                            this.props.navigation.navigate("PostChoiceScreen", {
                                                                chosenRestaurant: updatedRestaurants[0],
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Text style={styles.vetoParticipantName}>
                                                        {participant.firstName} {participant.lastName}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }
                                        return null;
                                    })}
                                </ScrollView>
                                <View style={styles.vetoButtonContainer}>
                                    <CustomButton
                                        text="Never Mind"
                                        width="94%"
                                        onPress={() => {
                                            this.setState({ selectedVisible: true, vetoVisible: false });
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <FlatList
                        style={styles.choiceScreenListContainer}
                        data={participantsList.filter(item => item)}
                        keyExtractor={(item) => item?.key || Math.random().toString()}
                        renderItem={({ item }) => {
                            if (!item) return null;

                            return (
                                <View style={styles.choiceScreenListItem}>
                                    <Text style={styles.choiceScreenListItemName}>
                                        {item.firstName} {item.lastName} ({item.relationship})
                                    </Text>
                                    <Text>Vetoed: {item.vetoed || "no"}</Text>
                                </View>
                            );
                        }}
                    />

                    <CustomButton
                        text="Randomly Choose"
                        width="94%"
                        onPress={() => {
                            if (filteredRestaurants.length > 0) {
                                const selectedNumber = getRandom(0, filteredRestaurants.length - 1);
                                this.setState({
                                    chosenRestaurant: filteredRestaurants[selectedNumber],
                                    selectedVisible: true,
                                });
                            } else {
                                Alert.alert(
                                    "No restaurants available",
                                    "There are no restaurants to choose from. Please adjust your filters",
                                    [{ text: "OK" }]
                                );
                            }
                        }}
                    />
                </View>
            </GluestackUIProvider>
        );
    }
}

class PostChoiceScreen extends React.Component {
    render() {
        const { chosenRestaurant } = this.props.route.params;

        if (!chosenRestaurant) {
            return (
                <View style = {styles.postChoiceScreenContainer}>
                    <Text>No restaurant selected.</Text>
                </View>
            );
        }

        return (
            <GluestackUIProvider>
                <View style = {styles.postChoiceScreenContainer}>
                    <View>
                        <Text style = {styles.postChoiceHeadline}>Enjoy your meal!</Text>
                    </View>
                    <View style = {styles.postChoiceDetailsContainer}>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Name:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{chosenRestaurant.name}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Cuisine:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{chosenRestaurant.cuisine}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Price:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{"$".repeat(chosenRestaurant.price)}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Rating:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{"\u2605".repeat(chosenRestaurant.rating)}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Phone:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{chosenRestaurant.phone}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Address:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{chosenRestaurant.address}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Web Site:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{chosenRestaurant.webSite}</Text>
                        </View>
                        <View style = {styles.postChoiceDetailsRowContainer}>
                            <Text style = {styles.postChoiceDetailsLabel}>Delivery:</Text>
                            <Text style = {styles.postChoiceDetailsValue}>{chosenRestaurant.delivery}</Text>
                        </View>
                    </View>
                    <View style = {{ paddingTop: 80 }}>
                        <Button
                            title="All Done"
                            onPress={() => this.props.navigation.navigate("DecisionTimeScreen")}
                        />
                    </View>
                </View>
            </GluestackUIProvider>
        );
    }
}

const Stack = createStackNavigator();

const DecisionScreen = () => {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name = "DecisionTimeScreen" component={DecisionTimeScreen}/>
            <Stack.Screen name = "WhosGoingScreen" component={WhosGoingScreen}/>
            <Stack.Screen name = "PreFiltersScreen" component={PreFiltersScreen}/>
            <Stack.Screen name = "ChoiseScreen" component={ChoiseScreen}/>
            <Stack.Screen name = "PostChoiceScreen" component={PostChoiceScreen}/>
        </Stack.Navigator>
    );
};

export default DecisionScreen;