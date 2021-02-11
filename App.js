import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import * as FaceDetector from "expo-face-detector";
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
  const [smileDetected, setSmileDetected] = useState(false);

  const switchCameraType = () => {
    if (cameraType === Camera.Constants.Type.front) {
      setCameraType(Camera.Constants.Type.back);
    } else {
      setCameraType(Camera.Constants.Type.front);
    }
  };

  const onFaceDetected = (faces) => {
    const face = faces[0];
    if (face) {
      if (face.smilingProbability > 0.7) {
        setSmileDetected(true);
      }
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
        // 웃는 모습이 감지되면 수치를 매기는 작업을 중지
        onFacesDetected={smileDetected ? null : onFaceDetected}
        faceDetectorSettings={{
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
        }}
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
