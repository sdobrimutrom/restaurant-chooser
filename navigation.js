import React from "react";
import { Image, Platform } from 'react-native';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PeopleScreen from './screens/PeopleScreen';
import DecisionScreen  from './screens/DecisionScreen';
import RestaurantsScreen from './screens/RestaurantsScreen';
import Constants from "expo-constants";

const platformOS = Platform.OS.toLowerCase();

const Tab = createMaterialTopTabNavigator();

export const Navigation = () => {
    return(
        <Tab.Navigator
            initialRouteName="DecisionScreen"
            screenOptions={{
                animationEnabled: true,
                swipeEnabled: true,
                tabBarPosition: platformOS === 'android' ? 'top' : 'bottom',
                tabBarActiveTintColor: '#ff0000',
                tabBarShowIcon: true,
                tabBarStyle: {
                    paddingTop: platformOS === 'android' ? Constants.statusBarHeight : 0,
                },
            }}
        >
            <Tab.Screen
                name = 'PeopleScreen'
                component={PeopleScreen}
                options = {{
                    tabBarLabel: 'People',
                    tabBarIcon: ({color}) => (
                        <Image
                            source={require("./assets/icon-people.png")}
                            style={{ width: 32, height: 32, tintColor: color }}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name = 'DecisionScreen'
                component={DecisionScreen}
                options = {{
                    tabBarLabel: 'Decision',
                    tabBarIcon: ({color}) => (
                        <Image
                            source={require("./assets/icon-decision.png")}
                            style={{ width: 32, height: 32, tintColor: color }}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name = 'RestaurantsScreen'
                component={RestaurantsScreen}
                options = {{
                    tabBarLabel: 'Restaurants',
                    tabBarIcon: ({color}) => (
                        <Image
                            source={require("./assets/icon-restaurants.png")}
                            style={{ width: 32, height: 32, tintColor: color }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};