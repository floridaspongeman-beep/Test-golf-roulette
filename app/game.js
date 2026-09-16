import { useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const challenges = [
  ["ONE CLUB", "Use only one club for this hole.", 3],
  ["NO DRIVER", "Driver is banned. Pick another club.", 2],
  ["SILENT HOLE", "No advice until everyone is finished.", 2],
  ["PARTNER PICKS", "Another player chooses your tee-shot club.", 3],
  ["DOUBLE POINTS", "This challenge is worth double.", 4],
  ["NO PRACTICE", "No practice swings before your first shot.", 2],
  ["GROUP DECIDES", "The group chooses your club off the tee.", 3],
  ["CLUB DOWN", "Play every approach one club shorter.", 3],
  ["FIRST PUTT", "You must putt first on this hole.", 2],
  ["CHAOS CARD", "Choose another player to receive a challenge too.", 4]
];

export default function Game() {
  const params = useLocalSearchParams();
  const list = String(params.players || "You|Player 2").split("|").filter(Boolean);
  const total = Number(params.holes) || 9;
  const [hole, setHole] = useState(1);
  const [challenge, setChallenge] = useState(null);
  const [scores, setScores] = useState(() => list.map(() => 0));

  const spin = () => {
    const picked = challenges[Math.floor(Math.random() * challenges.length)];
    setChallenge(picked);
  };

  const finishHole = () => {
    const gain = challenge ? challenge[2] : 0;
    const next = scores.map((score, i) => score + (i === 0 ? gain : 0));
    setScores(next);

    if (hole >= total) {
      router.replace({
        pathname: "/results",
        params: { players: list.join("|"), scores: next.join("|"), holes: String(total) }
      });
      return;
    }

    setHole(hole + 1);
    setChallenge(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.top}>
          <Text style={styles.hole}>HOLE {hole} / {total}</Text>
          <Text style={styles.mode}>CHAOS MODE</Text>
        </View>

        <View style={styles.wheel}>
          <Text style={styles.emoji}>🎰</Text>
          <Text style={styles.spinLabel}>{challenge ? "RESULT" : "SPIN"}</Text>
        </View>

        {!challenge ? (
          <View style={styles.center}>
            <Text style={styles.prompt}>WHAT'S NEXT?</Text>
            <Text style={styles.sub}>Let roulette decide.</Text>
            <Pressable style={styles.spinButton} onPress={spin}>
              <Text style={styles.spinText}>SPIN</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.kicker}>YOUR CHALLENGE</Text>
            <Text style={styles.challenge}>{challenge[0]}</Text>
            <Text style={styles.desc}>{challenge[1]}</Text>
            <Text style={styles.points}>+{challenge[2]} ROULETTE POINTS</Text>
            <Pressable style={styles.done} onPress={finishHole}>
              <Text style={styles.doneText}>{hole >= total ? "FINISH ROUND" : "HOLE COMPLETE →"}</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.players}>
          {list.map((name, i) => (
            <View style={styles.player} key={`${name}-${i}`}>
              <Text style={styles.playerName}>{name}</Text>
              <Text style={styles.playerScore}>{scores[i]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#08110d" },
  container: { flexGrow: 1, padding: 22, alignItems: "center", minHeight: "100%" },
  top: { width: "100%", flexDirection: "row", justifyContent: "space-between" },
  hole: { color: "#fff", fontWeight: "900", fontSize: 15 },
  mode: { color: "#b8e06b", fontWeight: "900", fontSize: 10, letterSpacing: 1 },
  wheel: { width: 210, height: 210, borderRadius: 105, borderWidth: 8, borderColor: "#b8e06b", backgroundColor: "#111d17", alignItems: "center", justifyContent: "center", marginVertical: 55 },
  emoji: { fontSize: 62 },
  spinLabel: { color: "#b8e06b", fontWeight: "900", letterSpacing: 3, marginTop: 4 },
  center: { width: "100%", alignItems: "center" },
  prompt: { color: "#fff", fontSize: 27, fontWeight: "900" },
  sub: { color: "#8d9991", marginTop: 6, marginBottom: 18 },
  spinButton: { width: 190, height: 58, borderRadius: 30, backgroundColor: "#b8e06b", alignItems: "center", justifyContent: "center" },
  spinText: { color: "#08110d", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  card: { width: "100%", backgroundColor: "#111d17", borderRadius: 20, padding: 22, alignItems: "center", borderWidth: 1, borderColor: "#2a3b31" },
  kicker: { color: "#8fae59", fontWeight: "900", letterSpacing: 2, fontSize: 11 },
  challenge: { color: "#fff", fontWeight: "900", fontSize: 32, textAlign: "center", marginVertical: 10 },
  desc: { color: "#adb8b0", fontSize: 15, textAlign: "center", lineHeight: 21 },
  points: { color: "#b8e06b", fontWeight: "900", fontSize: 11, marginTop: 15, backgroundColor: "#1b2a20", paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20 },
  done: { marginTop: 18, padding: 15, borderRadius: 13, backgroundColor: "#b8e06b", width: "100%", alignItems: "center" },
  doneText: { color: "#08110d", fontWeight: "900" },
  players: { width: "100%", marginTop: 30 },
  player: { backgroundColor: "#111d17", borderRadius: 11, padding: 11, flexDirection: "row", justifyContent: "space-between", marginBottom: 7 },
  playerName: { color: "#cbd4ce" },
  playerScore: { color: "#b8e06b", fontWeight: "900" }
});

export function ErrorBoundary({ error }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#08110d", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900", marginBottom: 12 }}>Golf Roulette hit an error</Text>
      <Text style={{ color: "#adb8b0", textAlign: "center" }}>{String(error?.message || "Please reload and try again.")}</Text>
    </View>
  );
}
