import "@/global.css";
import { GoogleGenAI } from "@google/genai";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";

// Componente para las burbujas de mensajes
const MessageBubble = ({ message }: { message: any }) => {
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

// Componente indicador de escritura
const TypingIndicator = () => {
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

export default function Index() {
  // 1. Estados
  const [messages, setMessages] = useState([
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

  // 2. Configuración de la API con validación
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 3. Función para consultar Gemini
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

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: pregunta.trim(),
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    setIsLoading(true);
    try {
      // Usar el método correcto para interactuar con el modelo "gemini-2.5-flash"
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",  // El modelo que deseas usar
        contents: pregunta.trim(),   // El contenido a procesar por el modelo
      });

      // Aquí tomamos la respuesta generada por la IA
      const responseText = response.text || "❌ No se pudo obtener la respuesta 😭";

      // Agregar respuesta de la IA
      const aiMessage = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.log(err);
      const errorMessage = {
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

  // 4. Retorno del componente
  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-300 "
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      <View className="bg-black pt-12 pb-4 px-6 flex-row items-center justify-between">
        <Text className="text-white text-2xl font-bold">🤖 MFM MiniChat 🤖</Text>
        <Text className="text-white/80 text-sm mt-1">En línea💚</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MessageBubble message={item} />}
        className="flex-1 bg-[#DDD0C8] pt-3"
      />

      {isLoading && <TypingIndicator />}

      <View className="bg-black border-t border-gray-300 px-4 py-4">
        <View className="flex-row items-end gap-2">
          <View className="flex-1 bg-gray-300 rounded-2xl px-4 py-2 min-h-[48px] justify-center">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Escribe tu mensaje..."
              placeholderTextColor="#404040"
              multiline
              editable={!isLoading}
              className="text-[#404040] text-sm max-h-32"
              onSubmitEditing={() => consultarGemini(inputText)}
            />
          </View>
          <TouchableOpacity
            onPress={() => consultarGemini(inputText)}
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
    </KeyboardAvoidingView>
  );
}
