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
    },
    "&:disabled": {
      backgroundColor: "#363636",
      border: ".3em solid #F1D699",
      color: "#F1D699"
    }
  },
  yn_button_2: {
    backgroundColor: "transparent",
    color: "white",
    borderRadius: 0,
    borderBottomRightRadius: ".5em",
    borderBottom: ".1em solid white",
    borderRight: ".1em solid white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "grey",
    },
    "&:disabled": {
      backgroundColor: "#363636",
      border: ".3em solid #F1D699",
      color: "#F1D699"
    }
  },
  fadeOut: {
    opacity: 0,
    transition: "opacity 0.5s",
  },
  fadeIn: {
    opacity: 1,
    transition: "opacity 0.5s",
  }
};

// Freeze object so it can't be altered
Object.freeze(yn_mui_styles);
export default yn_mui_styles;