//Importar Librería
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slider, Text, Icon } from 'react-native-elements';
//LISTADO ICONOS https://oblador.github.io/react-native-vector-icons/


//Crear Componente
const ControlVolumen  = () => {
    
    const [value, setValue] = useState(0);
    const [vertValue, setVertValue] = useState(0);

 
    const interpolate = (start, end) => {
      let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
      return Math.ceil((1 - k) * start + k * end) % 256;
    };

    const styles = StyleSheet.create({
        contentView: {
            top:'20%',
          justifyContent: 'center',
          alignItems: 'stretch',
        },
      });

    const color = () => {
        let r = interpolate(255, 0);
        let g = interpolate(0, 255);
        let b = interpolate(0, 0);
        return `rgb(${r},${g},${b})`;
      };


        return (

      <View style={[styles.contentView]}>
        <Slider
          value={value}
          onValueChange={setValue}
          maximumValue={10}
          minimumValue={0}
          step={1}
          allowTouchTrack
          trackStyle={{ height: 5, backgroundColor: 'transparent' }}
          thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
          thumbProps={{
            children: (
              <Icon
                name="volume-down"
                type="font-awesome"
                size={20}
                reverse
                containerStyle={{ bottom: 20, right: 20 }}
                color={color()}
              />
            ),
          }}
        />
        <Text style={{ paddingTop: 20 }}>Value: {value}</Text>
      </View>



        );

}

//Hacer componente visible para los demás
export default ControlVolumen;
