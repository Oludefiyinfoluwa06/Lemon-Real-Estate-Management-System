import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../contexts/AuthContext';

const Dashboard = () => {
    const { logout } = useAuth();
    
    return (
        <SafeAreaView>
            <Text>Welcome</Text>
            <TouchableOpacity onPress={async () => await logout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Dashboard;