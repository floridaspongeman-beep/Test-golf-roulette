import React, { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Animated, Easing } from "react-native";

const challenges = [
  { title: "ONE CLUB", desc: "Use only one club for this hole.", points: 3, tag: "CLUB RULE" },
  { title: "NO DRIVER", desc: "Driver is banned. Pick another club.", points: 2, tag: "TEE BOX" },
  { title: "SILENT HOLE", desc: "No advice until everyone is finished.", points: 2, tag: "MENTAL GAME" },
  { title: "PARTNER PICKS", desc: "Another player chooses your tee-shot club.", points: 3, tag: "SOCIAL" },
  { title: "DOUBLE POINTS", desc: "This challenge is worth double.", points: 4, tag: "BONUS" },
  { title: "NO PRACTICE", desc: "No practice swings before your first shot.", points: 2, tag: "PRESSURE" },
  { title: "GROUP DECIDES", desc: "The group chooses your club off the tee.", points: 3, tag: "SOCIAL" },
  { title: "CLUB DOWN", desc: "Play every approach one club shorter.", points: 3, tag: "CLUB RULE" },
  { title: "FIRST PUTT", desc: "You must putt first on this hole.", points: 2, tag: "ON THE GREEN" },
  { title: "CHAOS CARD", desc: "Choose another player to receive a challenge too.", points: 4, tag: "CHAOS" }
];

