export interface Params {
  projectId: string;
};

export interface ProductSearchFieldSelectOptions {
  name: DefaultSelectOption<string, string>;
  value: DefaultSelectOption<string, string>;
  comment: DefaultSelectOption<string, string>;
}
