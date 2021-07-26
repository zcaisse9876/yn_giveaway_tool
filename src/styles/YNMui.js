// Object to be used with MUI makeStyle. Contains Yammie Noob styling
const yn_mui_styles = {
  // Style for a yammie button
  yn_button: {
    backgroundColor: "black",
    color: "#EBB233",
    borderRadius: 0,
    fontWeight: "bold",
    border: ".3em solid #EBB233",
    "&:hover": {
      backgroundColor: "white",
    }
  }
};

// Freeze object so it can't be altered
Object.freeze(yn_mui_styles);
export default yn_mui_styles;