import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import imagePlaceholder from "./assets/placeholder.png";
import logo from "./assets/logoPhotographera.png";

export default function App() {
  const [foto, setFoto] = useState(null);

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }

    verificaPermissoes();
  }, []);

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!imagem.canceled) {
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  const [minhaLocalizacao, setMinhaLocalizacao] = useState(null);

  useEffect(() => {
    async function obterLocalizacao() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Ops!", "Você não autorizou o uso de geolocalização");
        return;
      }

      let localizacaoAtual = await Location.getCurrentPositionAsync({});
      setMinhaLocalizacao(localizacaoAtual);
    }
    obterLocalizacao();
  }, []);

  const [localizacao, setLocalizacao] = useState(null);

  const regiaoInicialMapa = {
    latitude: -23.533773,
    longitude: -46.65529,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  const marcarLocal = () => {
    setLocalizacao({
      latitude: minhaLocalizacao.coords.latitude,
      longitude: minhaLocalizacao.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.01,
    });
  };

  return (
    <>
      <StatusBar style="auto" />
      <ScrollView>
        <View style={estilos.viewLogo}>
          <Image source={logo} style={estilos.logo} />
        </View>
        <View style={estilos.container}>
          <Text style={estilos.titulo}>Photographera</Text>
          <View style={estilos.viewFoto}>
            <TextInput style={estilos.input} placeholder="Legenda da foto" />
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={{ width: 300, height: 168.75, marginBottom: 16 }}
              />
            ) : (
              <Image source={imagePlaceholder} style={estilos.imagem} />
            )}
            <Button title="Capturar Imagem" onPress={acessarCamera} />
          </View>
          <View style={estilos.viewMapa}>
            <MapView
              mapType="hybrid"
              style={estilos.mapa}
              region={localizacao ?? regiaoInicialMapa}
            >
              {localizacao && <Marker coordinate={localizacao} />}
            </MapView>
            <Button title="Obter a localização" onPress={marcarLocal} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //backgroundColor: "#a8cf45",
  },

  viewLogo: {
    flex: 1,
    marginTop: 10,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  logo: {
    width: 200,
    height: 200,
  },

  titulo: {
    fontSize: 40,
    marginTop: 50,
    color: "#36006c",
    fontWeight: "bold",
  },
  viewFoto: {
    marginTop: 25,
    marginBottom: 16,
  },
  input: {
    width: 300,
    borderColor: "#000",
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  imagem: {
    width: 300,
    height: 168.75,
    marginBottom: 16,
  },
  viewMapa: {},
  mapa: {
    width: 300,
    height: 168.75,
    marginBottom: 16,
  },
});
