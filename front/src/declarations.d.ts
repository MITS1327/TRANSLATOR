declare module 'external-remotes-plugin';

declare module 'mcn-ui-components';
declare module 'mcn-ui-components/*';
declare module 'lodash.debounce';
declare module 'mcn-ui-components/types' {
  interface CountrySelectData {
    alphaCode2: string;
    icon: string;
    label: string;
    prefix: number;
    value: number;
  }

  export interface CountrySelectValue {
    name: string;
    data: CountrySelectData;
  }
}
declare module 'static';
declare module 'static/*';
declare module 'postcss-custom-media';

declare module '*.svg' {
  const content: SVGElement;
  export default content;
}

declare module 'topbar/Topbar';

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}
