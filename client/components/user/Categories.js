import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const Categories = () => {
    const categories = ['Lands', 'Duplex', 'Bungalows', 'Shop Spaces', 'Mansions'];

    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    
    const toggleCategorySelection = (property) => {
        setSelectedCategory(property);
    };
    
    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={category}
                        className={`p-2 m-1 rounded-md ${index === 0 ? 'ml-4' : ''} ${index === categories.length - 1 ? 'mr-4' : ''} ${selectedCategory === category ? 'bg-chartreuse' : 'bg-frenchGray-light'}`}
                        onPress={() => toggleCategorySelection(category)}
                    >
                        <Text className={`text-center font-rbold text-lg ${selectedCategory === category ? 'text-frenchGray-light' : 'text-white'}`}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                
            </ScrollView>
        </View>
    );
}

export default Categories;