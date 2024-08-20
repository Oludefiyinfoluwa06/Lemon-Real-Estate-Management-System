import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as NavigationBar from 'expo-navigation-bar';

const TabIcon = ({ icon, focused }) => (
    <View className={`${focused ? 'bg-[#212A2B]' : ''} items-center justify-center w-[50px] h-[50px] rounded-full`}>
        <Ionicons name={icon} size={focused ? 23 : 20} color={focused ? '#BBCC13' : '#FFFFFF'} />
    </View>
);

const TabLayout = () => {
    NavigationBar.setBackgroundColorAsync("#2B3B3C");

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#191641',
                tabBarInactiveTintColor: '#808080',
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: -0.3,
                    left: 0,
                    height: 60,
                    paddingVertical: 5,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    backgroundColor: '#2B3B3C'
                }
            }}
        >
            <Tabs.Screen
                name='dashboard'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={'grid-outline'}
                            color={color}
                            focused={focused}
                            name='Dashboard'
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='properties'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={'key-outline'}
                            color={color}
                            focused={focused}
                            name='Properties'
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='analytics'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={'stats-chart-outline'}
                            color={color}
                            focused={focused}
                            name='Analytics'
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='wallet'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={'wallet-outline'}
                            color={color}
                            focused={focused}
                            name='Wallet'
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

export default TabLayout;