import "./App.scss";
import Header from "./components/Header/Header.jsx"
import {Store} from "tauri-plugin-store-api";
import React, {useEffect, useRef, useState} from "react";
import {Note} from "./types/Notes.ts";
import Menu from '@mui/material/Menu';
import CreateNote from "./components/Modals/CreateNote.tsx";

const store: Store = new Store(".notepad.dat");


function App() {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const menuRef = useRef(null);

  const [selected, setSelected] = useState<null | Note>(null);

  const handleClose = () => {
    setContextMenu(null);
  };

  const [value, setValue] = useState<string>("");
  const [data, setData] = useState<Note[]>([])

  useEffect(() => {
    fetchData().then(() => {
    })
  }, [])

  const fetchData = async () => {
    const data = await store.get<Note[]>("notes") || []
    await setData(data.sort((a, b) => a.name > b.name ? 1 : -1))
  }

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if ((event.target as Node).isEqualNode(menuRef.current)) {
      setContextMenu(
        contextMenu === null
          ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          } : null,
      );
    }
  };

  const deleteNote = async (note: Note) => {
    const data: Note[] = await store.get("notes") || [];
    const array = data.filter(key => key.name !== note.name)
    await store.set("notes", array)
    if (selected?.name == note.name) {
      setSelected(null)
    }
    fetchData()
  }

  const updateDataInput = async (event) => {
    setValue(event.target.value);
    // await store.set("", event.target.value);
    const data = await store.get<Note[]>("notes") || []
    const note = data.filter(note => note.name === selected?.name)[0]
    if (!note) return;
    note.text = event.target.value;
    setSelected(note)
    await store.set("notes", [...data.filter(note => note.name !== selected?.name), note])
  }

  return (
    <div className="h-screen overflow-hidden scroll-">
      <Header/>
      <div className="flex h-full" onContextMenu={() => {
        // e.preventDefault();
        // handleClick(e)
      }}
      >
        <div ref={menuRef} className="bg-neutral-800 text-white h-full w-1/6" onContextMenu={handleContextMenu}>
          <Menu
            id="basic-menu"
            open={contextMenu !== null}
            onClose={() => handleClose()}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{mt: 2}}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? {top: contextMenu.mouseY, left: contextMenu.mouseX}
                : undefined
            }
          >
            <CreateNote store={store} updateNotes={fetchData}/>
          </Menu>
          <h1 className="text-center font-bold">Заметки</h1>
          <div className="flex flex-col gap-1 px-1">
            {data.map((note) => {
              return (
                <div className="bg-white rounded-sm"
                     onContextMenu={() => {
                       console.log(1)
                     }}>
                  <div
                    className={selected?.name == note.name ? "text-center bg-orange-500 text-black flex justify-around items-center" : "text-center text-black flex justify-around items-center "}>
                    <div className="p-2" onClick={async () => {
                      setSelected(note)
                      const data: Note[] = await store.get("notes") || []
                      setValue(data.filter(key => note.name === key.name)[0].text)
                    }}>
                      <p>{note.name}</p>
                    </div>
                    <button onClick={() => deleteNote(note)} className="text-white bg-red-600 rounded-full px-2">X
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {selected?.name
          ?
          <div className="w-full bg-neutral-900 p-5">
            <h1 className="font-bold text-orange-500">{selected?.name}</h1>
            <textarea className="w-full h-full bg-neutral-800 text-white p-1 " value={value}
                      onChange={updateDataInput}/>
          </div>
          :
          <div className="w-full bg-neutral-900 p-5">
          </div>
        }
      </div>
    </div>
  );
}

export default App;
