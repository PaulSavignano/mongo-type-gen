/* This file is generated by mongo-type-gen.  Do not edit */

export default {
  indexes: [
    {
      key: {
        _id: 1
      }
    },
    {
      key: {
        name: 1
      },
      unique: true
    },
    {
      key: {
        year: 1
      }
    }
  ],
  isGenerated: true,
  name: 'students',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        gpa: {
          bsonType: [
            'double'
          ],
          description: "'gpa' must be a double if field exists"
        },
        name: {
          bsonType: 'string',
          description: "'name' must be a string and is required"
        },
        year: {
          bsonType: 'int',
          description: "'year' must be an integer in [  2017,  3017  ] and is required",
          maximum: 3017,
          minimum: 2017
        }
      },
      required: [
        'major',
        'name',
        'year'
      ],
      title: 'Student Object Validation'
    }
  }
};