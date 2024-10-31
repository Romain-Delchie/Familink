import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import Colors from "@/constants/Colors";

const tabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    home: (props) => (
      <AntDesign name="home" size={24} color={Colors.bronze6} {...props} />
    ),
    calendar: (props) => (
      <AntDesign name="calendar" size={24} color={Colors.bronze6} {...props} />
    ),
    shopping: (props) => (
      <AntDesign
        name="shoppingcart"
        size={24}
        color={Colors.bronze6}
        {...props}
      />
    ),
    todo: (props) => (
      <AntDesign name="bars" size={24} color={Colors.bronze6} {...props} />
    ),
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
              color: isFocused ? Colors.bronze12 : Colors.bronze10,
              size: isFocused ? 30 : 24,
            })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = {
  tabBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.bronze4,
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 5,
    borderCurve: "continuous",
    shadowColor: Colors.bronze12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
    backgroundColor: "none",
  },
};

export default tabBar;
