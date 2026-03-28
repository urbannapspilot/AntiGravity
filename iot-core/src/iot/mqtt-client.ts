import { iot, mqtt } from "aws-iot-device-sdk-v2";
import { ICrtError } from "aws-crt";
import fs from 'fs';

export interface IoTConnectionArgs {
    endpoint: string;
    ca: string;
    certificate: string;
    privateKey: string;
    clientId: string;
}

export class IotClient {
    private static instance: IotClient;
    private connection: mqtt.MqttClientConnection;
    private config: IoTConnectionArgs;

    public constructor(config: IoTConnectionArgs) {
        this.config = config;
        const client = new mqtt.MqttClient();
        const builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder(
            fs.readFileSync(this.config.certificate, 'utf-8'),
            fs.readFileSync(this.config.privateKey, 'utf-8')
        );
        builder.with_certificate_authority(fs.readFileSync(this.config.ca, 'utf-8'));
        builder.with_clean_session(false);
        builder.with_client_id(this.config.clientId);
        builder.with_endpoint(this.config.endpoint);
        builder.with_port(8883);

        this.connection = client.new_connection(builder.build());
        this.initializeLogging();
    }

    public static getInstance(): IotClient {
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

    private initializeLogging() {
        this.connection.on('error', (error: ICrtError) => console.log("[MQTT] Error: " + error.toString()));
        this.connection.on('connect', (sessionPresent: boolean) => console.log("[MQTT] Connected. Session Present: " + sessionPresent));
        this.connection.on('connection_success', (data: mqtt.OnConnectionSuccessResult) => console.log("[MQTT] Connection Success"));
        this.connection.on('connection_failure', (data: mqtt.OnConnectionFailedResult) => console.log("[MQTT] Connection failure: " + data.error.toString()));
        this.connection.on('disconnect', () => console.log("[MQTT] Disconnected"));
        this.connection.on('interrupt', (error: ICrtError) => console.log("[MQTT] Interrupted: " + error.toString()));
        this.connection.on('resume', (returnCode: number, sessionPresent: boolean) => console.log("[MQTT] Resumed"));
        this.connection.on('closed', (data: mqtt.OnConnectionClosedResult) => console.log("[MQTT] Closed Event"));
    }

    public start() {
        this.connection.connect();
    }

    public async addSubscription(topicFilter: string) {
        return await this.connection.subscribe(topicFilter, mqtt.QoS.AtLeastOnce);
    }

    public async publish(topic: string, data: any) {
        return await this.connection.publish(topic, JSON.stringify(data), mqtt.QoS.AtLeastOnce);
    }

    public addEventListener(handler: mqtt.OnMessageCallback) {
        this.connection.on('message', handler);
    }
}

export const mqttClient = IotClient.getInstance();
