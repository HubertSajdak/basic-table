import type { PeopleDto } from '../api/people.dto';

export namespace PeopleModel {
  export type Coordinates = {
    lat: number;
    lng: number;
  };

  export type Address = {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: Coordinates;
    country: string;
  };

  export type Person = {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
      color: string;
      type: string;
    };
    ip: string;
    address: Address;
    macAddress: string;
    university: string;
    bank: {
      cardExpire: string;
      cardNumber: string;
      cardType: string;
      currency: string;
      iban: string;
    };
    company: {
      department: string;
      name: string;
      title: string;
      address: Address;
    };
  };

  export type People = PeopleDto.PaginatedResponse<Person>;
}
