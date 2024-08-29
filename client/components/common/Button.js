import { Text, TouchableOpacity } from 'react-native';

const Button = ({ type, text, bg, onPress }) => {
    return (
        <TouchableOpacity
            className={`${bg ? 'bg-chartreuse' : 'bg-frenchGray-dark'} p-4 rounded-lg flex-1 ${type === 'user' ? 'ml-2' : ''} my-1`}
            onPress={onPress}
        >
            <Text className={`${bg ? 'text-darkUmber-dark' : 'text-chartreuse'} text-center font-rsemibold`}>{text}</Text>
        </TouchableOpacity>
    );
}

export default Button;