export enum SiteScale {
  MAJOR = 'Major',
  REGIONAL = 'Regional',
  MINOR = 'Minor'
}

export enum SiteType {
  FORT = 'Fort',
  TEMPLE = 'Temple',
  TOMB = 'Tomb',
  STEPWELL = 'Stepwell',
  CAVE = 'Cave',
  RUIN = 'Ruin',
  OTHER = 'Other'
}

export enum SiteStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected'
}

export interface IHeritageSite {
  _id?: string;
  name: string;
  description: string;
  position: [number, number]; // [lat, lng]
  image: string;
  category: string;
  type: SiteType;
  scale: SiteScale;
  status: SiteStatus;
  suggestedBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
