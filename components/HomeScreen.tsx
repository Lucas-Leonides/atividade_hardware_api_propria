import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

const SENSOR_LOCATION = {
  latitude: -8.0079498,
  longitude: -34.8948316,
};

export interface Feed {
  entry_id: number;
  created_at: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
}

export interface ApiResponse {
  feeds: Feed[];
}

export default function HomeScreen() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [activeButton, setActiveButton] = useState<"feeds" | "location" | null>(null);

  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180; // Converte graus em radianos
    const R = 6371; // Raio da Terra em quilômetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna a distância em quilômetros
  };

  const handleFetchData = async () => {
    setActiveButton("feeds");
    try {
      const response = await fetch("https://api.thingspeak.com/channels/2757367/feeds.json?results=2");
      const data: ApiResponse = await response.json();
      setFeeds(data.feeds);
      setLocation(null); // Limpa a localização quando novos dados são carregados
      setDistance(null); // Limpa a distância
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  };

  const handleFetchLocation = async () => {
    setActiveButton("location");
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível acessar a localização.");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Calcular a distância até o sensor
      const calculatedDistance = haversine(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        SENSOR_LOCATION.latitude,
        SENSOR_LOCATION.longitude
      );
      setDistance(calculatedDistance);
      setFeeds([]); // Limpa os feeds quando a localização é obtida
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
    }
  };

  const renderFeedCard = (item: Feed) => (
    <View style={styles.card}>
      <Text style={styles.feedText}>Data: {item.created_at}</Text>
      <Text style={styles.feedText}>Temperatura 1: {item.field1} °C</Text>
      <Text style={styles.feedText}>Umidade 1: {item.field2} %</Text>
      <Text style={styles.feedText}>Temperatura 2: {item.field3} °C</Text>
      <Text style={styles.feedText}>Umidade 2: {item.field4} %</Text>
      <Text style={styles.feedText}>Random: {item.field5}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {activeButton === "location" && location && (
        <View>
          <View style={styles.locationCard}>
            <Text style={styles.cardHeader}>Localização Atual</Text>
            <Text style={styles.cardText}>Latitude: {location.latitude}</Text>
            <Text style={styles.cardText}>Longitude: {location.longitude}</Text>
          </View>

          {/* Exibir a distância do sensor */}
          {distance !== null && (
            <View style={styles.distanceCard}>
              <Text style={styles.cardHeader}>Distância do Sensor</Text>
              <Text style={styles.cardText}>{distance.toFixed(2)} km</Text>
              <Text style={styles.cardText}>
                Esta é a distância atual do seu dispositivo até o sensor de medição localizado
                nas coordenadas especificadas.
              </Text>
            </View>
          )}
        </View>
      )}
      {activeButton === "feeds" && feeds.length > 0 && (
        <View style={styles.feedsContainer}>
          <Text style={styles.heading}>Dados da API</Text>
          <FlatList
            data={feeds}
            keyExtractor={(item) => item.entry_id.toString()}
            renderItem={({ item }) => renderFeedCard(item)} // Cada item renderiza seu próprio card
            contentContainerStyle={styles.list}
          />
        </View>
      )}
      {/* Card adicional com texto "Teste de Sensor" */}
      <View style={styles.testCard}>
        <Text style={styles.cardHeader}>Teste de Sensor</Text>
        <Text style={styles.cardText}>
          Os dados do sensor fazem parte de um projeto para sensoreamente remoto de incêndios, os dados são coletados de um sistema IOT e enviados para internet e estão sendo exibidos aqui. As leitura são feitas a cada 2 minutos em média. 
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, activeButton === "feeds" ? styles.activeButton : styles.inactiveButton]} 
          onPress={handleFetchData}
        >
          <Text style={styles.buttonText}>Solicitar Dados</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, activeButton === "location" ? styles.activeButton : styles.inactiveButton]} 
          onPress={handleFetchLocation}
        >
          <Text style={styles.buttonText}>Obter Localização</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f3",
    padding: 10,
  },
  locationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  distanceCard: {
    backgroundColor: "#D1E7DD", // Cor clara para o card de distância
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8, // Mais espaço vertical para separar os textos
    textAlign: "center",
  },
  feedsContainer: {
    marginTop: 20, // Um pouco de espaço acima dos dados da API
    padding: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10, // Espaço entre os cards
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  feedText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    textAlign: "left", // Ajustando o alinhamento
  },
  testCard: {
    backgroundColor: "#f0f8ff", // Cor de fundo leve para o teste de sensor
    borderRadius: 8,
    padding: 15,
    marginVertical: 20, // Um pouco de espaço antes e depois
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 0,
    backgroundColor: "#6200ea",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});