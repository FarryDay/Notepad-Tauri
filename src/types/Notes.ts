import {Store} from "tauri-plugin-store-api";

export type Note = {
  name: string,
  text: string,
}

export enum MenuResponse {
  "CREATE_NEW_NOTE"= 0
}

export interface CreateNoteProps {
  store: Store;
  updateNotes: () => void;
}