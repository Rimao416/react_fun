import { View, Text,StyleSheet,Button } from 'react-native'
import React,{useRef} from 'react'
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet'
import CustomBottomSheetModal from '@/components/CustomBottomSheetModal'

const Page = () => {
    const bottomSheetRef=useRef<BottomSheetModal>(null)
    const {dismiss}=useBottomSheetModal()
    const handlePresentModalPress=()=>{
        bottomSheetRef.current?.present()
    }
  return (
    <View style={styles.container}>
      <Text>Page</Text>
      <Button title="Open" onPress={handlePresentModalPress} />
      {/* <Button title="Close" onPress={dismiss} /> */}
      <CustomBottomSheetModal ref={bottomSheetRef} title="Mon truc super cooler" />
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: "center",
      backgroundColor: "grey",
      alignItems: "center",
    },
    contentContainer: {
      flex: 1,
      alignItems: "center",
    },
    containerHeadLine: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
      color: "white",
    },
    input:{
      marginTop:8,
      marginHorizontal:16
    }
  
  });
  

export default Page