import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import AppContext from "../context/appContext";
import { Entypo } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { TextInput } from "react-native-gesture-handler";
import API from "../services/API";
import { AntDesign } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface ListItemProps {
  list: {
    documentId: string;
    name: string;
    id: number;
    list_items: {
      documentId: string;
      name: string;
      quantity?: string;
      author: string;
      id: number;
    }[];
  };
}

export default function ListItem({ list }: ListItemProps) {
  const { family, updateFamily } = useContext(AppContext);
  const [listState, setListState] = useState(list);
  const { user } = useUser();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteAll, setModalDeleteAll] = useState(false);

  const styles = StyleSheet.create({
    listTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 20,
      width: 270,
      height: 70,
      backgroundColor: Colors.bronze3,
      marginBottom: 30,
      paddingRight: 11,
      position: "absolute",
      borderBottomEndRadius: 10,
      borderTopRightRadius: 10,
      top: 50,
      left: 0,
    },
    listTitle: {
      color: Colors.bronze11,
      fontSize: 20,
      fontFamily: "BowlbyOne",
    },
    modalDeleteList: {
      bottom: 0,
      top: 0,
      backgroundColor: Colors.bronze3,
      alignItems: "center",
      gap: 20,
      justifyContent: "center",
      height: "100%",
    },
    itemContainer: {
      backgroundColor: Colors.bronze2,
      paddingTop: 150,
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    item: {
      flexDirection: "row",
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.bronze5,
      padding: 10,
      width: 300,
      height: 70,
    },
    addItem: {
      flexDirection: "row",
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.bronze8,
      padding: 10,
      width: 300,
      height: 70,
    },
    deleteAllItem: {
      flexDirection: "row",
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.bronze8,
      padding: 10,
      width: 300,
      height: 70,
      marginBottom: 50,
      marginTop: 30,
    },
    confirmationButton: {
      backgroundColor: Colors.bronze8,
      width: 200,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmationBtnText: {
      color: Colors.bronze12,
      fontFamily: "AmaticBold",
      fontSize: 20,
    },
    textItem: {
      color: Colors.bronze12,
      fontSize: 26,
      fontFamily: "AmaticBold",
      width: 200,
    },
    textItemTop: {
      marginBottom: 15,
    },
    textItemQty: {
      color: Colors.bronze11,
      fontFamily: "AmaticBold",
      position: "absolute",
      left: 30,
      bottom: 0,
    },
    textAdd: {
      fontFamily: "BowlbyOne",
      fontSize: 15,
    },
    textItemDelete: {
      color: "darkred",
      fontSize: 13,
      fontFamily: "BowlbyOne",
      width: 200,
    },
  });
  interface ShoppingList {
    documentId?: string;
    name: string;
    id: number;
    list_items: {
      documentId?: string;
      name: string;
      quantity?: string;
      author: string;
      id: number;
    }[];
  }

  interface HandleDeleteListProps {
    documentId: string;
  }

  const handleDeleteList = (oneList: HandleDeleteListProps) => {
    API.deleteShoppingList(oneList.documentId)
      .then(() => {
        if (family) {
          updateFamily({
            ...family,
            shopping_lists: family.shopping_lists.filter(
              (item) => item.documentId !== oneList.documentId
            ),
          });
        }
      })
      .catch((err: Error) => {
        console.error(err);
        alert(err);
      });
    setConfirmDelete(false);
  };

  interface Item {
    documentId?: string;
    name: string;
    quantity?: string;
    author: string;
    id: number;
  }

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

  const handleAddItem = () => {
    if (user) {
      if (listState.documentId === undefined) return;
      const itemToAdd: {
        data: {
          name: string;
          quantity: string;
          shopping_list: string;
          author: string;
          id: number;
          documentId: string;
        };
      } = {
        data: {
          name: newItem.name,
          quantity: newItem.quantity,
          shopping_list: listState.documentId,
          author: user.imageUrl,
          id: listState.list_items.length + 1,
          documentId: "randomId",
        },
      };

      API.createItemToList(itemToAdd)
        .then((res) => {
          itemToAdd.data.id = res.data.data.id;
          itemToAdd.data.documentId = res.data.data.documentId;
          const newShoppingList = {
            ...listState,
            list_items: [...listState.list_items, itemToAdd.data],
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
        .catch((err) => {
          console.error(err);
          alert(err);
        });

      setModalVisible(false);
      setNewItem({ name: "", quantity: "" });
    }
  };
  const handleDeleteAllItem = () => {
    listState.list_items.map((item) => {
      API.deleteItemFromList(item.documentId).catch((err) => {
        console.error(err);
        alert(err);
      });
    });
    const newShoppingList: {
      documentId: string;
      name: string;
      id: number;
      list_items: [];
    } = {
      ...listState,
      list_items: [],
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
    setModalDeleteAll(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.itemContainer}>
      <View style={styles.listTitleContainer}>
        <Text style={styles.listTitle}>{listState.name}</Text>
        <Entypo
          name="trash"
          size={24}
          color={Colors.bronze11}
          onPress={() => setConfirmDelete(true)}
        />
        <Modal animationType="slide" transparent={true} visible={confirmDelete}>
          <View style={styles.modalDeleteList}>
            <Text
              style={{
                fontFamily: "AmaticBold",
                color: Colors.bronze11,
                fontSize: 28,
                textAlign: "center",
                width: 250,
              }}
            >
              Êtes-vous sûr de vouloir supprimer la liste ?
            </Text>
            <TouchableOpacity
              style={styles.confirmationButton}
              onPress={() => handleDeleteList(listState)}
            >
              <Text style={styles.confirmationBtnText}>Oui</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmationButton}
              onPress={() => setConfirmDelete(false)}
            >
              <Text style={styles.confirmationBtnText}>Non</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>

      {listState.list_items &&
        listState.list_items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text
              style={
                item.quantity
                  ? [styles.textItem, styles.textItemTop]
                  : styles.textItem
              }
            >
              {item.name}
            </Text>
            {item.quantity && (
              <Text style={styles.textItemQty}>qté: {item.quantity}</Text>
            )}
            <Image
              source={{ uri: item.author }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 100,
                position: "absolute",
                right: 50,
                top: 17,
              }}
            />
            <Entypo
              onPress={() => handleDeleteItem(item)}
              name="trash"
              size={24}
              color={Colors.bronze11}
            />
          </View>
        ))}
      {listState.list_items.length === 0 && (
        <Text
          style={{
            color: Colors.bronze11,
            fontFamily: "AmaticBold",
            fontSize: 26,
            marginBottom: 50,
          }}
        >
          Aucun produit dans cette liste
        </Text>
      )}
      <TouchableOpacity
        style={styles.addItem}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.textItem, styles.textAdd]}>
          Ajouter un produit
        </Text>
        <Entypo name="plus" size={24} color={Colors.bronze11} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            height: "100%",
            backgroundColor: Colors.bronze4,
            padding: 30,
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "AmaticBold",
              color: Colors.bronze11,
              fontSize: 26,
            }}
          >
            Ajouter un nom de produit :
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: Colors.bronze8,
              borderWidth: 1,
              marginTop: 5,
              marginBottom: 50,
              borderRadius: 10,
              backgroundColor: Colors.bronze5,
              color: Colors.bronze12,
            }}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
            value={newItem.name}
          />
          <Text
            style={{
              fontFamily: "AmaticBold",
              color: Colors.bronze11,
              fontSize: 26,
            }}
          >
            quantité: (facultatif)
          </Text>
          <TextInput
            style={{
              height: 40,
              borderColor: Colors.bronze8,
              borderWidth: 1,
              marginTop: 5,
              marginBottom: 50,
              borderRadius: 10,
              backgroundColor: Colors.bronze5,
              color: Colors.bronze12,
            }}
            onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
            value={newItem.quantity}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              onPress={handleAddItem}
              style={{
                backgroundColor: Colors.bronze9,
                borderRadius: 5,
                padding: 15,
                margin: 30,
                width: 100,
                alignItems: "center",
              }}
            >
              <AntDesign name="check" size={30} color={Colors.bronze12} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 15,
                margin: 30,
                width: 100,
                backgroundColor: Colors.bronze8,
                alignItems: "center",
                borderRadius: 5,
              }}
            >
              <Entypo name="cross" size={30} color={Colors.bronze12} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.deleteAllItem}
        onPress={() => setModalDeleteAll(true)}
      >
        <Text style={styles.textItemDelete}>Supprimer tous les produits</Text>
        <Entypo name="trash" size={24} color="darkred" />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalDeleteAll}>
        <View
          style={{
            backgroundColor: Colors.bronze4,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Text
            style={{
              color: Colors.bronze11,
              fontSize: 30,
              fontFamily: "AmaticBold",
              width: 200,
              marginBottom: 20,
              marginHorizontal: "auto",
              textAlign: "center",
            }}
          >
            Etes vous sur de vouloir supprimer TOUS les produits de la liste
          </Text>
          <TouchableOpacity
            style={styles.confirmationButton}
            onPress={handleDeleteAllItem}
          >
            <Text style={styles.confirmationBtnText}>Oui</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmationButton}
            onPress={() => setModalDeleteAll(false)}
          >
            <Text style={styles.confirmationBtnText}>non</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
