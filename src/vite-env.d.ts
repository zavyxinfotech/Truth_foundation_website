/// <reference types="vite/client" />

interface ImagetoolsPicture {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
}

declare module '*&as=picture' {
  const picture: ImagetoolsPicture;
  export default picture;
}

declare module '*&format=webp' {
  const src: string;
  export default src;
}

declare module '*?format=webp' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
