import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Animated, Easing, ScrollView } from "react-native";

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

const storageKey = "golf-roulette-active-round-v2";
const buzz = (pattern = 20) => { try { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern); } catch (_) {} };
const tone = (frequency = 520, duration = 0.08) => { try { if (typeof window === "undefined" || !window.AudioContext) return; const ctx = new window.AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.frequency.value = frequency; osc.type = "sine"; gain.gain.setValueAtTime(0.025, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration); } catch (_) {} };
const readSaved = () => { try { return typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem(storageKey) || "null") : null; } catch (_) { return null; } };
const writeSaved = (value) => { try { if (typeof localStorage !== "undefined") localStorage.setItem(storageKey, JSON.stringify(value)); } catch (_) {} };
const removeSaved = () => { try { if (typeof localStorage !== "undefined") localStorage.removeItem(storageKey); } catch (_) {} };

export default function GameScreen({ holes = 9, names = ["You", "Player 2"] }) {
  const players = names.map((name, i) => (name || `Player ${i + 1}`).trim() || `Player ${i + 1}`);
  const saved = useRef(readSaved()).current;
  const validSaved = saved && saved.holes === holes && JSON.stringify(saved.names) === JSON.stringify(players);
  const [hole, setHole] = useState(validSaved ? saved.hole : 1);
  const [playerIndex, setPlayerIndex] = useState(validSaved ? saved.playerIndex : 0);
  const [challenge, setChallenge] = useState(validSaved ? saved.challenge : null);
  const [score, setScore] = useState(validSaved ? saved.score : 0);
  const [playerScores, setPlayerScores] = useState(validSaved ? saved.playerScores : players.map(() => 0));
  const [playerCounts, setPlayerCounts] = useState(validSaved ? saved.playerCounts : players.map(() => 0));
  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(1)).current;

  useEffect(() => { if (!finished) writeSaved({ holes, names: players, hole, playerIndex, challenge, score, playerScores, playerCounts }); }, [holes, playerIndex, hole, challenge, score, playerScores, playerCounts, finished]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true); setChallenge(null); rotation.setValue(0); reveal.setValue(0.25);
    buzz(15); tone(340, 0.06);
    Animated.timing(rotation, { toValue: 1, duration: 1500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      const drawn = challenges[Math.floor(Math.random() * challenges.length)];
      setChallenge(drawn); setSpinning(false); buzz([0, 20, 35]); tone(690, 0.12);
      Animated.timing(reveal, { toValue: 1, duration: 260, useNativeDriver: true }).start();
    });
  };

  const completeHole = () => {
    if (!challenge) return;
    const nextScore = score + challenge.points;
    const nextPlayerScores = [...playerScores];
    const nextCounts = [...playerCounts];
    nextPlayerScores[playerIndex] += challenge.points;
    nextCounts[playerIndex] += 1;
    setScore(nextScore); setPlayerScores(nextPlayerScores); setPlayerCounts(nextCounts); setChallenge(null);
    buzz(25); tone(590, 0.07);
    if (hole >= holes) { removeSaved(); setFinished(true); return; }
    setHole((value) => value + 1); setPlayerIndex((value) => (value + 1) % players.length);
  };

  const restart = () => {
    removeSaved(); setHole(1); setPlayerIndex(0); setChallenge(null); setScore(0); setPlayerScores(players.map(() => 0)); setPlayerCounts(players.map(() => 0)); setFinished(false); setSpinning(false); rotation.setValue(0); reveal.setValue(1); buzz(15);
  };

  const wheelSpin = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "1440deg"] });
  const totalChallenges = playerCounts.reduce((a, b) => a + b, 0);
  const average = totalChallenges ? (score / totalChallenges).toFixed(1) : "0.0";
  const highScore = Math.max(...playerScores, 0);

  if (finished) return (
    <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.finishWrap}>
      <Text style={styles.brand}>GOLF ROULETTE</Text><Text style={styles.finishEyebrow}>ROUND COMPLETE</Text><Text style={styles.finishTitle}>That's a wrap.</Text>
      <Text style={styles.finishSub}>{holes} holes · {players.length} players · chaos mode</Text>
      <View style={styles.finalCard}><Text style={styles.finalLabel}>TOTAL ROULETTE POINTS</Text><Text style={styles.finalScore}>{score}</Text>
        <View style={styles.statsRow}><View style={styles.stat}><Text style={styles.statValue}>{totalChallenges}</Text><Text style={styles.statLabel}>DRAWS</Text></View><View style={styles.stat}><Text style={styles.statValue}>{average}</Text><Text style={styles.statLabel}>AVG / DRAW</Text></View><View style={styles.stat}><Text style={styles.statValue}>{highScore}</Text><Text style={styles.statLabel}>HIGH SCORE</Text></View></View>
      </View>
      <Text style={[styles.section, { marginTop: 25 }]}>PLAYER SCORES</Text>
      {players.map((name, i) => <View key={name + i} style={[styles.playerScore, playerScores[i] === highScore && styles.playerScoreTop]}><View style={styles.rank}><Text style={styles.rankText}>{String(i + 1).padStart(2, "0")}</Text></View><View style={{ flex: 1 }}><Text style={styles.playerName}>{name}</Text><Text style={styles.playerMeta}>{playerCounts[i]} challenge{playerCounts[i] === 1 ? "" : "s"}</Text></View><Text style={styles.playerPoints}>{playerScores[i]}</Text></View>)}
      <Pressable style={({ pressed }) => [styles.spinButton, pressed && styles.pressed]} onPress={restart}><Text style={styles.spinText}>PLAY AGAIN</Text><Text style={styles.spinArrow}>↗</Text></Pressable>
    </ScrollView></SafeAreaView>
  );

  return <SafeAreaView style={styles.safe}><View style={styles.container}>
    <View style={styles.top}><View><Text style={styles.brand}>GOLF ROULETTE</Text><Text style={styles.hole}>HOLE {hole} <Text style={styles.muted}>/ {holes}</Text></Text></View><View style={styles.modePill}><View style={styles.liveDot}/><Text style={styles.mode}>CHAOS MODE</Text></View></View>
    <View style={styles.progressTrack}><View style={[styles.progress, { width: `${(hole / holes) * 100}%` }]}/></View>
    <View style={styles.playerBanner}><Text style={styles.playerLabel}>UP NOW</Text><Text style={styles.playerName}>{players[playerIndex]}</Text><Text style={styles.playerCount}>{playerIndex + 1} / {players.length}</Text></View>
    <View style={styles.wheelArea}><View style={styles.pointer}/><Animated.View style={[styles.wheelOuter, { transform: [{ rotate: wheelSpin }] }]}><View style={styles.wheelInner}><Text style={styles.wheelMark}>GR</Text><View style={styles.wheelLine}/><Text style={styles.wheelText}>{spinning ? "DRAWING" : challenge ? "DRAWN" : "READY"}</Text></View></Animated.View></View>
    {!challenge ? <Animated.View style={[styles.center, { opacity: reveal }]}><Text style={styles.eyebrow}>{spinning ? "LET FATE DECIDE" : "THE NEXT CHALLENGE"}</Text><Text style={styles.prompt}>{spinning ? "NO BACKING OUT." : "WHAT'S YOUR MOVE?"}</Text><Text style={styles.sub}>{spinning ? "The wheel is choosing your challenge..." : `${players[playerIndex]}, you're up. Give it a spin.`}</Text><Pressable style={({ pressed }) => [styles.spinButton, spinning && styles.spinButtonOff, pressed && !spinning && styles.pressed]} onPress={spin} disabled={spinning}><Text style={styles.spinText}>{spinning ? "DRAWING..." : "SPIN THE WHEEL"}</Text>{!spinning && <Text style={styles.spinArrow}>↗</Text>}</Pressable></Animated.View> : <Animated.View style={[styles.card, { opacity: reveal }]}><View style={styles.cardTop}><View><Text style={styles.eyebrow}>{challenge.tag}</Text><Text style={styles.forText}>FOR {players[playerIndex].toUpperCase()}</Text></View><View style={styles.pointsBadge}><Text style={styles.points}>{challenge.points}</Text><Text style={styles.pts}>PTS</Text></View></View><Text style={styles.challenge}>{challenge.title}</Text><Text style={styles.desc}>{challenge.desc}</Text><View style={styles.divider}/><Pressable style={({ pressed }) => [styles.done, pressed && styles.pressed]} onPress={completeHole}><Text style={styles.doneText}>{hole >= holes ? "FINISH ROUND" : "COMPLETE HOLE"}</Text><Text style={styles.arrow}>→</Text></Pressable></Animated.View>}
    <View style={styles.scoreBox}><View><Text style={styles.scoreLabel}>ROUND SCORE</Text><Text style={styles.scoreHint}>{totalChallenges} challenge{totalChallenges === 1 ? "" : "s"} completed</Text></View><Text style={styles.score}>{score.toString().padStart(2, "0")}</Text></View>
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#070907" }, container: { flex: 1, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 18, alignItems: "center", maxWidth: 620, width: "100%", alignSelf: "center" },
  top: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, brand: { color: "#7a867f", fontSize: 9, fontWeight: "900", letterSpacing: 2.5, marginBottom: 5 }, hole: { color: "#f3efe5", fontSize: 22, fontWeight: "900", letterSpacing: 0.5 }, muted: { color: "#555f59", fontSize: 14 },
  modePill: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 11, borderRadius: 20, backgroundColor: "#101612", borderWidth: 1, borderColor: "#29352e" }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#b8d86a", marginRight: 7 }, mode: { color: "#b8d86a", fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  progressTrack: { width: "100%", height: 3, backgroundColor: "#18201b", borderRadius: 2, marginTop: 18 }, progress: { height: 3, backgroundColor: "#b8d86a", borderRadius: 2 },
  playerBanner: { width: "100%", marginTop: 13, flexDirection: "row", alignItems: "center", backgroundColor: "#0d130f", borderRadius: 12, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: "#1f2a23" }, playerLabel: { color: "#c9a762", fontSize: 8, fontWeight: "900", letterSpacing: 1.5, marginRight: 10 }, playerName: { flex: 1, color: "#f3efe5", fontSize: 13, fontWeight: "900" }, playerCount: { color: "#59665e", fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  wheelArea: { width: 250, height: 245, alignItems: "center", justifyContent: "center", marginVertical: 16 }, pointer: { position: "absolute", top: 1, zIndex: 5, width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 13, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#d5b46b" }, wheelOuter: { width: 210, height: 210, borderRadius: 105, borderWidth: 2, borderColor: "#3b473f", backgroundColor: "#0c120f", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.55, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 7 }, wheelInner: { width: 174, height: 174, borderRadius: 87, borderWidth: 1, borderColor: "#2b382f", alignItems: "center", justifyContent: "center", backgroundColor: "#111913" }, wheelMark: { color: "#b8d86a", fontSize: 39, fontWeight: "900", letterSpacing: -3 }, wheelLine: { width: 34, height: 1, backgroundColor: "#4a554e", marginVertical: 9 }, wheelText: { color: "#89958e", fontSize: 9, fontWeight: "900", letterSpacing: 2.5 },
  center: { width: "100%", alignItems: "center", flex: 1 }, eyebrow: { color: "#c9a762", fontSize: 9, fontWeight: "900", letterSpacing: 2.2, textAlign: "center" }, prompt: { color: "#f3efe5", fontSize: 25, fontWeight: "900", letterSpacing: 0.3, marginTop: 7, textAlign: "center" }, sub: { color: "#6d7972", fontSize: 13, marginTop: 7, marginBottom: 17, textAlign: "center" },
  spinButton: { width: "100%", maxWidth: 360, height: 58, borderRadius: 15, backgroundColor: "#b8d86a", alignItems: "center", justifyContent: "center", flexDirection: "row" }, spinButtonOff: { opacity: 0.55 }, pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] }, spinText: { color: "#09100c", fontSize: 13, fontWeight: "900", letterSpacing: 1.8 }, spinArrow: { color: "#09100c", fontSize: 20, marginLeft: 10, marginTop: -2 },
  card: { width: "100%", backgroundColor: "#101612", borderRadius: 21, padding: 21, borderWidth: 1, borderColor: "#2b382f", shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 }, cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, forText: { color: "#69766f", fontSize: 8, fontWeight: "900", letterSpacing: 1.1, marginTop: 5 }, pointsBadge: { flexDirection: "row", alignItems: "baseline", backgroundColor: "#1a241d", borderRadius: 11, paddingHorizontal: 10, paddingVertical: 6 }, points: { color: "#b8d86a", fontSize: 17, fontWeight: "900" }, pts: { color: "#6f7c74", fontSize: 8, fontWeight: "900", marginLeft: 3 }, challenge: { color: "#f3efe5", fontWeight: "900", fontSize: 30, letterSpacing: 0.4, textAlign: "center", marginVertical: 13 }, desc: { color: "#a1aba5", fontSize: 14, lineHeight: 21, textAlign: "center" }, divider: { height: 1, backgroundColor: "#28342d", marginTop: 20 }, done: { marginTop: 16, height: 52, borderRadius: 13, backgroundColor: "#b8d86a", width: "100%", alignItems: "center", justifyContent: "center", flexDirection: "row" }, doneText: { color: "#09100c", fontSize: 11, fontWeight: "900", letterSpacing: 1.4 }, arrow: { color: "#09100c", fontSize: 20, fontWeight: "700", marginLeft: 10 },
  scoreBox: { width: "100%", marginTop: 16, backgroundColor: "#0d130f", borderRadius: 15, padding: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#1f2a23" }, scoreLabel: { color: "#c4cbc6", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 }, scoreHint: { color: "#59655e", fontSize: 10, marginTop: 3 }, score: { color: "#f3efe5", fontWeight: "900", fontSize: 28, letterSpacing: 1 },
  finishWrap: { width: "100%", maxWidth: 620, alignSelf: "center", padding: 24, paddingTop: 34, paddingBottom: 45, alignItems: "center" }, finishEyebrow: { color: "#c9a762", fontSize: 10, fontWeight: "900", letterSpacing: 2.4, marginTop: 32 }, finishTitle: { color: "#f3efe5", fontSize: 38, fontWeight: "900", marginTop: 8 }, finishSub: { color: "#6d7972", fontSize: 13, marginTop: 8, textAlign: "center" }, finalCard: { width: "100%", maxWidth: 420, marginTop: 28, padding: 25, borderRadius: 22, backgroundColor: "#101612", borderWidth: 1, borderColor: "#2b382f", alignItems: "center" }, finalLabel: { color: "#7d8982", fontSize: 9, fontWeight: "900", letterSpacing: 2 }, finalScore: { color: "#b8d86a", fontSize: 62, fontWeight: "900", marginTop: 5 }, statsRow: { width: "100%", flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#28342d", marginTop: 16, paddingTop: 15 }, stat: { alignItems: "center", minWidth: 70 }, statValue: { color: "#f3efe5", fontSize: 18, fontWeight: "900" }, statLabel: { color: "#65736b", fontSize: 7, fontWeight: "900", letterSpacing: 1, marginTop: 3 }, section: { width: "100%", color: "#8b978f", fontSize: 9, fontWeight: "900", letterSpacing: 2, marginBottom: 11 }, playerScore: { width: "100%", minHeight: 67, borderRadius: 15, backgroundColor: "#0d130f", borderWidth: 1, borderColor: "#202b24", marginBottom: 8, padding: 11, flexDirection: "row", alignItems: "center" }, playerScoreTop: { borderColor: "#435339", backgroundColor: "#111913" }, rank: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#172019", alignItems: "center", justifyContent: "center", marginRight: 11 }, rankText: { color: "#69756e", fontSize: 9, fontWeight: "900" }, playerMeta: { color: "#65736b", fontSize: 10, marginTop: 3 }, playerPoints: { color: "#b8d86a", fontSize: 23, fontWeight: "900" }
});