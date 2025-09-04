export enum QuadrantType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum Category {
  WORK = '仕事',
  PRIVATE = 'プライベート',
}

export enum RequestStatus {
  RECEIVED = '依頼を受けてる',
  DELEGATED = '依頼中',
  NONE = 'なし',
}

export interface Task {
  id: string;
  name: string;
  description: string;
  time: string;
  cost: number;
  category: Category;
  quadrant: QuadrantType;
  completed: boolean;
  dueDate: string;
  creationDate: string;
  requestStatus: RequestStatus;
  order: number;
}

export interface AppState {
  tabs: { [key: string]: string };
  tasks: { [key: string]: Task[] };
}