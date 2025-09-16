import { Marker, Line, TextBox } from "../types/whiteboardTypes";

export interface WhiteboardState {
  markers: Marker[];
  lines: Line[];
  textBoxes: TextBox[];
  undoStack: WhiteboardState[];
  redoStack: WhiteboardState[];
}

export type WhiteboardAction =
  | { type: "ADD_MARKER"; marker: Marker }
  | { type: "MOVE_MARKER"; index: number; x: number; y: number }
  | { type: "REMOVE_MARKER"; index: number }
  | { type: "ADD_LINE"; line: Line }
  | { type: "ADD_TEXTBOX"; textBox: TextBox }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "RESET" };

export function whiteboardReducer(state: WhiteboardState, action: WhiteboardAction): WhiteboardState {
  switch (action.type) {
    case "ADD_MARKER":
      return {
        ...state,
        markers: [...state.markers, action.marker],
        undoStack: [...state.undoStack, state],
        redoStack: [],
      };
    case "MOVE_MARKER":
      return {
        ...state,
        markers: state.markers.map((m, i) =>
          i === action.index ? { ...m, x: action.x, y: action.y } : m
        ),
        undoStack: [...state.undoStack, state],
        redoStack: [],
      };
    case "REMOVE_MARKER":
      return {
        ...state,
        markers: state.markers.filter((_, i) => i !== action.index),
        undoStack: [...state.undoStack, state],
        redoStack: [],
      };
    case "ADD_LINE":
      return {
        ...state,
        lines: [...state.lines, action.line],
        undoStack: [...state.undoStack, state],
        redoStack: [],
      };
    case "ADD_TEXTBOX":
      return {
        ...state,
        textBoxes: [...state.textBoxes, action.textBox],
        undoStack: [...state.undoStack, state],
        redoStack: [],
      };
    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1] ?? state;
      return {
        markers: prev.markers,
        lines: prev.lines,
        textBoxes: prev.textBoxes,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [state, ...state.redoStack],
      };
    }
    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[0] ?? state;
      return {
        markers: next.markers,
        lines: next.lines,
        textBoxes: next.textBoxes,
        undoStack: [...state.undoStack, state],
        redoStack: state.redoStack.slice(1),
      };
    }
    case "RESET":
      return {
        markers: [],
        lines: [],
        textBoxes: [],
        undoStack: [],
        redoStack: [],
      };
    default:
      return state;
  }
}
