import mongoose from 'mongoose';
import dbConnect from './dbConnect';
import Chat from '../models/Chat';

async function seedChats() {
  await dbConnect();

  const predefinedChats = [
    { firstName: 'John', lastName: 'Doe', type: 'predefined' },
    { firstName: 'Jane', lastName: 'Smith', type: 'predefined' },
    { firstName: 'Alice', lastName: 'Johnson', type: 'predefined' },
  ];

  try {
    for (const chat of predefinedChats) {
      const existingChat = await Chat.findOne({ firstName: chat.firstName, lastName: chat.lastName });
      if (!existingChat) {
        await new Chat(chat).save();
        console.log(`Inserted chat: ${chat.firstName} ${chat.lastName}`);
      } else {
        console.log(`Chat already exists: ${chat.firstName} ${chat.lastName}`);
      }
    }
    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding chats:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedChats(); 