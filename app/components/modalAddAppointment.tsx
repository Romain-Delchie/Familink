import React, { useState, useContext } from "react";
import AppContext from "../context/appContext";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import API from "../services/API";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";

export default function ModalAddAppointment({
  onClose,
  setRefresh,
  setAgendaKey,
}) {
  const { family, updateFamily } = useContext(AppContext);
  const [date, setDate] = useState(new Date());
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [startOrEnd, setStartOrEnd] = useState("");
  const [mode, setMode] = useState();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [inputStates, setInputStates] = useState({
    input1: false,
    input2: false,
  });
  const [error, setError] = useState(false);
  const { user } = useUser();

  const handleFocus = (inputName) => {
    setError(false);
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [inputName]: true,
    }));
  };

  const handleBlur = (inputName) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [inputName]: false,
    }));
  };

  const onChange = (event, selectedDate) => {
    setError(false);
    setShow(false);
    const currentDate = selectedDate;
    setDate(currentDate);
    if (startOrEnd == "start") {
      setStartHour(
        (selectedDate.getHours() < 10 ? "0" : "") +
          selectedDate.getHours() +
          ":" +
          (selectedDate.getMinutes() < 10 ? "0" : "") +
          selectedDate.getMinutes()
      );
    } else if (startOrEnd == "end") {
      setEndHour(
        (selectedDate.getHours() < 10 ? "0" : "") +
          selectedDate.getHours() +
          ":" +
          (selectedDate.getMinutes() < 10 ? "0" : "") +
          selectedDate.getMinutes()
      );
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
    setStartOrEnd("");
  };

  const showTimepicker = (which) => {
    showMode("time");
    if (which == "start") {
      setStartOrEnd("start");
    } else if (which == "end") {
      setStartOrEnd("end");
    }
  };

  const handleAddAppointment = () => {
    const appointment = {
      data: {
        name: name,
        begin: startHour + ":00",
        end: endHour + ":00",
        instruction: instruction,
        date: date,
        author: user.imageUrl,
        //TO DO : add id logic
        calend_my: 1,
      },
    };

    setRefresh(true);
    if (
      appointment.data.name === "" ||
      appointment.data.begin === ":00" ||
      appointment.data.end === ":00"
    ) {
      setError(true);
      return;
    } else {
      updateFamily({ ...family, events: [...family.events, appointment] });
      API.addEvent(appointment)
        .then((response) => {
          setAgendaKey((prevKey) => prevKey + 1);
          onClose(); // Fermez la modal
        })
        .catch((error) => {
          console.error("Erreur lors de la requête API :", error.response);
        });
    }
  };
  const styles = StyleSheet.create({
    input: {
      height: 40,
      width: 280,
      margin: 12,
      borderWidth: 1,
      backgroundColor: Colors.bronze5,
    },

    TouchIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 5,
      padding: 15,
      margin: 5,
      width: 300,
      color: Colors.bronze11,
    },
    textInside: {
      width: 200,
      fontSize: 15,
      color: Colors.bronze11,
      marginRight: 10,
    },
    btnCross: {
      position: "absolute",
      top: 50,
      right: 20,
      color: Colors.bronze11,
      borderRadius: 50,
    },
    btnValContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    btnValidate: {
      backgroundColor: "green",
      borderRadius: 5,
      padding: 15,
      margin: 30,
      width: 100,
      alignItems: "center",
    },
    btnClose: {
      padding: 15,
      margin: 30,
      width: 100,
      backgroundColor: "red",
      alignItems: "center",
      borderRadius: 5,
      color: Colors.bronze11,
    },
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.bronze3,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: Colors.bronze11,
          marginBottom: 60,
        }}
      >
        Ajouter un RDV
      </Text>
      <TouchableOpacity style={styles.TouchIcon} onPress={showDatepicker}>
        <Text style={styles.textInside}>
          {date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear()}
        </Text>
        <Octicons name="pencil" size={24} color={Colors.bronze11} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TouchIcon}
        onPress={() => showTimepicker("start")}
      >
        <Text style={styles.textInside}>{"Heure de début: " + startHour}</Text>
        <Octicons name="pencil" size={24} color={Colors.bronze11} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TouchIcon}
        onPress={() => showTimepicker("end")}
      >
        <Text style={styles.textInside}>{"Heure de fin: " + endHour}</Text>
        <Octicons name="pencil" size={24} color={Colors.bronze11} />
      </TouchableOpacity>
      <TextInput
        style={[
          styles.TouchIcon,
          {
            backgroundColor: inputStates.input1
              ? Colors.bronze5
              : "transparent",
          },
        ]}
        placeholder="Nom du rendez-vous"
        placeholderTextColor={
          inputStates.input2 ? Colors.bronze12 : Colors.bronze11
        }
        onChangeText={(text) => setName(text)}
        onFocus={() => handleFocus("input1")}
        onBlur={() => handleBlur("input1")}
      />
      <TextInput
        style={[
          styles.TouchIcon,
          {
            backgroundColor: inputStates.input2
              ? Colors.bronze5
              : "transparent",
          },
        ]}
        placeholder="instruction"
        placeholderTextColor={
          inputStates.input2 ? Colors.bronze12 : Colors.bronze11
        }
        onChangeText={(text) => setInstruction(text)}
        onFocus={() => handleFocus("input2")}
        onBlur={() => handleBlur("input2")}
      />
      <View style={styles.btnValContainer}>
        <TouchableOpacity
          title="Ajouter le rendez-vous"
          onPress={handleAddAppointment}
          style={styles.btnValidate}
        >
          <AntDesign name="check" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.btnClose}>
          <Entypo name="cross" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.btnCross}>
        <Octicons name="x" size={40} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
          style={{ textColor: Colors.bronze3 }}
        />
      )}
      <Text style={{ color: "red" }}>
        {error ? "Les 4 premiers champs sont obligatoires" : ""}
      </Text>
    </View>
  );
}
