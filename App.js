import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "react-native";
import { Button } from "react-native";
import Settings from "./components/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JokeScreen from "./components/JokeScreen";
import { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "@react-navigation/native";
import {
  MD2DarkTheme as PaperDarkTheme,
  MD2LightTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import SavedJokes from "./components/SavedJokes";
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...LightTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...LightTheme.colors,
  },
};

const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...DarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...DarkTheme.colors,
  },
};

const Tab = createBottomTabNavigator();
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en-us-x-iol-local");
  const [blacklist, setBlacklist] = useState([]);
  const [urlOptions, setUrlOptions] = useState({
    isCustom: false,
  });
  const [savedItems, setSavedItems] = useState([]);
  const [url, setUrl] = useState("https://v2.jokeapi.dev/joke/");

  useEffect(() => {
    AsyncStorage.getItem("savedItems").then((value) => {
      if (value) {
        setSavedItems(JSON.parse(value));
      }
    });
    AsyncStorage.getItem("theme").then((value) => {
      if (value) {
        setTheme(JSON.parse(value));
      }
    });
    AsyncStorage.getItem("lang").then((value) => {
      if (value) {
        setLang(JSON.parse(value));
      }
    });
    AsyncStorage.getItem("urlOptions").then((value) => {
      if (value) {
        setUrlOptions(JSON.parse(value));
      }
    });
    AsyncStorage.getItem("url").then((value) => {
      if (value) {
        setUrl(JSON.parse(value));
      }
    });
    AsyncStorage.getItem("blacklist").then((value) => {
      if (value) {
        setBlacklist(JSON.parse(value));
      }
    });
  }, []);
  useEffect(() => {
    AsyncStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [savedItems]);
  useEffect(() => {
    AsyncStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);
  useEffect(() => {
    AsyncStorage.setItem("lang", JSON.stringify(lang));
  }, [lang]);
  useEffect(() => {
    AsyncStorage.setItem("urlOptions", JSON.stringify(urlOptions));
  }, [urlOptions]);
  useEffect(() => {
    AsyncStorage.setItem("url", JSON.stringify(url));
  }, [url]);
  useEffect(() => {
    AsyncStorage.getItem("blacklist").then((value) => {
      if (value) {
        setBlacklist(JSON.parse(value));
      }
    });
  }, []);
  // console.log(NavigationDefaultTheme.colors);
  return (
    <PaperProvider theme={theme == "dark" ? PaperDarkTheme : PaperDefaultTheme}>
      <NavigationContainer
        theme={theme == "dark" ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <StatusBar
          backgroundColor={
            theme == "dark"
              ? PaperDarkTheme.colors.background
              : PaperDefaultTheme.colors.background
          }
          barStyle={theme == "dark" ? "light-content" : "light-content"}
        />
        <Tab.Navigator initialRouteName="Joke">
          <Tab.Screen
            name="Joke"
            children={() => (
              <JokeScreen
                url={url}
                urlOptions={urlOptions}
                savedItems={savedItems}
                blacklist={blacklist}
                lang={lang}
                setSavedItems={setSavedItems}
              />
            )}
            options={{
              tabBarLabel: "Joke",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="emoticon-lol-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Saved"
            children={() => (
              <SavedJokes
                savedItems={savedItems}
                setSavedItems={setSavedItems}
              />
            )}
            options={{
              tabBarLabel: "Saved",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="content-save"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            children={() => (
              <Settings
                url={url}
                setUrl={setUrl}
                setTheme={setTheme}
                theme={theme}
                urlOptions={urlOptions}
                setUrlOptions={setUrlOptions}
                setLang={setLang}
                blacklist={blacklist}
                setBlacklist={setBlacklist}
                lang={lang}
              />
            )}
            options={{
              tabBarLabel: "Settings",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="cog" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
