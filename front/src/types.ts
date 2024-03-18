export type Selector = {
  isFetching: boolean;
  isError: boolean;
  isLoad: boolean;
  data: any;
};

export type CoreTR = {
  trans: (lang: string, str: string) => string;
};

export type CoreType = {
  trans: (str: string) => string;
};

export type Dict = {
  [key: string]: { [key: string]: string };
};

/* eslint-disable no-unused-vars */
declare global {
  let Domain: string | null;
  let EnvName: string | null;
  type Selector<T = any> = {
    isFetching: boolean;
    isError: boolean;
    isLoad: boolean;
    data: T;
  };

  interface Window {
    coreTR: CoreTR;
    LangTR: string;
    Store: any | null;
    Core: CoreType;
    dict: Dict;
    dictTR: Dict;
    coreMCN: CoreType;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any | null;
    topbarUrl: string;
    webPhoneUrl: string;
    tokenKompaas: string;
  }

  type DucksAction = {
    type?: string;
    actionType?: string;
    data?: any;
    pagination?: any;
    [x: string]: any;
  };

  type LangsTable = {
    [key: string]: {
      pagination: {
        page_title?: string;
        page_size: string;
        first: string;
        first_title: string;
        last: string;
        last_title: string;
        prev: string;
        prev_title: string;
        next: string;
        next_title: string;
      };
    };
  };

  type Noty = (obj: { text?: string; type?: string; timeout?: number }) => any;

  type McnUiOption = {
    label: string;
    value: string | number;
  };

  type NdcType = {
    id: number;
    name: string;
  };

  type BaseResponse<T> = {
    ok: boolean;
    result?: T;
    error?: string;
  };

  type SelectEmptyOptionMessage = {
    inputValue: string;
  };

  type ChangeDatePickerEvent = {
    startDate: string;
    endDate: string;
  };

  interface ResponseStateField<T> {
    isFetching: boolean;
    isLoad: boolean;
    isError: boolean;
    data: T | null;
  }

  export interface PaginationChangeEvent {
    data: McnUiOption;
  }

  type InputsErrors<T> = Partial<{
    [Property in keyof T]: string;
  }>;

  interface DefaultSelectOption<TLabel, TValue> {
    label: TLabel;
    value: TValue;
  }

  interface SelectEvent<T> {
    name: string;
    data: T;
  }

  interface MultiInputOptions {
    id: string;
    add: boolean;
    isNotRemove: boolean;
  }

  export interface QueryParams {
    projectId: string;
  }
}
