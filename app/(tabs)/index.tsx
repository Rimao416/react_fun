import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function TabOneScreen() {
  const [isOpen, setIsOpen] = useState(true);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  // const handlePresentModalPress = useCallback(() => {
  //   bottomSheetRef.current?.present();
  // }, []);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapeToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button title="Open" onPress={handleOpenPress} />
        <Button title="Close" onPress={handleClosePress} />
        <Button title="Collapse" onPress={handleCollapsePress} />
        <Button title="Snap 0" onPress={() => snapeToIndex(0)} />
        <Button title="Snap 1" onPress={() => snapeToIndex(1)} />
        <Button title="Snap 2" onPress={() => snapeToIndex(2)} />
        {/* <Button
        onPress={handlePresentModalPress}
        title="Present Modal"
        color="black"
      /> */}
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          // backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: "#1d0f4e" }}
          // handleStyle={{ backgroundColor: "black" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          // onClose={() => setIsOpen(false)}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.containerHeadLine}>Salutt</Text>
          </View>
          <TextInput style={styles.input}/>
          <BottomSheetTextInput style={styles.input}/>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
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
