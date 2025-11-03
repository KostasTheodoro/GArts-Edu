declare namespace JSX {
  interface IntrinsicElements {
    'lord-icon': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        trigger?: string;
        colors?: string;
        delay?: number;
        stroke?: number;
        scale?: number;
        target?: string;
      },
      HTMLElement
    >;
  }
}
