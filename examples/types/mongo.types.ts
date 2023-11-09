/* This file is generated by mongo-type-gen.  Do not edit this file.  Edit the $jsonSchema in in **.collection.ts. */

import { ObjectId } from 'mongodb';

export enum CollectionEnum {
  students = 'students',
  users = 'users',
}

export type StudentDoc = {
  gpa?: number;
  name: string;
  year: number;
};

export type UserDocAddressChildren = {
  _id: ObjectId | string;
  age: number | null;
  createdAt: Date;
  name: string;
  updatedAt?: Date;
};

export type UserDocAddress = {
  children?: UserDocAddressChildren[];
  city: string;
  state: string;
  street: string;
  zip: string;
};

export type UserDocChildrenSibling = {
  _id: ObjectId | string;
  age: number | null;
  createdAt: Date;
  name: string;
  updatedAt?: Date;
};

export type UserDocChildren = {
  _id: ObjectId | string;
  age: number | null;
  createdAt: Date;
  name: string;
  siblings?: UserDocChildrenSibling[];
};

export enum UserDocGenderEnum {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  UNKNOWN = 'UNKNOWN',
}

export type UserDoc = {
  _id: ObjectId | string;
  address: UserDocAddress;
  age?: number | null;
  children?: UserDocChildren[];
  gender?: UserDocGenderEnum;
  name: string;
  roles?: string[];
};