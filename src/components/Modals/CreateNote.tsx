import React, {FC} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MenuItem from "@mui/material/MenuItem";
import {CreateNoteProps, Note} from "../../types/Notes.ts";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgb(23 23 23 / 1)',
  border: '2px solid #000',
  boxShadow: 24,
  p: 2,
};

const CreateNote:FC<CreateNoteProps> = ({store, updateNotes}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("")
  const handleOpen = async () => {
    setOpen(true)
  }
  const handleClose = async(res: string) => {

    if(res == "save"){
      const data: Note[] = await store.get("notes") || []

      let boolHaveAlready = false
      for(let key of data){
        if(key.name === value) boolHaveAlready = true
      }

      if(boolHaveAlready) return;

      await store.set("notes", [...data, {name: value, text: ""}])
      updateNotes()
    }
    setOpen(false);
  }

  return (
    <div>
      <MenuItem onClick={handleOpen}>Создать новую заметку</MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <div>
            <p className="text-white">Имя</p>
            <input style={{background: "rgb(38 38 38 / 1)"}} value={value} onChange={(e) => setValue(e.target.value)} type="text" className="border-2 text-white"/>
          </div>
          <button className="bg-green-600 p-2 my-2 rounded-xl text-white" onClick={() => handleClose("save")}>Создать</button>
        </Box>
      </Modal>
    </div>
  );
}

export default CreateNote;