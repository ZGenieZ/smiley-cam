import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import styled from "styled-components";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 45px;
`;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const switchCameraType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <CenterView>
        <ActivityIndicator />
      </CenterView>
    );
  }
  if (hasPermission === false) {
    return (
      <CenterView>
        <Text>No access to camera</Text>
      </CenterView>
    );
  }

  return (
    <CenterView>
      <Camera
        style={{
          width: width - 40,
          height: height / 1.5,
          borderRadius: 10,
          overflow: "hidden",
        }}
        type={cameraType}
      />
      <IconBar>
        <TouchableOpacity onPress={switchCameraType}>
          <MaterialIcons
            name={
              cameraType === Camera.Constants.Type.front
                ? "camera-rear"
                : "camera-front"
            }
            color="white"
            size={50}
          />
        </TouchableOpacity>
      </IconBar>
    </CenterView>
  );
}
