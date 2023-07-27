export default { 
  $jsonSchema:  { 
    bsonType:  'object', 
    properties:  { 
      _id:  { 
        bsonType:  'objectId'
       }, 
      address:  { 
        additionalProperties:  false, 
        bsonType:  'object', 
        properties:  { 
          city:  { 
            bsonType:  'string'
           }, 
          state:  { 
            bsonType:  'string'
           }, 
          street:  { 
            bsonType:  'string'
           }, 
          zip:  { 
            bsonType:  'string'
           }
         }, 
        required:  [ 
          'state', 
          'street', 
          'city', 
          'zip'
         ]
       }, 
      age:  { 
        bsonType:  [ 
          'int', 
          'null'
         ]
       }, 
      children:  { 
        bsonType:  'array', 
        items:  { 
          bsonType:  'object', 
          properties:  { 
            _id:  { 
              bsonType:  'objectId'
             }, 
            age:  { 
              bsonType:  [ 
                'int', 
                'null'
               ]
             }, 
            createdAt:  { 
              bsonType:  'date'
             }, 
            name:  { 
              bsonType:  'string'
             }, 
            updatedAt:  { 
              bsonType:  'date'
             }
           }, 
          required:  [ 
            '_id', 
            'age', 
            'createdAt', 
            'name'
           ]
         }
       }, 
      gender:  { 
        enum:  [ 
          'MALE', 
          'FEMALE', 
          'UNKNOWN'
         ]
       }, 
      name:  { 
        bsonType:  'string'
       }, 
      roles:  { 
        bsonType:  'array', 
        description:  'must be an array and is required', 
        items:  { 
          bsonType:  'string'
         }, 
        maxItems:  25, 
        minItems:  1
       }
     }, 
    required:  [ 
      '_id', 
      'name', 
      'address'
     ], 
    title:  'UserDoc'
   }
 };