import "@/global.css";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy? 😊",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const consultarGemini = async (pregunta: string) => {
    if (!ai) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Error: API Key no configurada, porfavor contacte al servicio tecnico.",
        isUser: false,
        timestamp: new Date()
      }]);
      return;
    }

    if (!pregunta.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: pregunta.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    setIsLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: pregunta.trim(),
      });

      const responseText = response.text || "❌ No se pudo obtener la respuesta 😭";

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.log(err);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Error al consultar Gemini 😵‍💫. Verifica tu API Key en la raiz del programa.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-300"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ChatHeader />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageBubble message={item} />}
        className="flex-1 bg-[#DDD0C8] pt-3"
      />

      {isLoading && <TypingIndicator />}

      <ChatInput 
        inputText={inputText}
        isLoading={isLoading}
        onChangeText={setInputText}
        onSend={() => consultarGemini(inputText)}
      />
    </KeyboardAvoidingView>
  );
}