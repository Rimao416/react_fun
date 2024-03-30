import { View, Text, StyleSheet } from "react-native";
import React, { forwardRef, useMemo } from "react";
import BottomSheet,{BottomSheetModal} from "@gorhom/bottom-sheet";


interface Props {
  title: string;
}
type Ref = BottomSheetModal;
const CustomBottomSheetModal = forwardRef<Ref, Props>((props, ref) => {
    const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
    return (

        <BottomSheetModal
          ref={ref}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          enableContentPanningGesture
          //   backdropComponent={renderBackdrop}
          backgroundStyle={{ backgroundColor: "#1d0f4e" }}
          // handleStyle={{ backgroundColor: "black" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
          // onClose={() => setIsOpen(false)}
        >
          <View>
            <Text style={styles.containerHeadLine}>{props.title}</Text>
          </View>
        </BottomSheetModal>
    );
  });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
    alignItems: "center",
  },
  
  containerHeadLine: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "white",
  },
  input: {
    marginTop: 8,
    marginHorizontal: 16,
  },
});

export default CustomBottomSheetModal;
