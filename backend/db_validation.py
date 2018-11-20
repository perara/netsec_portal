import pymongo
from collections import OrderedDict
from pymongo.errors import CollectionInvalid

"""
{
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["name", "year", "major", "gpa", "address.city", "address.street"],
            "properties": {
                "name": {
                    "bsonType": "string",
                    "description": "must be a string and is required"
                },
                "gender": {
                    "bsonType": "string",
                    "description": "must be a string and is not required"
                },
                "year": {
                    "bsonType": "int",
                    "minimum": 2017,
                    "maximum": 3017,
                    "exclusiveMaximum": False,
                    "description": "must be an integer in [ 2017, 3017 ] and is required"
                },
                "major": {
                    "enum": ["Math", "English", "Computer Science", "History", None],
                    "description": "can only be one of the enum values and is required"
                },
                "gpa": {
                    "bsonType": ["double"],
                    "minimum": 0,
                    "description": "must be a double and is required"
                },
                "address.city": {
                    "bsonType": "string",
                    "description": "must be a string and is required"
                },
                "address.street": {
                    "bsonType": "string",
                    "description": "must be a string and is required"
                }
            }
        }
    }

"""

async def create_validation_scheme(db):
    await create_collection(db, "case")
    await create_collection(db, "object")


async def create_collection(db, coll_name, validator=None, validator_level="moderate"):
    try:
        await db.create_collection(coll_name)

        if validator is not None:
            query = [
                ('collMod', coll_name),
                ('validator', validator),
                ('validationLevel', validator_level)
            ]
            query = OrderedDict(query)
            result = await db.command(query)
            print(result)
    except CollectionInvalid as e:
        pass

