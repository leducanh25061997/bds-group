export interface Option {
  key?: string;
  value?: string | number;
  id: number | string;
  isDefault?: boolean;
  enumCode?: number;
  description?: string;
  name?: string;
}
export interface OptionCustom {
  key?: string;
  value?: string | number;
  id: string;
  isCheck: boolean;
  name?: string;
  position?: string;
  avatar?: string;
}

export interface OptionAutocomplete {
  label?: string;
  id?: string;
  isCheck?: boolean;
  key?: string;
  value?: string | number;
  name?: string;
  position?: string;
  avatar?: string;
}
export interface OptionCheckbox {
  id?: string;
  key?: string;
  name?: string;
}

export interface ErrorType {
  at: string;
  message: string;
}
