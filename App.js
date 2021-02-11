import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions } from 'react-native';
import { Camera } from 'expo-camera'
import styled from 'styled-components'

const {width,height} = Dimensions.get("window")


const CenterView = styled.View`
flex :1;
align-items:center;
justify-content:center;
background-color:cornflowerblue;
`; 

const Text = styled.Text`
color:white;
font-size:22px;
`


export default function App() {
  const [hasPermission, setHasPermission] = useState(null)
  useEffect(()=>{
    (async () => {
      const {status} = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  },[])

  if(hasPermission === null){
    return <CenterView><ActivityIndicator/></CenterView>
  } 
  if(hasPermission === false){
    return <CenterView>
    <Text>No access to camera</Text>
    </CenterView>
  }
  
  return (
    <CenterView>
      <Camera style={{width:width - 40, height:height / 1.5,borderRadius:10, overflow:'hidden'}} type={Camera.Constants.Type.front}/>
    </CenterView>
  );
}


