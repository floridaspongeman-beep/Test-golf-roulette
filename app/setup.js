import { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { router } from "expo-router";

export default function Setup() {
  const [holes, setHoles] = useState(9);
  const [names, setNames] = useState(["You", "Player 2"]);

  const add = () => {
    if (names.length < 4) setNames([...names, `Player ${names.length + 1}`]);
  };

  const update = (value, index) => {
    setNames(names.map((name, i) => (i === index ? value : name)));
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.kicker}>NEW GAME</Text>
        <Text style={s.title}>Who's playing?</Text>

        {names.map((name, i) => (
          <TextInput
            key={i}
            value={name}
            onChangeText={(value) => update(value, i)}
            placeholderTextColor="#68756d"
            style={s.input}
          />
        ))}

        {names.length < 4 && (
          <Pressable onPress={add} style={s.add}>
            <Text style={s.addText}>+ ADD PLAYER</Text>
          </Pressable>
        )}

        <Text style={[s.kicker, { marginTop: 28 }]}>ROUND</Text>
        <View style={s.row}>
          {[9, 18].map((value) => (
            <Pressable
              key={value}
              onPress={() => setHoles(value)}
              style={[s.choice, holes === value && s.choiceOn]}
            >
              <Text style={[s.choiceText, holes === value && s.choiceTextOn]}>
                {value} HOLES
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[s.kicker, { marginTop: 28 }]}>MODE</Text>
        <View style={s.mode}>
          <Text style={s.modeIcon}>😈</Text>
          <View>
            <Text style={s.modeTitle}>CHAOS</Text>
            <Text style={s.modeText}>Random challenges. Maximum regret.</Text>
          </View>
        </View>

        <Pressable style={s.primary} onPress={() => router.push("/game")}>
          <Text style={s.primaryText}>START ROULETTE  →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#08110d" },
  container: { padding: 24, paddingBottom: 40 },
  kicker: { color: "#8fae59", fontWeight: "900", letterSpacing: 2, fontSize: 11 },
  title: { color: "#fff", fontSize: 34, fontWeight: "900", marginVertical: 18 },
  input: { backgroundColor: "#111d17", borderWidth: 1, borderColor: "#293a30", borderRadius: 14, padding: 16, color: "#fff", fontSize: 16, marginBottom: 10 },
  add: { padding: 14, alignItems: "center" },
  addText: { color: "#b8e06b", fontWeight: "900" },
  row: { flexDirection: "row", gap: 10 },
  choice: { flex: 1, padding: 17, borderRadius: 14, borderWidth: 1, borderColor: "#293a30", alignItems: "center" },
  choiceOn: { backgroundColor: "#b8e06b", borderColor: "#b8e06b" },
  choiceText: { color: "#c6cec8", fontWeight: "900" },
  choiceTextOn: { color: "#09120d" },
  mode: { flexDirection: "row", gap: 14, backgroundColor: "#111d17", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#293a30", marginBottom: 30 },
  modeIcon: { fontSize: 30 },
  modeTitle: { color: "#fff", fontWeight: "900", fontSize: 17 },
  modeText: { color: "#89958e", marginTop: 4 },
  primary: { padding: 18, borderRadius: 16, backgroundColor: "#b8e06b", alignItems: "center" },
  primaryText: { color: "#09120d", fontWeight: "900", letterSpacing: 1 }
});