export default function GameScreen({ holes = 9, names = ["You", "Player 2"] }) {
  const players = names.filter((name) => name.trim()).length ? names.filter((name) => name.trim()) : ["You"];
  const [hole, setHole] = useState(1);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const currentPlayer = players[playerIndex % players.length];

  const spin = () => {
    if (spinning || finished) return;
    setSpinning(true);
    setChallenge(null);
    rotation.setValue(0);
    Animated.timing(rotation, {
      toValue: 1,
      duration: 1100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(() => {
      setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
      setSpinning(false);
    });
  };

  const nextHole = () => {
    const newScore = score + (challenge ? challenge.points : 0);
    setScore(newScore);
    setChallenge(null);
    if (hole >= holes) {
      setFinished(true);
      return;
    }
    setHole((value) => value + 1);
    setPlayerIndex((value) => (value + 1) % players.length);
  };

  const restart = () => {
    setHole(1);
    setPlayerIndex(0);
    setChallenge(null);
    setScore(0);
    setFinished(false);
    setSpinning(false);
    rotation.setValue(0);
  };

  const wheelSpin = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "1080deg"] });

  if (finished) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.finishWrap}>
          <Text style={styles.brand}>GOLF ROULETTE</Text>
          <Text style={styles.finishEyebrow}>ROUND COMPLETE</Text>
          <Text style={styles.finishTitle}>That's a wrap.</Text>
          <Text style={styles.finishSub}>{holes} holes. {players.length} players. Zero excuses.</Text>
          <View style={styles.finalCard}>
            <Text style={styles.finalLabel}>FINAL ROULETTE SCORE</Text>
            <Text style={styles.finalScore}>{score.toString().padStart(2, "0")}</Text>
            <Text style={styles.finalCaption}>CHALLENGE POINTS</Text>
          </View>
          <Pressable style={styles.spinButton} onPress={restart}>
            <Text style={styles.spinText}>PLAY AGAIN</Text>
            <Text style={styles.spinArrow}>↗</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <View>
            <Text style={styles.brand}>GOLF ROULETTE</Text>
            <Text style={styles.hole}>HOLE {hole} <Text style={styles.muted}>/ {holes}</Text></Text>
          </View>
          <View style={styles.modePill}>
            <View style={styles.liveDot} />
            <Text style={styles.mode}>CHAOS MODE</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progress, { width: `${(hole / holes) * 100}%` }]} />
        </View>

        <View style={styles.playerBanner}>
          <Text style={styles.playerLabel}>UP NOW</Text>
          <Text style={styles.playerName}>{currentPlayer}</Text>
          <Text style={styles.playerCount}>PLAYER {(playerIndex % players.length) + 1} / {players.length}</Text>
        </View>

        <View style={styles.wheelArea}>
          <View style={styles.pointer} />
          <Animated.View style={[styles.wheelOuter, { transform: [{ rotate: wheelSpin }] }]}>
            <View style={styles.wheelInner}>
              <Text style={styles.wheelMark}>GR</Text>
              <View style={styles.wheelLine} />
              <Text style={styles.wheelText}>{spinning ? "DRAWING" : challenge ? "CHALLENGE" : "READY"}</Text>
            </View>
          </Animated.View>
        </View>

        {!challenge ? (
          <View style={styles.center}>
            <Text style={styles.eyebrow}>{spinning ? "LET FATE DECIDE" : "THE NEXT CHALLENGE"}</Text>
            <Text style={styles.prompt}>{spinning ? "NO BACKING OUT." : "WHAT'S YOUR MOVE?"}</Text>
            <Text style={styles.sub}>{spinning ? "The wheel is choosing your challenge..." : `${currentPlayer}, you're up. Give it a spin.`}</Text>
            <Pressable style={[styles.spinButton, spinning && styles.spinButtonOff]} onPress={spin} disabled={spinning}>
              <Text style={styles.spinText}>{spinning ? "DRAWING..." : "SPIN THE WHEEL"}</Text>
              {!spinning && <Text style={styles.spinArrow}>↗</Text>}
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.eyebrow}>{challenge.tag}</Text>
                <Text style={styles.forText}>FOR {currentPlayer.toUpperCase()}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Text style={styles.points}>{challenge.points}</Text>
                <Text style={styles.pts}>PTS</Text>
              </View>
            </View>
            <Text style={styles.challenge}>{challenge.title}</Text>
            <Text style={styles.desc}>{challenge.desc}</Text>
            <View style={styles.divider} />
            <Pressable style={styles.done} onPress={nextHole}>
              <Text style={styles.doneText}>{hole >= holes ? "FINISH ROUND" : "COMPLETE HOLE"}</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.scoreBox}>
          <View>
            <Text style={styles.scoreLabel}>ROULETTE SCORE</Text>
            <Text style={styles.scoreHint}>{holes} holes  •  {players.length} players</Text>
          </View>
          <Text style={styles.score}>{score.toString().padStart(2, "0")}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#070907" },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 18, alignItems: "center", maxWidth: 620, width: "100%", alignSelf: "center" },
  top: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#7a867f", fontSize: 9, fontWeight: "900", letterSpacing: 2.5, marginBottom: 5 },
  hole: { color: "#f3efe5", fontSize: 22, fontWeight: "900", letterSpacing: 0.5 },
  muted: { color: "#555f59", fontSize: 14 },
  modePill: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 11, borderRadius: 20, backgroundColor: "#101612", borderWidth: 1, borderColor: "#29352e" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#b8d86a", marginRight: 7 },
  mode: { color: "#b8d86a", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  progressTrack: { width: "100%", height: 3, backgroundColor: "#18201b", borderRadius: 2, marginTop: 18 },
  progress: { height: 3, backgroundColor: "#b8d86a", borderRadius: 2 },
  playerBanner: { width: "100%", marginTop: 13, flexDirection: "row", alignItems: "center", backgroundColor: "#0d130f", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: "#1f2a23" },
  playerLabel: { color: "#c9a762", fontSize: 8, fontWeight: "900", letterSpacing: 1.5, marginRight: 10 },
  playerName: { flex: 1, color: "#f3efe5", fontSize: 13, fontWeight: "900" },
  playerCount: { color: "#59665e", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  wheelArea: { width: 250, height: 245, alignItems: "center", justifyContent: "center", marginVertical: 16 },
  pointer: { position: "absolute", top: 1, zIndex: 5, width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 13, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#d5b46b" },
  wheelOuter: { width: 210, height: 210, borderRadius: 105, borderWidth: 2, borderColor: "#3b473f", backgroundColor: "#0c120f", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.55, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 7 },
  wheelInner: { width: 174, height: 174, borderRadius: 87, borderWidth: 1, borderColor: "#2b382f", alignItems: "center", justifyContent: "center", backgroundColor: "#111913" },
  wheelMark: { color: "#b8d86a", fontSize: 39, fontWeight: "900", letterSpacing: -3 },
  wheelLine: { width: 34, height: 1, backgroundColor: "#4a554e", marginVertical: 9 },
  wheelText: { color: "#89958e", fontSize: 9, fontWeight: "900", letterSpacing: 2.5 },
  center: { width: "100%", alignItems: "center", flex: 1 },
  eyebrow: { color: "#c9a762", fontSize: 9, fontWeight: "900", letterSpacing: 2.2, textAlign: "center" },
  prompt: { color: "#f3efe5", fontSize: 25, fontWeight: "900", letterSpacing: 0.3, marginTop: 7, textAlign: "center" },
  sub: { color: "#6d7972", fontSize: 13, marginTop: 7, marginBottom: 17, textAlign: "center" },
  spinButton: { width: "100%", maxWidth: 360, height: 58, borderRadius: 15, backgroundColor: "#b8d86a", alignItems: "center", justifyContent: "center", flexDirection: "row" },
  spinButtonOff: { opacity: 0.55 },
  spinText: { color: "#09100c", fontSize: 13, fontWeight: "900", letterSpacing: 1.8 },
  spinArrow: { color: "#09100c", fontSize: 20, marginLeft: 10, marginTop: -2 },
  card: { width: "100%", backgroundColor: "#101612", borderRadius: 21, padding: 21, borderWidth: 1, borderColor: "#2b382f", shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  forText: { color: "#69766f", fontSize: 8, fontWeight: "900", letterSpacing: 1.1, marginTop: 5 },
  pointsBadge: { flexDirection: "row", alignItems: "baseline", backgroundColor: "#1a241d", borderRadius: 11, paddingHorizontal: 10, paddingVertical: 6 },
  points: { color: "#b8d86a", fontSize: 17, fontWeight: "900" },
  pts: { color: "#6f7c74", fontSize: 8, fontWeight: "900", marginLeft: 3 },
  challenge: { color: "#f3efe5", fontWeight: "900", fontSize: 30, letterSpacing: 0.4, textAlign: "center", marginVertical: 13 },
  desc: { color: "#a1aba5", fontSize: 14, lineHeight: 21, textAlign: "center" },
  divider: { height: 1, backgroundColor: "#28342d", marginTop: 20 },
  done: { marginTop: 16, height: 52, borderRadius: 13, backgroundColor: "#b8d86a", width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row" },
  doneText: { color: "#09100c", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  arrow: { color: "#09100c", fontSize: 20, fontWeight: "700", marginLeft: 10 },
  scoreBox: { width: "100%", marginTop: 16, backgroundColor: "#0d130f", borderRadius: 15, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#1f2a23" },
  scoreLabel: { color: "#c4cbc6", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  scoreHint: { color: "#59655e", fontSize: 10, marginTop: 3 },
  score: { color: "#f3efe5", fontWeight: "900", fontSize: 28, letterSpacing: 1 },
  finishWrap: { flex: 1, width: "100%", maxWidth: 620, alignSelf: "center", padding: 24, alignItems: "center", justifyContent: "center" },
  finishEyebrow: { color: "#c9a762", fontSize: 10, fontWeight: "900", letterSpacing: 2.4, marginTop: 32 },
  finishTitle: { color: "#f3efe5", fontSize: 38, fontWeight: "900", marginTop: 8 },
  finishSub: { color: "#6d7972", fontSize: 13, marginTop: 8, textAlign: "center" },
  finalCard: { width: "100%", maxWidth: 390, marginTop: 30, padding: 28, borderRadius: 22, backgroundColor: "#101612", borderWidth: 1, borderColor: "#2b382f", alignItems: "center" },
  finalLabel: { color: "#7d8982", fontSize: 9, fontWeight: "900", letterSpacing: 2 },
  finalScore: { color: "#b8d86a", fontSize: 62, fontWeight: "900", marginTop: 8 },
  finalCaption: { color: "#59665e", fontSize: 8, fontWeight: "900", letterSpacing: 1.8, marginTop: 2 }
});
