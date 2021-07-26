class Network {

  // Just prints out a network call response nicely to console
  static netLog(method, result) {
    const spacer = "-".repeat(10);
    const divider = `${spacer} ${method} - ${new Date().toLocaleTimeString()} ${spacer}`;
    console.log(divider);
    console.log(result);
    console.log(divider);
  }
}

export default Network;