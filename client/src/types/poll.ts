export interface IPoll {
  _id: string;
  question: string;
  options: {
    text: string;
    votes: string[];
  }[];
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
