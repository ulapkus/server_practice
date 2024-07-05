import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, TextInput } from "react-native";

const API_URL = "http://localhost:3001";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = async () => {
    if (editingUser) {
      await updateUser();
    } else {
      await addUser();
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: "column",
        gap: 10,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 5,
        }}
      >
        <TextInput
          style={{ fontSize: 20 }}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={{ fontSize: 20 }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Text
          style={{
            borderWidth: 2,
            borderColor: "grey",
            borderRadius: 13,
            padding: 5,
          }}
          onPress={handleSubmit}
        >
          {editingUser ? "Update User" : "Add User"}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: "13%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {editingUser && (
          <Text
            style={{
              borderWidth: 2,
              borderColor: "grey",
              borderRadius: 10,
              padding: 3,
              width: "20%",
              textAlign: "center",
            }}
            onPress={() => {
              setEditingUser(null);
              setName("");
              setEmail("");
            }}
          >
            Cancel
          </Text>
        )}
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 0,
            }}
          >
            <Text style={{ fontSize: 20 }}>
              {item.name} ({item.email})
            </Text>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 0,
              }}
            >
              <Text
                style={{ fontSize: 14, color: "blue" }}
                onPress={() => startEditing(item)}
              >
                Edit
              </Text>

              <Text
                style={{ fontSize: 14, color: "red" }}
                onPress={() => deleteUser(item.id)}
              >
                Delete
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
