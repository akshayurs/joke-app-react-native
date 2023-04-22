import { View } from "react-native";
import { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Share } from "react-native";
import {
  useTheme,
  Text,
  Button,
  ToggleButton,
  IconButton,
  Tooltip,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Animated, { FadeIn } from "react-native-reanimated";
export default function JokeScreen({
  url,
  urlOptions,
  savedItems,
  setSavedItems,
  lang,
  blacklist,
}) {
  const [joke, setJoke] = useState({ category: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const paperTheme = useTheme();
  useEffect(() => {
    if (savedItems.some((i) => i.id == joke.id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [savedItems]);
  const getJoke = async () => {
    try {
      setLoading(true);
      setError(false);
      const options = [];
      Object.keys(urlOptions).forEach((key) => {
        if (urlOptions[key] && key != "isCustom") {
          options.push(key);
        }
      });

      let blacklistItems = [];
      Object.keys(blacklist).forEach((key) => {
        if (blacklist[key]) {
          blacklistItems.push(key);
        }
      });
      let newUrl = options.join(",");
      if (newUrl.length == 0) {
        newUrl = "Any";
      }
      if (blacklistItems.length > 0) {
        newUrl += "?blacklistFlags=" + blacklistItems.join(",");
      }
      const response = await fetch(url + newUrl);

      const data = await response.json();
      if (data.error) {
        throw new Error("Error fetching joke");
      }

      let text = "";
      if (data.type == "single") {
        text = data.joke;
      } else {
        text = data.setup + "\n\n" + data.delivery;
      }

      setJoke({ category: data.category, text: text, id: data.id });
      setSaved(savedItems.some((i) => i.id == data.id));
      Speech.stop();
      if (isSpeechEnabled) {
        Speech.speak(text, {
          voice: lang,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    getJoke();
  }, []);

  return (
    <View style={styles.container}>
      {!loading && !error && (
        <Animated.View entering={FadeIn}>
          <Text style={styles.title}>Category: {joke.category}</Text>
        </Animated.View>
      )}
      <Animated.View style={styles.jokeContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.joke}>Error fetching joke</Text>
        ) : (
          <Animated.View entering={FadeIn}>
            <Text style={styles.joke}>{joke.text}</Text>
          </Animated.View>
        )}
      </Animated.View>
      <View style={styles.bottomBar}>
        <IconButton
          icon="share"
          size={24}
          disabled={loading}
          color={paperTheme.colors.text}
          onPress={() => {
            Share.share({
              message: joke.text,
            });
          }}
        />
        <Tooltip title="Save">
          <IconButton
            icon={saved ? "heart" : "heart-outline"}
            onPress={() => {
              setSaved((prevSave) => {
                if (!prevSave == true) {
                  setSavedItems((prev) => {
                    return [...prev, joke];
                  });
                } else if (!prevSave == false) {
                  setSavedItems((prev) =>
                    prev.filter((item) => item.id != joke.id)
                  );
                }
                return !prevSave;
              });
            }}
            disabled={loading}
          />
        </Tooltip>
        <Tooltip title="Speak">
          <IconButton
            icon={isSpeechEnabled ? "volume-off" : "volume-high"}
            size={24}
            color={paperTheme.colors.primary}
            onPress={() => {
              Speech.stop();
              setIsSpeechEnabled((prev) => {
                Speech.stop();
                if (!prev == true) {
                  Speech.speak(joke.text, {
                    voice: lang,
                  });
                }
                return !prev;
              });
            }}
            disabled={loading}
          />
        </Tooltip>
        <Tooltip title="New Joke">
          <IconButton
            icon="refresh"
            color={paperTheme.colors.primary}
            size={24}
            onPress={() => {
              getJoke();
            }}
            disabled={loading}
          />
        </Tooltip>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  jokeContainer: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    minHeight: 240,
    borderWidth: 0.1,
    borderRadius: 2,
    padding: 10,
    marginBottom: 20,
  },
  joke: {
    fontSize: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
});
