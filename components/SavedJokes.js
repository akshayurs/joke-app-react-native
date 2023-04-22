import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Share, ToastAndroid, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Transition, ZoomOut } from "react-native-reanimated";
import { useState } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOut,
  Layout,
  ZoomIn,
} from "react-native-reanimated";
import { Card, Searchbar, Text, useTheme } from "react-native-paper";
export default function SavedJokes({ setSavedItems, savedItems }) {
  const paperTheme = useTheme();
  const [search, setSearch] = useState("");
  let filteredItems = savedItems.filter((item) => {
    return item.text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Searchbar
        style={{ margin: 8 }}
        placeholder="Search"
        onChangeText={(e) => {
          setSearch(e);
        }}
      />

      {savedItems.length > 0 ? (
        filteredItems.length > 0 ? (
          <FlatList
            data={search.length > 0 ? filteredItems : savedItems}
            renderItem={({ index, item }) => {
              return (
                <Animated.View
                  key={item.id}
                  entering={FadeInRight.delay(50 * index)}
                  exiting={ZoomOut}
                  layout={Layout.delay(1000)}
                  style={{
                    margin: 9,
                    minHeight: 150,
                    padding: 20,
                    borderRadius: 3,
                    borderColor: paperTheme.colors.text,
                    borderWidth: 0.1,
                    backgroundColor: paperTheme.colors.background,
                    // justifyContent: "space-evenly",
                    // alignItems: "flex-end",
                  }}
                >
                  {/* <View></View> */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17 }}>
                      {index + 1}. {item.text}
                    </Text>
                  </View>
                  <View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="share"
                        size={24}
                        color={paperTheme.colors.text}
                        onPress={() => {
                          Share.share({
                            message: item.text,
                          });
                        }}
                      />
                      <MaterialCommunityIcons
                        name="content-copy"
                        size={24}
                        color={paperTheme.colors.text}
                        onPress={() => {
                          Clipboard.setString(item.text);
                          ToastAndroid.show(
                            "Copied to clipboard",
                            ToastAndroid.SHORT
                          );
                        }}
                      />

                      <MaterialCommunityIcons
                        name="delete"
                        size={24}
                        color={paperTheme.colors.text}
                        onPress={() => {
                          setSavedItems((prev) =>
                            prev.filter((i) => i.id != item.id)
                          );
                        }}
                      />
                    </View>
                  </View>
                </Animated.View>
              );
            }}
          />
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text style={{ fontSize: 18 }}>Not Found</Text>
          </View>
        )
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ fontSize: 18 }}>No Saved Jokes to Display</Text>
        </View>
      )}
    </>
  );
}
