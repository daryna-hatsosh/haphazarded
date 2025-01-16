import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

const useKafka = process.env.USE_KAFKA === 'true';

let producer;

if (useKafka) {
  const kafka = new Kafka({
    clientId: 'random-responses-producer',
    brokers: [process.env.BROKERS],
  });

  producer = kafka.producer();

  (async () => {
    await producer.connect();
    console.log('Kafka producer connected');
  })();
}

export const sendMessageToKafka = async (topic, message) => {
  if (!useKafka) return;

  try {
    console.log('Sending message to Kafka:', JSON.stringify(message));
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log('Message sent to Kafka.');
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  }
}; 