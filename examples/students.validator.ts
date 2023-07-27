export default { 
  $jsonSchema:  { 
    bsonType:  'object', 
    properties:  { 
      gpa:  { 
        bsonType:  [ 
          'double'
         ], 
        description:  "'gpa' must be a double if the field exists"
       }, 
      name:  { 
        bsonType:  'string', 
        description:  "'name' must be a string and is required"
       }, 
      year:  { 
        bsonType:  'int', 
        description:  "'year' must be an integer in [  2017,  3017  ] and is required", 
        maximum:  3017, 
        minimum:  2017
       }
     }, 
    required:  [ 
      'address', 
      'major', 
      'name', 
      'year'
     ], 
    title:  'Student Object Validation'
   }
 };