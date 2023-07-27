import { UserDoc } from './mongo.types';

const user: UserDoc = {
  _id: '5f9a2b2b9d9d9d9d9d9d9d9d',
  address: {
    city: 'New York',
    state: 'NY',
    street: '123 Main St',
    zip: '12345',
  },
  age: 30,
  children: [
    {
      _id: '5f9a2b2b9d9d9d9d9d9d9d9d',
      age: 5,
      createdAt: new Date(),
      name: 'John',
      updatedAt: new Date(),
    },
  ],
  name: 'Jane',
};

console.log(user);
