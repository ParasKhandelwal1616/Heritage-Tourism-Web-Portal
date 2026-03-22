export enum EventType {
  UPCOMING = 'UPCOMING',
  PAST = 'PAST',
}

export interface IEvent {
  title: string;
  description: string;
  date: Date;
  type: EventType;
  posterUrl: string;
  driveFolderLink?: string;
  registrationLink?: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}
