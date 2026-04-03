export type PageType = "blank" | "ruled" | "dotted" | "grid";
export type ElementType = "text" | "image";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
}

export type JournalElement = TextElement | ImageElement;

export interface Page {
  id: string;
  pageType: PageType;
  bgColor: string;
  elements: JournalElement[];
}

export interface Spread {
  id: string;
  left: Page;
  right: Page;
}

export type ActiveTool = "select" | "text" | "image";