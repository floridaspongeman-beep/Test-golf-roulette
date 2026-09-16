import React, { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Animated, Easing } from "react-native";

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

export default function GameScreen() {
  const [hole, setHole] = useState(1);
  const [challenge, setChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setChallenge(null);
    rotation.setValue(0);

    Animated.timing(rotation, {
      toValue: 1,
      duration: 1150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
      setSpinning(false);
    });
  };

  const nextHole = () => {
    setScore((value) => value + (challenge ? challenge[2] : 0));
    setChallenge(null);
    setHole((value) => (value >= 9 ? 1 : value + 1));
  };

  const wheelSpin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1080deg"]
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <View>
            <Text style={styles.brand}>GOLF ROULETTE</Text>
            <Text style={styles.hole}>HOLE {hole} <Text style={styles.muted}>/ 9</Text></Text>
          </View>
          <View style={styles.modePill}>
            <View style={styles.liveDot} />
            <Text style={styles.mode}>CHAOS</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progress, { width: `${(hole / 9) * 100}%` }]} />
        </View>

        <View style={styles.wheelArea}>
          <View style={styles.pointer} />
          <Animated.View style={[styles.wheelOuter, { transform: [{ rotate: wheelSpin }] }]}>
            <View style={styles.wheelInner}>
              <Text style={styles.wheelMark}>GR</Text>
              <View style={styles.wheelLine} />
              <Text style={styles.wheelText}>{spinning ? "SPINNING" : challenge ? "DRAWN" : "READY"}</Text>
            </View>
          </Animated.View>
        </View>

        {!challenge ? (
          <View style={styles.center}>
            <Text style={styles.eyebrow}>{spinning ? "LET FATE DECIDE" : "THE NEXT CHALLENGE"}</Text>
            <Text style={styles.prompt}>{spinning ? "NO BACKING OUT." : "WHAT'S YOUR MOVE?"}</Text>
            <Text style={styles.sub}>{spinning ? "The wheel is choosing your fate..." : "One spin. One challenge. Play it."}</Text>
            <Pressable style={[styles.spinButton, spinning && styles.spinButtonOff]} onPress={spin} disabled={spinning}>
              <Text style={styles.spinText}>{spinning ? "SPINNING..." : "SPIN THE WHEEL"}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.eyebrow}>CHALLENGE DRAWN</Text>
              <Text style={styles.holeTag}>HOLE {hole}</Text>
            </View>
            <Text style={styles.challenge}>{challenge[0]}</Text>
            <Text style={styles.desc}>{challenge[1]}</Text>
            <View style={styles.pointsRow}>
              <Text style={styles.pointsLabel}>ROULETTE POINTS</Text>
              <Text style={styles.points}>+{challenge[2]}</Text>
            </View>
            <Pressable style={styles.done} onPress={nextHole}>
              <Text style={styles.doneText}>CHALLENGE COMPLETE</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.scoreBox}>
          <View>
            <Text style={styles.scoreLabel}>YOUR SCORE</Text>
            <Text style={styles.scoreHint}>Roulette points</Text>
          </View>
          <Text style={styles.score}>{score}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#070b09" },
  container: { flex: 1, padding: 22, alignItems: "center", maxWidth: 620, width: "100%", alignSelf: "center" },
  top: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#68756e", fontSize: 9, fontWeight: "900", letterSpacing: 2.5, marginBottom: 5 },
  hole: { color: "#f5f6f3", fontSize: 22, fontWeight: "900", letterSpacing: 0.5 },
  muted: { color: "#4e5a54", fontSize: 14 },
  modePill: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 8, paddingHorizontal: 11, borderRadius: 20, backgroundColor: "#101713", borderWidth: 1, borderColor: "#253129" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#b8e06b" },
  mode: { color: "#b8e06b", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  progressTrack: { width: "100%", height: 3, backgroundColor: "#18211c", borderRadius: 2, marginTop: 18 },
  progress: { height: 3, backgroundColor: "#b8e06b", borderRadius: 2 },
  wheelArea: { width: 245, height: 245, alignItems: "center", justifyContent: "center", marginVertical: 25 },
  pointer: { position: "absolute", top: 1, zIndex: 5, width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 13, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#b8e06b" },
  wheelOuter: { width: 210, height: 210, borderRadius: 105, borderWidth: 2, borderColor: "#39473e", backgroundColor: "#0d1511", alignItems: "center", justifyContent: "center", shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  wheelInner: { width: 174, height: 174, borderRadius: 87, borderWidth: 1, borderColor: "#26342c", alignItems: "center", justifyContent: "center", backgroundColor: "#111b15" },
  wheelMark: { color: "#b8e06b", fontSize: 38, fontWeight: "900", letterSpacing: -3 },
  wheelLine: { width: 32, height: 1, backgroundColor: "#435148", marginVertical: 9 },
  wheelText: { color: "#7e8c84", fontSize: 9, fontWeight: "900", letterSpacing: 3 },
  center: { width: "100%", alignItems: "center" },
  eyebrow: { color: "#91a66d", fontSize: 9, fontWeight: "900", letterSpacing: 2.3, textAlign: "center" },
  prompt: { color: "#f5f6f3", fontSize: 25, fontWeight: "900", letterSpacing: 0.3, marginTop: 7, textAlign: "center" },
  sub: { color: "#69766f", fontSize: 13, marginTop: 7, marginBottom: 17, textAlign: "center" },
  spinButton: { width: "100%", maxWidth: 360, height: 58, borderRadius: 15, backgroundColor: "#b8e06b", alignItems: "center", justifyContent: "center", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
  spinButtonOff: { opacity: 0.55 },
  spinText: { color: "#09100c", fontSize: 13, fontWeight: "900", letterSpacing: 1.8 },
  card: { width: "100%", backgroundColor: "#101713", borderRadius: 20, padding: 21, borderWidth: 1, borderColor: "#29362f", shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  holeTag: { color: "#65736b", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  challenge: { color: "#f5f6f3", fontWeight: "900", fontSize: 31, letterSpacing: 0.5, textAlign: "center", marginVertical: 13 },
  desc: { color: "#a1aca5", fontSize: 14, lineHeight: 21, textAlign: "center" },
  pointsRow: { marginTop: 19, paddingTop: 15, borderTopWidth: 1, borderTopColor: "#253129", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pointsLabel: { color: "#66746c", fontSize: 9, fontWeight: "900", letterSpacing: 1.3 },
  points: { color: "#b8e06b", fontSize: 23, fontWeight: "900" },
  done: { marginTop: 17, height: 52, borderRadius: 13, backgroundColor: "#b8e06b", width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row" },
  doneText: { color: "#09100c", fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  arrow: { color: "#09100c", fontSize: 20, fontWeight: "700", marginLeft: 10 },
  scoreBox: { width: "100%", marginTop: 17, backgroundColor: "#0d1410", borderRadius: 15, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#1e2923" },
  scoreLabel: { color: "#c3cbc6", fontSize: 10, fontWeight: "900", letterSpacing: 1.3 },
  scoreHint: { color: "#59665f", fontSize: 10, marginTop: 3 },
  score: { color: "#b8e06b", fontWeight: "900", fontSize: 28 }
});
