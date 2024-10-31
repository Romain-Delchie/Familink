import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AppContext from "../context/appContext";
import Colors from "@/constants/Colors";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Calendar as CalendarComponent,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import XDate from "xdate";
import API from "../services/API";
import ModalAddAppointment from "../components/modalAddAppointment";

const calendar = () => {
  const { family, updateFamily } = useContext(AppContext);
  const [items, setItems] = useState<{ [key: string]: any[] }>({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new XDate());
  const [isActionItemVisible, setIsActionItemVisible] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [onlyOneDay, setOnlyOneDay] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [agendaKey, setAgendaKey] = useState(0);
  LocaleConfig.locales["fr"] = {
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ],
    monthNamesShort: [
      "Janv.",
      "Févr.",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juil.",
      "Août",
      "Sept.",
      "Oct.",
      "Nov.",
      "Déc.",
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ],
    dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
    today: "Aujourd'hui",
  };
  LocaleConfig.defaultLocale = "fr";

  useEffect(() => {
    const newItems: { [key: string]: any[] } = {};
    family &&
      family.events
        ?.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.begin}`);
          const timeB = new Date(`1970-01-01T${b.begin}`);
          return timeA.getTime() - timeB.getTime();
        })
        .map((event) => {
          newItems[event.date] = [
            ...(newItems[event.date] || []),
            {
              id: event.documentId,
              name: event.name,
              begin: event.begin,
              end: event.end,
              instruction: event.instruction,
              author: event.author,
            },
          ];
        });
    setItems(newItems);
    setIsLoading(false);
  }, [family]);

  const addAppointment = (date, appointment) => {
    const newItems = { ...items };
    newItems[date] = [...(newItems[date] || []), appointment];
    setItems(newItems);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleActionItem = () => {
    setIsActionItemVisible((prev) => !prev);
  };

  const handleDeleteItem = (id) => {
    API.deleteEvent(id)
      .then((res) => {
        setAgendaKey(agendaKey + 1);
        setIconVisible(false);
      })
      .catch((err) => console.error(err.message));
  };

  return (
    <View style={{ flex: 1, padding: 30, backgroundColor: Colors.bronze2 }}>
      <Agenda
        theme={{
          // backgroundColor: Colors.bronze2,
          calendarBackground: Colors.bronze1,
          textSectionTitleColor: Colors.bronze11,
          textSectionTitleDisabledColor: Colors.bronze11,
          selectedDayBackgroundColor: Colors.bronze11,
          selectedDayTextColor: Colors.bronze1,
          todayTextColor: Colors.bronze6,
          dayTextColor: Colors.bronze11,
          textDisabledColor: Colors.bronze11,
          dotColor: Colors.bronze6,
          selectedDotColor: Colors.bronze11,
          arrowColor: Colors.bronze6,
          disabledArrowColor: Colors.bronze11,
          monthTextColor: Colors.bronze11,
          // indicatorColor: Colors.bronze6,
          textDayFontFamily: "AmaticBold",
          textMonthFontFamily: "AmaticBold",
          textDayHeaderFontFamily: "AmaticBold",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
          agendaKnobColor: Colors.bronze8,
          reservationsBackgroundColor: Colors.bronze1,
          // agendaTodayColor: 'Colors.bronze8',
          agendaDayNumColor: Colors.bronze12,
          agendaDayTextColor: Colors.bronze11,
        }}
        key={agendaKey}
        selectedDay={selectedDate}
        items={items}
        // Personnalisez le format de la date
        rowHasChanged={(r1, r2) => r1.name !== r2.name}
        // Affiche le calendrier à partir de la date actuelle
        // et pour une année à l'avenir
        pastScrollRange={10}
        futureScrollRange={12}
        // Callback that fires when the calendar is opened or closed
        onCalendarToggled={(calendarOpened) => {
          console.log(calendarOpened);
        }}
        // Callback that gets called on day press
        onDayPress={(day) => {
          setSelectedDate(XDate(day.dateString));
        }}
        // Callback that gets called when day changes while scrolling agenda list
        onDayChange={(day) => {}}
        firstDay={1}
        selected={selectedDate}
        // Fonction pour rendre un élément de rendez-vous
        refreshing={false}
        showWeekNumbers={true}
        showClosingKnob={true}
        showOnlySelectedDayItems={onlyOneDay}
        onRefresh={() => {
          updateFamily({ ...family, events: events });
          setIconVisible(false);
          setAgendaKey(agendaKey + 1);
        }}
        renderEmptyData={() => {
          return <View />;
        }}
        // renderDay={(day, item) => {
        //   return <View />;
        // }}
        renderItem={(item) => {
          return (
            <View style={{ backgroundColor: Colors.bronze1 }}>
              <TouchableOpacity
                style={styles.allRdv}
                onLongPress={() => {
                  setIconVisible(true);
                  setAgendaKey(agendaKey + 1);
                }}
                delayLongPress={100}
              >
                <View style={styles.RdvContainer}>
                  <View style={styles.hours}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.bronze10,
                        fontFamily: "BowlbyOne",
                      }}
                    >
                      {moment(item.begin, "HH:mm:ss.SSS").format("HH:mm")}
                      {" - "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: Colors.bronze9,
                        fontFamily: "BowlbyOne",
                      }}
                    >
                      {moment(item.end, "HH:mm:ss.SSS").format("HH:mm")}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "BowlbyOne",
                      fontSize: 12,
                      color: Colors.bronze12,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "AmaticBold",
                      color: Colors.bronze11,
                    }}
                  >
                    {item?.instruction}
                  </Text>
                </View>
                <Image
                  source={{
                    uri: item.author,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 100,
                    position: "absolute",
                    right: 15,
                    top: 10,
                  }}
                />
                {iconVisible && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 20,
                      alignItems: "flex-start",
                      height: "100%",
                      marginTop: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleDeleteItem(item.documentId)}
                    >
                      <MaterialIcons
                        name="delete"
                        size={20}
                        color={Colors.bronze11}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <TouchableOpacity style={styles.AddBtn} onPress={toggleModal}>
        <Text style={styles.addBtnText}>Ajouter un rendez-vous</Text>
      </TouchableOpacity>
      <View style={styles.onlyOneDayContainer}>
        <TouchableOpacity
          style={
            onlyOneDay ? styles.btnNormal : [styles.btnPress, styles.btnNormal]
          }
          onPress={() => setOnlyOneDay(false)}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              fontFamily: "BowlbyOne",
              color: Colors.bronze11,
            }}
          >
            Toutes les dates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            onlyOneDay ? [styles.btnPress, styles.btnNormal] : styles.btnNormal
          }
          onPress={() => setOnlyOneDay(true)}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              fontFamily: "BowlbyOne",
              color: Colors.bronze11,
            }}
          >
            Une seule date
          </Text>
        </TouchableOpacity>
      </View>
      {isModalVisible && (
        <ModalAddAppointment
          setRefresh={setRefresh}
          onClose={toggleModal}
          setAgendaKey={setAgendaKey}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  allRdv: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    margin: 5,
    padding: 10,
    backgroundColor: Colors.bronze4,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  RdvContainer: {
    flex: 2,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  hours: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  TouchIcon: {
    flex: 1,
    alignItems: "flex-end",
    gap: 20,
    justifyContent: "space-between",
  },
  onlyOneDayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  AddBtn: {
    backgroundColor: Colors.bronze8,
    borderRadius: 5,
    padding: 15,
    marginVertical: 30,
    width: "100%",
    alignItems: "center",
  },
  addBtnText: {
    color: Colors.bronze12,
    fontSize: 16,
    fontFamily: "BowlbyOne",
  },
  btnNormal: {
    borderRadius: 5,
    height: 60,
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: Colors.bronze6,
  },
  btnPress: {
    borderColor: Colors.bronze11,
    borderWidth: 1,
  },
});

export default calendar;
