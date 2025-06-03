// images
declare module '*.png' {
  const value: string;
  export default value;
}

// CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
} 