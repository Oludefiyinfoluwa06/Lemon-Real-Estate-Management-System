import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const ErrorOrMessageModal = ({ visible, modalType, onClose, text }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View className='bg-transparentBlack absolute top-0 left-0 h-screen w-full flex-1'>
                <View className={`flex-row items-center justify-between ${modalType === 'error' ? 'bg-bgError' : 'bg-bgSuccess'} w-full py-2 px-4 absolute top-0 left-0 rounded-b-xl`}>
                    <Text className={`font-rbold ${modalType === 'error' ? 'text-textError' : 'text-textSuccess'} flex-1`}>{text}</Text>

                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name='close-outline' size={30} color={modalType === 'error' ? '#721c24' : '#173a28'} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default ErrorOrMessageModal;