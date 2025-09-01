import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onFilterPress,
  placeholder = "Search properties...",
}) => {
  return (
    <View className="flex-row items-center bg-frenchGray-dark rounded-lg px-2 mb-4">
      <Ionicons name="search" size={20} color="#AFAFAF" />
      <TextInput
        className="flex-1 py-2 px-2 text-white font-rregular"
        placeholder={placeholder}
        placeholderTextColor="#AFAFAF"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text.length === 0) onSearch(""); // Clear results when empty
        }}
        onSubmitEditing={() => onSearch(searchQuery)}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={onFilterPress}>
        <Ionicons name="options-outline" size={20} color="#BBCC13" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
