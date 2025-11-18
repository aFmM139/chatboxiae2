import { Text, View } from "react-native";

export const ChatHeader = () => {
  return (
    <View className="bg-black pt-12 pb-4 px-6 flex-row items-center justify-between">
      <Text className="text-white text-2xl font-bold">🤖 MFM MiniChat 🤖</Text>
      <Text className="text-white/80 text-sm mt-1">En línea💚</Text>
    </View>
  );
};