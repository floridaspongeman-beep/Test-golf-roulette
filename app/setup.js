import { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import GameScreen from "../components/GameScreen";

export default function Setup() {
  const [holes, setHoles] = useState(9);
  const [names, setNames] = useState(["You", "Player 2"]);
  const [started, setStarted] = useState(false);

  if (started) return <GameScreen holes={holes} names={names} />;

  const add = () => {
    if (names.length < 4) setNames([...names, `Player ${names.length + 1}`]);
  };

  const update = (value, index) => {
    setNames(names.map((name, i) => (i === index ? value : name)));
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <View style={s.headerRow}>
          <View>
            <Text style={s.brand}>GOLF ROULETTE</Text>
            <Text style={s.kicker}>NEW GAME</Text>
          </View>
          <Text style={s.mark}>GR</Text>
        </View>

        <Text style={s.title}>Set the table.</Text>
        <Text style={s.subtitle}>Pick your players, choose the round, then let the game decide the rest.</Text>

        <Text style={s.section}>PLAYERS</Text>
        {names.map((name, i) => (
          <View key={i} style={s.playerRow}>
            <View style={s.number}><Text style={s.numberText}>0{i + 1}</Text></View>
            <TextInput
              value={name}
              onChangeText={(value) => update(value, i)}
              placeholder={`Player ${i + 1}`}
              placeholderTextColor="#5d6962"
              style={s.input}
              maxLength={18}
            />
          </View>
        ))}

        {names.length < 4 && (
          <Pressable onPress={add} style={s.add}>
            <Text style={s.addText}>+ ADD PLAYER</Text>
          </Pressable>
        )}

        <Text style={[s.section, { marginTop: 27 }]}>ROUND LENGTH</Text>
        <View style={s.row}>
          {[9, 18].map((value) => (
            <Pressable
              key={value}
              onPress={() => setHoles(value)}
              style={[s.choice, holes === value && s.choiceOn]}
            >
              <Text style={[s.choiceNumber, holes === value && s.choiceNumberOn]}>{value}</Text>
              <Text style={[s.choiceText, holes === value && s.choiceTextOn]}>HOLES</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[s.section, { marginTop: 27 }]}>GAME MODE</Text>
        <View style={s.mode}>
          <View style={s.modeIcon}><Text style={s.modeIconText}>✦</Text></View>
          <View style={{ flex: 1 }}>
            <View style={s.modeTitleRow}>
              <Text style={s.modeTitle}>CHAOS</Text>
              <Text style={s.modeLive}>READY</Text>
            </View>
            <Text style={s.modeText}>Random golf challenges, rotating players, and a little friendly pressure.</Text>
          </View>
        </View>

        <Pressable style={({ pressed }) => [s.primary, pressed && s.pressed]} onPress={() => setStarted(true)}>
          <Text style={s.primaryText}>START ROULETTE</Text>
          <Text style={s.primaryArrow}>→</Text>
        </Pressable>
        <Text style={s.footer}>{names.length} PLAYERS  •  {holes} HOLES  •  CHAOS MODE</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#070907" },
  container: { width: "100%", maxWidth: 620, alignSelf: "center", paddingHorizontal: 22, paddingTop: 18, paddingBottom: 38 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#7a867f", fontSize: 9, fontWeight: "900", letterSpacing: 2.5, marginBottom: 4 },
  kicker: { color: "#c9a762", fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  mark: { color: "#b8d86a", fontSize: 22, fontWeight: "900", letterSpacing: -2 },
  title: { color: "#f3efe5", fontSize: 35, fontWeight: "900", marginTop: 27, letterSpacing: -0.6 },
  subtitle: { color: "#707c75", fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 28, maxWidth: 470 },
  section: { color: "#8b978f", fontSize: 9, fontWeight: "900", letterSpacing: 2, marginBottom: 11 },
  playerRow: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
  number: { width: 34, height: 52, borderRadius: 12, backgroundColor: "#0d130f", borderWidth: 1, borderColor: "#202b24", alignItems: "center", justifyContent: "center", marginRight: 9 },
  numberText: { color: "#69756e", fontSize: 9, fontWeight: "900" },
  input: { flex: 1, height: 52, backgroundColor: "#101612", borderWidth: 1, borderColor: "#28342d", borderRadius: 13, paddingHorizontal: 15, color: "#f3efe5", fontSize: 15, fontWeight: "700" },
  add: { height: 42, alignItems: "center", justifyContent: "center" },
  addText: { color: "#b8d86a", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  row: { flexDirection: "row", gap: 10 },
  choice: { flex: 1, minHeight: 76, borderRadius: 15, borderWidth: 1, borderColor: "#28342d", backgroundColor: "#0d130f", alignItems: "center", justifyContent: "center" },
  choiceOn: { backgroundColor: "#b8d86a", borderColor: "#b8d86a" },
  choiceNumber: { color: "#f3efe5", fontSize: 24, fontWeight: "900" },
  choiceNumberOn: { color: "#09100c" },
  choiceText: { color: "#68756e", fontSize: 9, fontWeight: "900", letterSpacing: 1.4, marginTop: 2 },
  choiceTextOn: { color: "#263120" },
  mode: { flexDirection: "row", alignItems: "center", backgroundColor: "#101612", borderRadius: 16, padding: 17, borderWidth: 1, borderColor: "#28342d" },
  modeIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#1a241d", borderWidth: 1, borderColor: "#334038", alignItems: "center", justifyContent: "center", marginRight: 13 },
  modeIconText: { color: "#d5b46b", fontSize: 19 },
  modeTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modeTitle: { color: "#f3efe5", fontSize: 15, fontWeight: "900", letterSpacing: 0.5 },
  modeLive: { color: "#b8d86a", fontSize: 8, fontWeight: "900", letterSpacing: 1.2 },
  modeText: { color: "#707c75", fontSize: 12, lineHeight: 18, marginTop: 4, paddingRight: 5 },
  primary: { height: 58, borderRadius: 15, backgroundColor: "#b8d86a", marginTop: 25, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  primaryText: { color: "#09100c", fontSize: 13, fontWeight: "900", letterSpacing: 1.8 },
  primaryArrow: { color: "#09100c", fontSize: 21, marginLeft: 10, marginTop: -2 },
  footer: { color: "#4e5b53", textAlign: "center", fontSize: 8, fontWeight: "900", letterSpacing: 1.2, marginTop: 15 }
});
