import React from "react";
import { Text, View } from "react-native";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <View className={`flex ${message.isUser ? 'items-end' : 'items-start'} mb-4 px-4`}>
      <View className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.isUser ? 'bg-blue-500 rounded-tr-sm' : 'bg-gray-700 rounded-tl-sm'}`}>
        <Text className="text-white text-sm leading-5">
          {message.text}
        </Text>
        <Text className="text-white/70 text-xs mt-1">
          {new Date(message.timestamp).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );
};