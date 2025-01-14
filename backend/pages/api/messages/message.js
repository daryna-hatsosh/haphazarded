// pages/api/kafkaOperations.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'kafka-client',
  brokers: [process.env.BROKERS],
});

const producer = kafka.producer();
const admin = kafka.admin();
const consumer = kafka.consumer({ groupId: 'kafka-group' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Send a message
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    try {
      await producer.connect();
      await producer.send({
        topic: 'test-topic',
        messages: [{ value: message }],
      });
      await producer.disconnect();
      return res.status(200).json({ success: true, message: 'Message sent' });
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET') {
    const { type } = req.query;

    if (type === 'topics') {
      // List topics
      try {
        await admin.connect();
        const topics = await admin.listTopics();
        await admin.disconnect();
        return res.status(200).json({ success: true, topics });
      } catch (error) {
        console.error('Error listing topics:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    } else if (type === 'messages') {
      // List messages from a topic
      const { topic } = req.query;
      if (!topic) {
        return res.status(400).json({ success: false, message: 'Topic is required' });
      }

      try {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });

        const messages = [];
        await consumer.run({
          eachMessage: async ({ message }) => {
            messages.push(message.value.toString());
          },
        });

        // Disconnect after a short delay to allow message consumption
        setTimeout(async () => {
          await consumer.disconnect();
          return res.status(200).json({ success: true, messages });
        }, 5000); // Adjust the delay as needed

      } catch (error) {
        console.error('Error listing messages:', error);
        return res.status(500).json({ success: false, error: error.message });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type parameter' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}