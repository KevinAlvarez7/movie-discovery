declare module 'react-stars' {
  interface ReactStarsProps {
    count?: number;
    value?: number;
    edit?: boolean;
    size?: number;
    color1?: string;
    color2?: string;
  }

  const ReactStars: React.FC<ReactStarsProps>;
  export default ReactStars;
} 