import { StyleSheet } from "react-native";


export const globalStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  screenHeader: {
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "coral",
    shadowColor: "#333",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  screenHeaderTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 20,
  },
  titleText: {
    fontSize: 18,
    color: "#333",
  },
  smallText: {
    color: "#d3d3d3",
    fontSize: 15,
  },
  paragraphText: {
    marginVertical: 8,
    lineHeight: 20,
    color: "#ddd",
  },
});
