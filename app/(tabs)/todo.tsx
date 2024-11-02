import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AppContext from "../context/appContext";
import DraggableFlatList from "react-native-draggable-flatlist";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import API from "../services/API";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";

interface TodoItem {
  documentId: string;
  name: string;
  ranking: number;
  author: string;
}

interface DragEndParams {
  data: TodoItem[];
  from: number;
  to: number;
}
export default function Todo() {
  const { family, updateFamily } = useContext(AppContext);
  const { user } = useUser();
  const [sortedTodos, setSortedTodos] = useState(family?.todo_items);
  const [initialData, setInitialData] = useState(sortedTodos);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState("");
  // Triez les tâches par importance (ranking)
  useEffect(() => {
    const myData = [...(initialData || [])];
    setSortedTodos(myData.sort((a, b) => a.ranking - b.ranking));
  }, [initialData]);
  useEffect(() => {
    console.log(
      "sortedTodos",
      sortedTodos?.map((item) => item.name + " " + item.ranking)
    );
  }, [sortedTodos]);

  const getColorForRanking = (ranking: number): string => {
    const maxRanking = sortedTodos.length;
    const startColor = [20, 17, 16]; // RGB pour #141110
    const endColor = [174, 140, 126]; // RGB pour #ede0d9
    const interpolateColor = (
      start: number[],
      end: number[],
      percent: number
    ): string => {
      const result = start.map((value, index) => {
        const delta = end[index] - value;
        return Math.round(value + delta * percent);
      });
      return `rgb(${result.join(",")})`;
    };

    const hue = interpolateColor(startColor, endColor, ranking / maxRanking);
    return hue;
  };
  const handleDragEnd = ({ data, from, to }) => {
    console.log("data", data);
    console.log("from", from);
    console.log("to", to);

    const draggedItem = data.find((item) => item.ranking === from);
    const draggedItems = data.slice(from, to + 1);
    const updatedData = data.map((item) => {
      if (item.ranking === from) {
        return { ...item, ranking: to };
      } else if (from < to) {
        if (item.ranking > from && item.ranking <= to) {
          return { ...item, ranking: item.ranking - 1 };
        }
      } else if (from > to) {
        if (item.ranking >= to && item.ranking < from) {
          return { ...item, ranking: item.ranking + 1 };
        }
      }
      return item;
    });
    updatedData.map((item) => {
      API.updateTodoItem(item.documentId, {
        data: { ranking: item.ranking, name: item.name, author: item.author },
      })
        .then((res) => {
          setInitialData(updatedData);
          updateFamily({ ...family, todo_items: updatedData });
        })
        .catch((error) => {
          console.error(error.response.data);
          alert("Erreur lors de la mise à jour des tâches");
        });
    });
  };

  const handleDelete = (id) => {
    // Filter out the item with the specified id

    const updatedData = sortedTodos.filter((item) => item.documentId !== id);
    // After filtering, update the rankings of the remaining items
    const updatedDataWithRanking = updatedData.map((item, index) => ({
      ...item,
      ranking: index,
    }));

    updatedDataWithRanking.map((item) => {
      const dataToUpdate = {
        data: {
          name: item.name,
          author: item.author,
          ranking: item.ranking,
        },
      };

      API.updateTodoItem(item.documentId, dataToUpdate)
        .then((res) => {
          setInitialData(updatedDataWithRanking);
        })
        .catch((error) => {
          console.error(error.response.data);
          alert("Erreur lors de la mise à jour des tâches");
        });
    });
    API.deleteToDoItem(id);
    setInitialData(updatedDataWithRanking);
    updateFamily({ ...family, todo_items: updatedDataWithRanking });
  };

  const handleAddTask = () => {
    const newTask = {
      name: text,
      ranking: sortedTodos.length,
      author: user.imageUrl,
      family: family?.documentId,
    };
    console.log(newTask);

    API.createToDoItem({ data: newTask })
      .then((res) => {
        const updatedData = [
          ...sortedTodos,
          { ...newTask, documentId: res.data.data.documentId },
        ];
        setInitialData(updatedData);
        updateFamily({ ...family, todo_items: updatedData });
        setModalVisible(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        alert("Erreur lors de la mise à jour des tâches");
      });
  };

  return (
    <View
      style={{ paddingBottom: 200, backgroundColor: Colors.bronze2, flex: 1 }}
    >
      <TouchableOpacity
        style={{
          height: 100,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 40,
          gap: 10,
          flexDirection: "row", // Add a row layout for the icon
          paddingHorizontal: 10, // Add padding for better spacing
        }}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text
          style={{
            fontFamily: "BowlbyOne",
            color: Colors.bronze11,
            fontSize: 20,
          }}
        >
          Ajouter une tâche
        </Text>
        <MaterialIcons name="playlist-add" size={40} color={Colors.bronze11} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View
          style={{
            bottom: 0,
            top: 0,
            backgroundColor: Colors.bronze3,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Text
            style={{
              color: Colors.bronze11,
              fontFamily: "AmaticBold",
              fontSize: 28,
              marginBottom: 10,
            }}
          >
            Nom de la tâche :
          </Text>
          <TextInput
            style={{
              height: 40,
              width: 200,
              borderColor: Colors.bronze11,
              borderRadius: 15,
              marginBottom: 50,
              backgroundColor: Colors.bronze7,
              borderWidth: 1,
            }}
            onChangeText={(text) => onChangeText(text)}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => handleAddTask()}
              style={{
                backgroundColor: Colors.bronze10,
                borderRadius: 10,
                padding: 15,
                margin: 30,
                width: 100,
                alignItems: "center",
              }}
            >
              <AntDesign name="check" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 15,
                margin: 30,
                width: 100,
                backgroundColor: Colors.bronze9,
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Entypo name="cross" size={30} color="darkred" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <DraggableFlatList
        data={sortedTodos}
        renderItem={({ item, index, drag, isActive }) => (
          <TouchableOpacity
            style={{
              height: 100,
              backgroundColor: isActive
                ? Colors.bronze10
                : getColorForRanking(item.ranking),
              alignItems: "center",
              justifyContent: "space-between", // Add spacing between the item text and icon
              flexDirection: "row", // Add a row layout for the icon
              paddingHorizontal: 10, // Add padding for better spacing
            }}
            onLongPress={drag}
          >
            <Text
              style={{
                fontFamily: "AmaticBold",
                color: Colors.bronze12,
                fontSize: 26,
              }}
            >
              {item.ranking + 1} - {item.name}
            </Text>
            {/* Delete icon (Entypo icon) */}
            <TouchableOpacity
              onPress={() => handleDelete(item.documentId)} // Define a function to handle the delete action
            >
              <Entypo
                name="trash" // Replace with the name of the Entypo icon you want to use
                size={24}
                color={Colors.bronze12} // Customize the icon color
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `draggable-item-${item.id}`}
        onDragEnd={handleDragEnd}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  modalButton: {
    backgroundColor: Colors.bronze10,
    borderRadius: 5,
    padding: 15,
    margin: 10,
    width: 300,
    alignItems: "center",
  },
});
