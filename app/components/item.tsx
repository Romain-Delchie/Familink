import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import Colors from "@/constants/Colors";
import API from "../services/API";
import Modal from "react-native-modal";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Item {
  documentId?: string;
  name: string;
  quantity?: string;
  author: string;
  category: string;
  checked: boolean;
  id?: number;
}
interface listState {
  list_items: Item[];
  documentId: string;
  name: string;
}

interface Family {
  shopping_lists: listState[];
}

const Item = ({
  item,
  setListState,
  family,
  updateFamily,
  listState,
}: {
  item: Item;
  setListState: any;
  family: Family;
  updateFamily: (newFamily: Family) => void;
  listState: listState;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedCategoty, setEditedcategory] = useState(item.category);
  const [isChecked, setIsChecked] = useState(item.checked);
  const [quantity, setQuantity] = useState(parseInt(item.quantity || "1"));

  const handleDeleteItem = (item: Item) => {
    if (item.documentId === undefined) return;
    API.deleteItemFromList(item.documentId)
      .then(() => {
        const newItems = listState.list_items.filter(
          (listItem) => listItem.documentId !== item.documentId
        );

        const newShoppingList = {
          ...listState,
          list_items: newItems,
        };
        if (family) {
          updateFamily({
            ...family,
            shopping_lists: family.shopping_lists.map((oneList) =>
              oneList.documentId === newShoppingList.documentId
                ? newShoppingList
                : oneList
            ),
          });
        }
        setListState(newShoppingList);
      })
      .catch((err: Error) => {
        console.error(err);
        alert(err);
      });
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditedName(item.name);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    // Ici, vous pouvez ajouter du code pour sauvegarder le nom édité
    if (item.name === editedName) {
      return;
    } else {
      API.updateItemFromList(item.documentId, {
        data: { name: editedName },
      }).then(() => {
        const newItems = listState.list_items.map((listItem) =>
          listItem.documentId === item.documentId
            ? { ...listItem, name: editedName }
            : listItem
        );
        const newShoppingList = {
          ...listState,
          list_items: newItems,
        };
        item.name = editedName;
        if (family) {
          updateFamily({
            ...family,
            shopping_lists: family.shopping_lists.map((oneList) =>
              oneList.documentId === newShoppingList.documentId
                ? newShoppingList
                : oneList
            ),
          });
        }
        setListState(newShoppingList);
      });
    }
  };

  const handleCheckbox = () => {
    API.updateItemFromList(item.documentId, {
      data: { checked: !isChecked },
    }).then(() => {
      const newItems = listState.list_items.map((listItem) =>
        listItem.documentId === item.documentId
          ? { ...listItem, checked: !isChecked }
          : listItem
      );
      const newShoppingList = {
        ...listState,
        list_items: newItems,
      };
      item.checked = !isChecked;
      if (family) {
        updateFamily({
          ...family,
          shopping_lists: family.shopping_lists.map((oneList) =>
            oneList.documentId === newShoppingList.documentId
              ? newShoppingList
              : oneList
          ),
        });
      }
      setListState(newShoppingList);
      setIsChecked(!isChecked);
    });
  };

  const handleQuantity = () => {
    API.updateItemFromList(item.documentId, {
      data: { quantity: quantity.toString() },
    }).then(() => {
      const newItems = listState.list_items.map((listItem) =>
        listItem.documentId === item.documentId
          ? { ...listItem, quantity: quantity.toString() }
          : listItem
      );
      const newShoppingList = {
        ...listState,
        list_items: newItems,
      };
      item.quantity = quantity.toString();
      if (family) {
        updateFamily({
          ...family,
          shopping_lists: family.shopping_lists.map((oneList) =>
            oneList.documentId === newShoppingList.documentId
              ? newShoppingList
              : oneList
          ),
        });
      }
      setListState(newShoppingList);
    });
  };

  useEffect(() => {
    if (quantity !== parseInt(item.quantity)) {
      handleQuantity();
    }
  }, [quantity]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <Pressable onLongPress={toggleEditing} style={{ width: "98%" }}>
      <Modal
        isVisible={isEditing}
        onBackdropPress={handleSaveEdit}
        onBackButtonPress={handleSaveEdit}
        animationIn="slideInUp" // Animation pour l'ouverture
        animationOut="slideOutDown" // Animation pour la fermeture
      >
        <View
          style={{
            bottom: 0,
            width: "100%",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            // paddingTop: 20,
            borderStyle: "solid",
            borderColor: Colors.bronze6,
            borderBottomWidth: 0,
            borderWidth: 3,
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.bronze3,
            height: 400,
            gap: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Text style={styles.labelText}>Nom:</Text>
            <TextInput
              style={{
                borderColor: Colors.bronze11,
                borderWidth: 1,
                padding: 10,
                color: Colors.bronze12,
                fontSize: 20,
                fontFamily: "AmaticBold",
                width: 150,
              }}
              value={editedName}
              onChangeText={setEditedName}
              autoFocus
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.labelText}>Qté:</Text>
            <View style={{ width: 150, alignItems: "center" }}>
              <Entypo
                name="chevron-up"
                size={20}
                color={Colors.bronze11}
                onPress={increaseQuantity}
              />

              <Text style={styles.quantityText}>{quantity}</Text>

              <Entypo
                name="chevron-down"
                size={20}
                color={Colors.bronze11}
                onPress={decreaseQuantity}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Text style={styles.labelText}>Catégorie:</Text>
            <TextInput
              style={{
                borderColor: Colors.bronze11,
                borderWidth: 1,
                color: Colors.bronze12,
                fontSize: 20,
                padding: 10,
                width: 150,
                fontFamily: "AmaticBold",
              }}
              value={editedCategoty}
              onChangeText={setEditedcategory}
              autoFocus
            />
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteItem(item)}
            style={{
              position: "absolute",
              height: 40,
              borderRadius: 10,
              backgroundColor: "red",
              width: 150,
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: Colors.bronze12 }}>Supprimer</Text>
            <Entypo name="trash" size={20} color={Colors.bronze11} />
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.item}>
        <Checkbox
          status={item.checked ? "checked" : "unchecked"}
          onPress={() => setIsChecked(!isChecked)}
          color={Colors.bronze11}
          onPress={handleCheckbox}
        />

        <Text style={styles.textItem}>{item.name}</Text>
        <Text style={styles.quantityText}>Qté: {quantity}</Text>
        <Image source={{ uri: item.author }} style={styles.authorImage} />
      </View>
    </Pressable>
  );
};

const styles = {
  item: {
    flexDirection: "row",
    borderRadius: 5,
    alignItems: "center",
    width: "90%",
    marginHorizontal: "auto",
    justifyContent: "space-evenly",
    backgroundColor: Colors.bronze5,
    padding: 5,
    // height: 70,
  },
  textItem: {
    color: Colors.bronze12,
    fontSize: 26,
    fontFamily: "AmaticBold",
    width: 200,
  },
  textInput: {
    color: Colors.bronze12,
    fontSize: 26,
    fontFamily: "AmaticBold",
    width: 200,
    borderBottomWidth: 1,
    borderBottomColor: Colors.bronze11,
  },
  quantityContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    color: Colors.bronze11,
    fontSize: 18,
    fontFamily: "AmaticBold",
  },
  authorImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  labelText: {
    color: Colors.bronze11,
    width: 100,
  },
  deleteButton: {
    color: Colors.bronze11,
    fontSize: 20,
  },
};

export default Item;
