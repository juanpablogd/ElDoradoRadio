//Importar Librería
import React from "react"; 
import  { StyleSheet,Linking,Share,ReactNative,View } from "react-native";
import { Icon } from 'react-native-elements';
//LISTADO ICONOS https://oblador.github.io/react-native-vector-icons/

//Crear Componente
const MenuConnect  = () => {
    const styles = StyleSheet.create({
        container: {
          flexDirection: "row",
          marginTop:'20%',
        }
      });

    const onShare = async () => {

        let  urlShare = 'http://www.eldoradoradio.co/inicio';
        if (Platform.OS == 'ios') urlShare = 'http://www.eldoradoradio.co/inicio';
        try {
          const result = await Share.share({
            message: urlShare,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          console.log(error.message);
        }
      };

        return (
            <View style={styles.container}>
                <Icon
                reverse
                name='facebook'
                type='font-awesome'
                color='#4267B2'
                onPress={() => Linking.openURL('https://www.facebook.com/ElDoradoRadio.Co/')} /><Icon
                    reverse
                    name='whatsapp'
                    type='font-awesome'
                    color='#25D366'
                    onPress={() => Linking.openURL('whatsapp://send?phone=+573103077351')} /><Icon
                    reverse
                    name='phone'
                    type='font-awesome'
                    color='#FF5A5F'
                    onPress={() => Linking.openURL(`tel:3103077351`)} /><Icon
                    reverse
                    name='share-alt'
                    type='font-awesome'
                    color='#0F9D58'
                    onPress={onShare} /><Icon
                    reverse
                    name='web'
                    type='foundation'
                    onPress={() => Linking.openURL('http://www.eldoradoradio.co/inicio')} />
            </View>

        );

}

//Hacer componente visible para los demás
export default MenuConnect;

