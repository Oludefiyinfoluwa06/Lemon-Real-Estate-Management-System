import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';

const Dashboard = () => {
    const { logout } = useAuth();
    
    return (
        <View>
            <Text>Dashboard</Text>
            <TouchableOpacity onPress={async () => await logout()}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

export default Dashboard;