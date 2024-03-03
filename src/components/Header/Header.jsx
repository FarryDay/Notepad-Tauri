import * as React from 'react';
import {appWindow} from "@tauri-apps/api/window";

function Header() {
  return (
    <div data-tauri-drag-region={true}
         className="bg-black flex justify-between items-center transition-all duration-300 p-1 hover:p-3">
      <h1 className="text-2xl text-white">Заметки</h1>
      <div>
        <button className="text-white hover:bg-white hover:text-black duration-500 transition-all p-2"
                onClick={() => appWindow.minimize()}>-
        </button>
        <button className="text-white hover:bg-white hover:text-black duration-500 transition-all p-2"
                onClick={() => appWindow.close()}>x
        </button>
      </div>

    </div>
  );
};

export default Header;