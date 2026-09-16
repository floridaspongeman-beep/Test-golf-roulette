import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";

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
  const [hole, setHole] = useState(1);
  const [challenge, setChallenge] = useState(null);
  const [score, setScore] = useState(0);

  const spin = () => {
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  const nextHole = () => {
    setScore((value) => value + (challenge ? challenge[2] : 0));
    setChallenge(null);
    setHole((value) => value >= 9 ? 1 : value + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.hole}>HOLE {hole} / 9</Text>
          <Text style={styles.mode}>CHAOS MODE</Text>
        </View>

        <View style={styles.wheel}>
          <Text style={styles.emoji}>{challenge ? "😈" : "🎰"}</Text>
          <Text style={styles.spinLabel}>{challenge ? "RESULT" : "READY"}</Text>
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
            <Pressable style={styles.done} onPress={nextHole}>
              <Text style={styles.doneText}>HOLE COMPLETE →</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>YOUR POINTS</Text>
          <Text style={styles.score}>{score}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#08110d" },
  container: { flex: 1, padding: 22, alignItems: "center" },
  top: { width: "100%", flexDirection: "row", justifyContent: "space-between" },
  hole: { color: "#fff", fontWeight: "900", fontSize: 15 },
  mode: { color: "#b8e06b", fontWeight: "900", fontSize: 10, letterSpacing: 1 },
  wheel: { width: 190, height: 190, borderRadius: 95, borderWidth: 8, borderColor: "#b8e06b", backgroundColor: "#111d17", alignItems: "center", justifyContent: "center", marginVertical: 38 },
  emoji: { fontSize: 58 },
  spinLabel: { color: "#b8e06b", fontWeight: "900", letterSpacing: 3, marginTop: 5 },
  center: { width: "100%", alignItems: "center" },
  prompt: { color: "#fff", fontSize: 27, fontWeight: "900" },
  sub: { color: "#8d9991", marginTop: 6, marginBottom: 18 },
  spinButton: { width: 190, height: 58, borderRadius: 30, backgroundColor: "#b8e06b", alignItems: "center", justifyContent: "center" },
  spinText: { color: "#08110d", fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  card: { width: "100%", backgroundColor: "#111d17", borderRadius: 20, padding: 22, alignItems: "center", borderWidth: 1, borderColor: "#2a3b31" },
  kicker: { color: "#8fae59", fontWeight: "900", letterSpacing: 2, fontSize: 11 },
  challenge: { color: "#fff", fontWeight: "900", fontSize: 30, textAlign: "center", marginVertical: 10 },
  desc: { color: "#adb8b0", fontSize: 15, textAlign: "center", lineHeight: 21 },
  points: { color: "#b8e06b", fontWeight: "900", fontSize: 11, marginTop: 15, backgroundColor: "#1b2a20", paddingVertical: 9, paddingHorizontal: 14, borderRadius: 20 },
  done: { marginTop: 18, padding: 15, borderRadius: 13, backgroundColor: "#b8e06b", width: "100%", alignItems: "center" },
  doneText: { color: "#08110d", fontWeight: "900" },
  scoreBox: { width: "100%", marginTop: 24, backgroundColor: "#111d17", borderRadius: 12, padding: 14, flexDirection: "row", justifyContent: "space-between" },
  scoreLabel: { color: "#9aa69e", fontWeight: "800" },
  score: { color: "#b8e06b", fontWeight: "900", fontSize: 18 }
});
