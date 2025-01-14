require("dotenv").config();
const { Kafka } = require('kafkajs');

console.log(process.env.BROKERS)
const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: [process.env.BROKERS],
});

const producer = kafka.producer();

const run = async () => {
  try {
    await producer.connect();
    console.log('Producer connected');
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: 'Hello Kafka!' }],
    });
    console.log('Message sent');
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
};

run().catch(console.error);

// require("dotenv").config();
// const { Kafka } = require("kafkajs");
// const config = require("./config");


