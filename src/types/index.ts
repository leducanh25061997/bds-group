import { RootState } from './RootState';

export type { RootState };
export * from './Auth';
export * from './Sidebar';
export * from './Account';
export * from './Table';
export * from './Filter';

export interface Pageable<T> {
  data: T[];
  total: number;
  statistic?: Statistic[];
  totalStatistic?: number;
}

interface Statistic {
  nameNode: string;
  total: number;
}

export interface BankInfo {
  id: string;
  code: string;
  name: string;
  shortName: string;
  bin: string;
  logo: string;
  swift_code: string;
  value?: string;
  key?: string;
}
