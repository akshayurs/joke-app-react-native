import { useState } from "react";
import { View } from "react-native";
import DropDown from "react-native-paper-dropdown";
import {
  Switch,
  TextInput,
  TouchableRipple,
  useTheme,
  Text,
  RadioButton,
  Checkbox,
  Divider,
  Headline,
} from "react-native-paper";
import { StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import Animated, {
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  Layout,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
export default function Settings({
  blacklist,
  setBlacklist,
  url,
  setUrl,
  theme,
  setTheme,
  urlOptions,
  setUrlOptions,
  setLang,
  lang,
}) {
  const paperTheme = useTheme();
  const [showDropDown, setShowDropDown] = useState(false);
  let getVoice = async () => {
    const voices = await Speech.getAvailableVoicesAsync();
    const voicesList = voices
      .map((voice) => {
        return { label: voice.identifier, value: voice.identifier };
      })
      .filter((voice) => voice.label.includes("en"));
    if (voicesList.length > 0) setVoice(voicesList);
    else getVoice();
  };

  const [voice, setVoice] = useState([]);
  useEffect(() => {
    getVoice();
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableRipple
          onPress={() =>
            setTheme((prev) => (prev == "dark" ? "light" : "dark"))
          }
        >
          <View style={{ ...styles.row, paddingHorizontal: 15 }}>
            <Text style={styles.title}>Dark Mode</Text>
            <View pointerEvents="none">
              <Switch value={theme == "dark"} />
            </View>
          </View>
        </TouchableRipple>
        <Divider />
        <TextInput
          mode="outlined"
          label="URL"
          placeholder="Enter URL"
          disabled={true}
          value={url}
          style={styles.urlInput}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Divider />
        <Headline
          style={{
            paddingLeft: 10,
            paddingTop: 10,
            fontSize: 20,
            marginTop: 5,
            marginBottom: 15,
          }}
        >
          Select Voice Model
        </Headline>
        <View style={{ marginHorizontal: 5 }}>
          <DropDown
            // label="Voice"
            mode="outlined"
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={lang}
            setValue={setLang}
            list={voice}
          />
        </View>
        <Divider />
        <Headline
          style={{
            marginTop: 10,
            paddingLeft: 10,
            paddingTop: 10,
            fontSize: 20,
          }}
        >
          Joke Type
        </Headline>
        <RadioButton.Item
          label="Any"
          value="any"
          status={!urlOptions.isCustom ? "checked" : "unchecked"}
          onPress={() => {
            setUrlOptions(() => {
              return { isCustom: false };
            });
          }}
        />

        {urlOptions.isCustom && <Divider />}
        <RadioButton.Item
          status={urlOptions.isCustom ? "checked" : "unchecked"}
          label="Custom"
          value="custom"
          onPress={() => {
            setUrlOptions((prev) => {
              return { ...prev, isCustom: true };
            });
          }}
        />
        {urlOptions.isCustom && (
          <Animated.View entering={FadeInUp}>
            <Checkbox.Item
              status={urlOptions.Programming ? "checked" : "unchecked"}
              label="Programming"
              onPress={() => {
                setUrlOptions((prev) => {
                  return { ...prev, Programming: !urlOptions.Programming };
                });
              }}
            />
            <Checkbox.Item
              status={urlOptions.Miscellaneous ? "checked" : "unchecked"}
              label="Miscellaneous"
              onPress={() => {
                setUrlOptions((prev) => {
                  return {
                    ...prev,
                    Miscellaneous: !urlOptions.Miscellaneous,
                  };
                });
              }}
            />
            <Checkbox.Item
              status={urlOptions.Dark ? "checked" : "unchecked"}
              label="Dark"
              onPress={() => {
                setUrlOptions((prev) => {
                  return { ...prev, Dark: !urlOptions.Dark };
                });
              }}
            />
            <Checkbox.Item
              status={urlOptions.Pun ? "checked" : "unchecked"}
              label="Pun"
              onPress={() => {
                setUrlOptions((prev) => {
                  return { ...prev, Pun: !urlOptions.Pun };
                });
              }}
            />
            <Checkbox.Item
              status={urlOptions.Spooky ? "checked" : "unchecked"}
              label="Spooky"
              onPress={() => {
                setUrlOptions((prev) => {
                  return { ...prev, Spooky: !urlOptions.Spooky };
                });
              }}
            />
            <Checkbox.Item
              status={urlOptions.Christmas ? "checked" : "unchecked"}
              label="Christmas"
              onPress={() => {
                setUrlOptions((prev) => {
                  return { ...prev, Christmas: !urlOptions.Christmas };
                });
              }}
            />
          </Animated.View>
        )}
        <Divider />
        <Headline
          style={{
            marginTop: 10,
            paddingLeft: 10,
            paddingTop: 10,
            fontSize: 20,
          }}
        >
          Select flags to blacklist
        </Headline>
        <Checkbox.Item
          status={blacklist.nsfw ? "checked" : "unchecked"}
          label="NSFW"
          onPress={() => {
            setBlacklist((prev) => {
              return { ...prev, nsfw: !blacklist.nsfw };
            });
          }}
        />
        <Checkbox.Item
          status={blacklist.religious ? "checked" : "unchecked"}
          label="Religious"
          onPress={() => {
            setBlacklist((prev) => {
              return { ...prev, religious: !blacklist.religious };
            });
          }}
        />
        <Checkbox.Item
          status={blacklist.political ? "checked" : "unchecked"}
          label="Political"
          onPress={() => {
            setBlacklist((prev) => {
              return { ...prev, political: !blacklist.political };
            });
          }}
        />
        <Checkbox.Item
          status={blacklist.racist ? "checked" : "unchecked"}
          label="Racist"
          onPress={() => {
            setBlacklist((prev) => {
              return { ...prev, racist: !blacklist.racist };
            });
          }}
        />
        <Checkbox.Item
          status={blacklist.sexist ? "checked" : "unchecked"}
          label="Sexist"
          onPress={() => {
            setBlacklist((prev) => {
              return { ...prev, sexist: !blacklist.sexist };
            });
          }}
        />
        <Checkbox.Item
          status={blacklist.explicit ? "checked" : "unchecked"}
          label="Explicit"
          onPress={() => {
            setBlacklist((prev) => {
              return { ...prev, explicit: !blacklist.explicit };
            });
          }}
        />
        <Divider />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    flex: 1,
    // alignItems: "center",
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  urlInput: {
    marginHorizontal: 15,
    marginBottom: 15,
    marginTop: 12,
  },
  row: {
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
