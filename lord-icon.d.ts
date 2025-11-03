import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': {
        src?: string;
        trigger?: string;
        colors?: string;
        delay?: number | string;
        stroke?: number | string;
        scale?: number | string;
        target?: string;
        style?: React.CSSProperties;
      };
    }
  }
}
