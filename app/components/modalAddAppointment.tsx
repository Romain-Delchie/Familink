import React, { useState, useContext, useEffect } from "react";
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
import { setItem } from "expo-secure-store";

interface ModalAddAppointmentProps {
  onClose: () => void;
  setRefresh: (value: boolean) => void;
  setAgendaKey: (value: (prevKey: number) => number) => void;
  setItems: (value: any) => void;
}

export default function ModalAddAppointment({
  onClose,
  setRefresh,
  setAgendaKey,
  setItems,
}: ModalAddAppointmentProps) {
  const { family, updateFamily } = useContext(AppContext);
  const [date, setDate] = useState(new Date());
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [startOrEnd, setStartOrEnd] = useState("");
  const [mode, setMode] = useState<
    "date" | "time" | "datetime" | "countdown" | undefined
  >(undefined);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [instruction, setInstruction] = useState("");
  const [inputStates, setInputStates] = useState({
    input1: false,
    input2: false,
  });
  const [error, setError] = useState(false);
  const { user } = useUser();

  const handleFocus = (inputName: string) => {
    setError(false);
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [inputName]: true,
    }));
  };

  const handleBlur = (inputName: string) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [inputName]: false,
    }));
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setError(false);
    setShow(false);
    if (selectedDate) {
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
    }
  };

  const showMode = (
    currentMode: "date" | "time" | "datetime" | "countdown"
  ) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
    setStartOrEnd("");
  };

  const showTimepicker = (which: string) => {
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
        author: user?.imageUrl,
        family: family?.documentId,
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
      API.createEvent(appointment)
        .then((response) => {
          setAgendaKey((prevKey) => prevKey + 1);
          if (family) {
            updateFamily({
              ...family,
              events: [...family.events, response.data.data],
            });
          }

          onClose(); // Fermez la modal
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la requête API :",
            error.response.message
          );
        });
    }
  };
  const styles = StyleSheet.create({
    TouchIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 5,
      padding: 15,
      width: 300,
      fontSize: 18,
      color: Colors.bronze11,
      fontFamily: "AmaticBold",
    },
    textInside: {
      width: 200,
      fontSize: 18,
      color: Colors.bronze11,
      marginRight: 10,
      fontFamily: "AmaticBold",
    },
    btnCross: {
      position: "absolute",
      top: 50,
      right: 20,
      borderRadius: 50,
    },
    btnValContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    btnValidate: {
      backgroundColor: Colors.bronze10,
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
      backgroundColor: Colors.bronze10,
      alignItems: "center",
      borderRadius: 5,
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
        backgroundColor: Colors.bronze2,
        paddingBottom: 50,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontFamily: "BowlbyOne",
          color: Colors.bronze11,
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
          onPress={handleAddAppointment}
          style={styles.btnValidate}
        >
          <AntDesign name="check" size={30} color="rgba(88, 254, 88, 0.8)" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.btnClose}>
          <Entypo name="cross" size={30} color="rgba(159, 73, 79, 0.8)" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.btnCross}>
        <Octicons name="x" size={40} color={Colors.bronze9} />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      <Text style={{ color: "red" }}>
        {error ? "Les 4 premiers champs sont obligatoires" : ""}
      </Text>
    </View>
  );
}
