import { StyleSheet } from "react-native";


export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    paddingTop: 16,
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
  },
  screenHeaderIconRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  screenHeaderIcon: {
    margin: 10,
  },
  coralBorderButton: {
    width: 200,
    height: 30,
    borderWidth: 1,
    borderColor: "coral",
    borderRadius: 10,
    justifyContent: 'center',
    marginVertical: 10,
  },
  coralBorderButtonText: {
    fontSize: 20,
    textAlign: "center",
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
  projectFlatList: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  projectCard: {
    borderColor: "coral",
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  projectCardHeader: {
    minHeight: 20,
    marginTop: 20,
    marginHorizontal: 16,
    borderBottomColor: 'coral',
    borderBottomWidth: 1,
  },
  projectTitle: {
    alignSelf: "center",
    fontSize: 20,
  },
  projectCardContent: {
    minHeight: 300,
    paddingHorizontal: 10,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: "space-evenly"
  },
  projectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  projectIconRow: {
    paddingBottom: 16,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: 'space-around',
  },
  projectIcon: {
    textAlign: 'center',
    marginHorizontal: 10,
  },
  projectIconText: {
    textAlign: 'center',
    marginHorizontal: 10,
  },
  projectCreatedAt: {
    padding: 10,
  }
});
