import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabIcon = ({ icon, focused }) => (
    <View className={`${focused ? 'bg-[#212A2B]' : ''} items-center justify-center w-[50px] h-[50px] rounded-full`}>
        <Ionicons name={icon} size={focused ? 23 : 20} color={focused ? '#BBCC13' : '#FFFFFF'} />
    </View>
);

const TabLayout = () => {    
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
                name='home'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={'home-outline'}
                            color={color}
                            focused={focused}
                            name='Home'
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='search'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={'search-outline'}
                            focused={focused}
                            name='Search'
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
            <Tabs.Screen
                name='chats'
                options={{ 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon
                            icon={'chatbubbles-outline'}
                            color={color}
                            focused={focused}
                            name='Chats'
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

export default TabLayout;