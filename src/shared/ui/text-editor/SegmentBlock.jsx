import { DecoratorNode } from "lexical";
import React from "react";
import SegmentBlockView from "./SegmentBlockView"; // ✅ используем внешний файл

export class SegmentBlockNode extends DecoratorNode {
  constructor(text, key) {
    super(key);
    this.__text = text;
  }

  static getType() {
    return "segment-block";
  }

  static clone(node) {
    return new SegmentBlockNode(node.__text, node.__key);
  }

  static importJSON(serialized) {
    return new SegmentBlockNode(serialized.text, null);
  }

  exportJSON() {
    return {
      type: "segment-block",
      version: 1,
      text: this.__text,
    };
  }

  createDOM() {
    return document.createElement("div");
  }

  updateDOM() {
    return false;
  }

  getTextContent() {
    return this.__text;
  }

  decorate() {
    return <SegmentBlockView text={this.__text} />;
  }
}