import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <View style={s.logoCircle}><Text style={s.logo}>🎰</Text></View>
        <Text style={s.title}>GOLF{"\n"}ROULETTE</Text>
        <Text style={s.tag}>SPIN. PLAY. REGRET IT.</Text>
        <View style={s.card}><Text style={s.cardTitle}>Your golf round just got unpredictable.</Text><Text style={s.cardText}>Spin for challenges, earn points, and see who survives 9 or 18 holes.</Text></View>
        <Pressable style={s.primary} onPress={() => router.push("/setup")}><Text style={s.primaryText}>🎰  START GAME</Text></Pressable>
        <Pressable style={s.secondary} onPress={() => router.push("/how")}><Text style={s.secondaryText}>HOW TO PLAY</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}
const s=StyleSheet.create({safe:{flex:1,backgroundColor:"#08110d"},container:{flex:1,padding:24,alignItems:"center",justifyContent:"center"},logoCircle:{width:82,height:82,borderRadius:41,borderWidth:2,borderColor:"#b8e06b",alignItems:"center",justifyContent:"center",marginBottom:18},logo:{fontSize:42},title:{fontSize:48,lineHeight:45,fontWeight:"900",letterSpacing:2,textAlign:"center",color:"#f5f6ee"},tag:{marginTop:12,color:"#b8e06b",fontWeight:"800",letterSpacing:3,fontSize:12},card:{width:"100%",padding:20,borderRadius:18,backgroundColor:"#111d17",borderWidth:1,borderColor:"#26372d",marginTop:34,marginBottom:18},cardTitle:{color:"#fff",fontSize:18,fontWeight:"800",marginBottom:8},cardText:{color:"#aeb9b1",fontSize:14,lineHeight:21},primary:{width:"100%",padding:18,borderRadius:16,backgroundColor:"#b8e06b",alignItems:"center"},primaryText:{color:"#0a130e",fontWeight:"900",fontSize:16,letterSpacing:1},secondary:{padding:18},secondaryText:{color:"#dbe2dc",fontWeight:"800",letterSpacing:1}});