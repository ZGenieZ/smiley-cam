import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as FaceDetector from "expo-face-detector";
import { Camera } from "expo-camera";
import styled from "styled-components";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

const { width, height } = Dimensions.get("window");

const ALBUM_NAME = "Smiley Cam";

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
  const cameraRef = useRef();

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
      takePhoto();
    }
  };

  const savePhoto = async (uri) => {
    try {
      // 카메라 롤에 접근하기 위한 권한 묻기
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // 만약 카메라롤에 접근 허용을 누를 시
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri); // 갤러리에 asset 파일 생성
        let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME); // "Smiley Cam이라는 앨범을 가져온다"

        // 만약 가져온 앨범이 존재하지 않을시 앨범을 만듬
        if (album === null) {
          // 안드로이드에서는 createAlbumAsync 빈앨범을 만들 수 없다.
          album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
        }
        // 만약 가져온 앨범이 존재할 경우
        else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
        }
        // 앨범에 사진을 넣고 다시 웃는 얼굴 인식을 할 수 있게 해준다.
        // setTimeout으로 텀을 준 이유는 얼굴 인식이 빠르게 되어 앨범에 asset이 중복으로 2개가 계속 들어가기 때문이다.
        setTimeout(() => {
          setSmileDetected(false);
        }, 2000);
      }
      // 카메라 롤에 접근 거부를 누를시 카메라 종료
      else {
        setHasPermission(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takePhoto = async () => {
    try {
      if (cameraRef.current) {
        let { uri } = await cameraRef.current.takePictureAsync({
          quality: 1, // 1에 가까워 질수록 high quality
        });
        if (uri) {
          savePhoto(uri);
        }
      }
    } catch (error) {
      alert(error);
      setSmileDetected(false);
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
        ref={cameraRef}
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
