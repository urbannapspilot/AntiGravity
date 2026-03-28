"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mqttClient = exports.IotClient = void 0;
const aws_iot_device_sdk_v2_1 = require("aws-iot-device-sdk-v2");
const fs_1 = __importDefault(require("fs"));
class IotClient {
    static instance;
    connection;
    config;
    constructor(config) {
        this.config = config;
        const client = new aws_iot_device_sdk_v2_1.mqtt.MqttClient();
        const builder = aws_iot_device_sdk_v2_1.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder(fs_1.default.readFileSync(this.config.certificate, 'utf-8'), fs_1.default.readFileSync(this.config.privateKey, 'utf-8'));
        builder.with_certificate_authority(fs_1.default.readFileSync(this.config.ca, 'utf-8'));
        builder.with_clean_session(false);
        builder.with_client_id(this.config.clientId);
        builder.with_endpoint(this.config.endpoint);
        builder.with_port(8883);
        this.connection = client.new_connection(builder.build());
        this.initializeLogging();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IotClient({
                endpoint: process.env.IOT_ENDPOINT || "",
                ca: process.env.IOT_CA || "",
                certificate: process.env.IOT_CERTIFICATE || "",
                privateKey: process.env.IOT_PRIVATE_KEY || "",
                clientId: process.env.IOT_CLIENT_NAME || "AntiGravityIOTCore"
            });
        }
        return this.instance;
    }
    initializeLogging() {
        this.connection.on('error', (error) => console.log("[MQTT] Error: " + error.toString()));
        this.connection.on('connect', (sessionPresent) => console.log("[MQTT] Connected. Session Present: " + sessionPresent));
        this.connection.on('connection_success', (data) => console.log("[MQTT] Connection Success"));
        this.connection.on('connection_failure', (data) => console.log("[MQTT] Connection failure: " + data.error.toString()));
        this.connection.on('disconnect', () => console.log("[MQTT] Disconnected"));
        this.connection.on('interrupt', (error) => console.log("[MQTT] Interrupted: " + error.toString()));
        this.connection.on('resume', (returnCode, sessionPresent) => console.log("[MQTT] Resumed"));
        this.connection.on('closed', (data) => console.log("[MQTT] Closed Event"));
    }
    start() {
        this.connection.connect();
    }
    async addSubscription(topicFilter) {
        return await this.connection.subscribe(topicFilter, aws_iot_device_sdk_v2_1.mqtt.QoS.AtLeastOnce);
    }
    async publish(topic, data) {
        return await this.connection.publish(topic, JSON.stringify(data), aws_iot_device_sdk_v2_1.mqtt.QoS.AtLeastOnce);
    }
    addEventListener(handler) {
        this.connection.on('message', handler);
    }
}
exports.IotClient = IotClient;
exports.mqttClient = IotClient.getInstance();
