import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";


const Header = ({ token }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Token-ийг ашиглан хэрэглэгчийн нэрийг авах
    const fetchUserName = async () => {
      if (token) {
        try {
          // Fetch request-ээр хэрэглэгчийн мэдээллийг авах
          const response = await fetch("http://localhost:3000/getusers", {
            headers: { token }
          });
          const data = await response.json();
          setUserName(data.name); // API-аас хэрэглэгчийн нэрийг хадгалах
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };
    fetchUserName();
  }, [token]);

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>FXNEWS</Text>
        <Text style={styles.welcomeMessage}>
          {userName ? `Тавтай морил, ${userName}` : "Тавтай Морил Билгүүн"}
        </Text>
      </View>

      {/* Help Icon Button */}
      <TouchableOpacity style={styles.helpButton} onPress={() => alert("Help")}>
        <Image source={require("../../assets/images/question.png")} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  titleContainer: {
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textDecorationLine: "underline",
  },
  welcomeMessage: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  helpButton: {
    padding: 5,
    borderRadius: 15,
    borderColor: "#333",
    borderWidth: 1,
  },
});

export default Header;
