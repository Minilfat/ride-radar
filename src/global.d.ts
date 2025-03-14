declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export = classes;
}

declare module '*.svg' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}
