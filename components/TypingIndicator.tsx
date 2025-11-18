import { View } from "react-native";

export const TypingIndicator = () => {
  return (
    <View className="flex items-start mb-4 px-4">
      <View className="bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
        <View className="flex-row gap-2">
          <View className="w-2 h-2 bg-gray-400 rounded-full" />
          <View className="w-2 h-2 bg-gray-400 rounded-full" />
          <View className="w-2 h-2 bg-gray-400 rounded-full" />
        </View>
      </View>
    </View>
  );
};