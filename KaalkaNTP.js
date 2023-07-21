const ntplib = require("ntplib");
const math = require("mathjs");

class KaalkaNTP {
  constructor() {
    this.second = 0;
    this._updateTimestamp();
  }

  _updateTimestamp() {
    ntplib.getNetworkTime("pool.ntp.org", 123)
      .then((time) => {
        const timestamp = time.tx.raw();
        this.second = Math.floor(timestamp % 60);
      })
      .catch((err) => {
        console.error("Error fetching NTP time:", err);
      });
  }

  encrypt(data) {
    const encryptedMessage = this._encryptMessage(data);
    return encryptedMessage;
  }

  decrypt(encryptedMessage) {
    const decryptedMessage = this._decryptMessage(encryptedMessage);
    return decryptedMessage;
  }

  _encryptMessage(data) {
    const asciiValues = data.split("").map((char) => char.charCodeAt(0));
    const encryptedValues = asciiValues.map((val) => this._applyTrigonometricFunction(val));
    const encryptedMessage = encryptedValues.map((val) => String.fromCharCode(val)).join("");
    return encryptedMessage;
  }

  _decryptMessage(encryptedMessage) {
    const encryptedValues = encryptedMessage.split("").map((char) => char.charCodeAt(0));
    const decryptedValues = encryptedValues.map((val) => this._applyInverseFunction(val));
    const decryptedMessage = decryptedValues.map((val) => String.fromCharCode(val)).join("");
    return decryptedMessage;
  }

  _applyTrigonometricFunction(value) {
    const quadrant = this._determineQuadrant(this.second);
    if (quadrant === 1) {
      return math.round(value + math.sin(this.second));
    } else if (quadrant === 2) {
      return math.round(value + 1 / math.tan(this.second));
    } else if (quadrant === 3) {
      return math.round(value + math.cos(this.second));
    } else if (quadrant === 4) {
      return math.round(value + math.tan(this.second));
    } else {
      return value; // In case of an invalid quadrant, do not modify the value.
    }
  }

  _applyInverseFunction(value) {
    const quadrant = this._determineQuadrant(this.second);
    if (quadrant === 1) {
      return math.round(value - math.sin(this.second));
    } else if (quadrant === 2) {
      return math.round(value - 1 / math.tan(this.second));
    } else if (quadrant === 3) {
      return math.round(value - math.cos(this.second));
    } else if (quadrant === 4) {
      return math.round(value - math.tan(this.second));
    } else {
      return value; // In case of an invalid quadrant, do not modify the value.
    }
  }

  _determineQuadrant(second) {
    if (0 <= second && second <= 15) {
      return 1;
    } else if (16 <= second && second <= 30) {
      return 2;
    } else if (31 <= second && second <= 45) {
      return 3;
    } else {
      return 4;
    }
  }
}

module.exports = KaalkaNTP;
