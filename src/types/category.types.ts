export enum EStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}
export enum ELevel {
  LEVEL_01 = 'Level01',
  LEVEL_02 = 'Level02',
  LEVEL_03 = 'Level03',
}

export type StatusCate = EStatus.Active | EStatus.Inactive;
export type CateLevel = ELevel.LEVEL_01 | ELevel.LEVEL_02 | ELevel.LEVEL_03;

export type ParentSelect = {
  displayLevel: string | null;
  displayPathName: string;
};

export type ParentStatus = {
  status: StatusCate;
  level: CateLevel;
  name: string;
};
export interface Category {
  _id: string;
  key?: string;
  name: string;
  path: null | string;
  pathName: null | string;
  status: StatusCate;
  title: string;
  children: Category[] | [];
  level: CateLevel;
  hasChildren: any;
  parentStatus: Array<ParentStatus>;
  value: string;
  addPath: string;
}

export interface CateSelected {
  key: string;
  title: string;
}
