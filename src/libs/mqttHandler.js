import mqtt from "mqtt";
import { getTurnstilesMQTT } from "../controllers/turnstile.controller.js";
import { createEntryMQTT } from "../controllers/entry.controller.js";

class mqttHandler {
  constructor() {
    this.mqttClient = null;
    this.options = {
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      protocol: process.env.MQTT_PROTOCOL,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    };

    this.mqttClient = mqtt.connect(this.options);
  }
  connect() {
    this.mqttClient.on("error", (error) => {
      console.log(error);
      this.mqttClient.end();
    });

    this.mqttClient.on("connect", () => {
      console.log("MQTT client has connected.");
      subscribe();
    });

    const subscribe = async () => {
      const res = await getTurnstilesMQTT();
      res.forEach((turnstile) => {
        const name = turnstile.dataValues.name;
        this.mqttClient.subscribe(name, { qos: 0 });
      });
    };

    this.mqttClient.on("message", async function (topic, message) {
      console.log({
        topic: topic,
        message: message.toString(),
      });

      const messageVector = message.toString().split(",");
      const rfid = messageVector[0].trim();
      const type = messageVector[1].trim();

      const res = await createEntryMQTT(rfid, topic, type);
      const publish = topic + "Set";
      this.publish(publish, res);
    });

    this.mqttClient.on("close", () => {
      console.log(
        "MQTT client has been disconnected. Attempting to reconnect..."
      );
      this.mqttClient.reconnect();
    });
  }
}

export default mqttHandler;
