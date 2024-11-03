import {
  View,
  TouchableOpacity,
  ViewStyle,
  FlexAlignType,
  Text,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import React from "react";
import Colors from "@/constants/Colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface IconProps {
  color: string;
  size: number;
}

interface Asker {
  documentId: string;
  firstname: string;
  email: string;
  profile: string;
}

interface Icons {
  [key: string]: (props: IconProps) => JSX.Element;
}
const tabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { family } = useContext(AppContext);
  const [askers, setAskers] = useState<Asker[]>([]);
  useEffect(() => {
    if (family) {
      setAskers(family.user_lists.filter((asker) => asker.profile === "asker"));
    }
  }, [family]);

  const icons: Icons = {
    home: (props: IconProps) => <AntDesign name="home" {...props} />,
    calendar: (props: IconProps) => <AntDesign name="calendar" {...props} />,
    shopping: (props: IconProps) => (
      <AntDesign name="shoppingcart" {...props} />
    ),
    todo: (props: IconProps) => <AntDesign name="bars" {...props} />,
    settings: (props: IconProps) => <AntDesign name="setting" {...props} />,
  };
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabBarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {icons[route.name]({
              color:
                route.name === "settings" && askers.length > 0
                  ? "red"
                  : isFocused
                  ? Colors.bronze12
                  : Colors.bronze10,
              size: isFocused ? 30 : 24,
            })}
            {route.name === "settings" && (
              <Text
                style={{
                  position: "absolute",
                  color: "red",
                  right: 10,
                  top: -17,
                  fontFamily: "AmaticBold",
                }}
              >
                {askers.length > 0 ? askers.length : ""}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = {
  tabBar: {
    flexDirection: "row" as ViewStyle["flexDirection"],
    position: "absolute" as ViewStyle["position"],
    bottom: 10,
    justifyContent: "space-between" as ViewStyle["justifyContent"],
    alignItems: "center" as FlexAlignType, // Correction ici
    backgroundColor: Colors.bronze4,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 5,
    shadowColor: Colors.bronze12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center" as FlexAlignType, // Correction ici également
    justifyContent: "center" as ViewStyle["justifyContent"],
    borderRadius: 10,
    margin: 10,
    backgroundColor: "transparent",
  },
};

export default tabBar;
