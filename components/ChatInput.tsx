import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputProps {
  inputText: string;
  isLoading: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ inputText, isLoading, onChangeText, onSend }: ChatInputProps) => {
  return (
    <View className="bg-black border-t border-gray-300 px-4 py-4">
      <View className="flex-row items-end gap-2">
        <View className="flex-1 bg-gray-300 rounded-2xl px-4 py-2 min-h-[48px] justify-center">
          <TextInput
            value={inputText}
            onChangeText={onChangeText}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#404040"
            multiline
            editable={!isLoading}
            className="text-[#404040] text-sm max-h-32"
            onSubmitEditing={onSend}
          />
        </View>
        <TouchableOpacity
          onPress={onSend}
          disabled={!inputText.trim() || isLoading}
          className={`w-12 h-12 rounded-full items-center justify-center ${!inputText.trim() || isLoading ? 'bg-gray-600' : 'bg-blue-500'}`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg">➤</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-center text-gray-500 text-xs mt-2">
        Recuerda que MFM se puede equivocar. Verifica tus respuestas
      </Text>
    </View>
  );
};