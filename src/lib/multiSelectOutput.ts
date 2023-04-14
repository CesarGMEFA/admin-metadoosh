import { Dispatch, SetStateAction, useState } from "react";

export default function multiSelectOutput(idElement:string, setData:Dispatch<SetStateAction<string[]>>): void {
  // const [inputValue, setInputValue] = useState('')
  const box = document.querySelector(idElement);
  const input = document.querySelector(`${idElement} input`);
  let data: string[] = []

  const createTag = (label: string): HTMLElement => {
    const div = document.createElement("div");
    div.setAttribute(
      "class",
      "tag flex items-center text-xs text-white bg-gray-doosh border-solid border-black border-2 rounded-md p-1 m-1"
    );
    const span = document.createElement("span");
    span.textContent = label;
    const closeBtn = document.createElement(`i`);
    closeBtn.textContent = "x";
    closeBtn.setAttribute(
      "class",
      "close text-sm text-white ml-2 cursor-pointer hover:text-red-500 focus:text-red-600"
    );
    closeBtn.setAttribute("data-item", label);

    div.appendChild(span);
    div.appendChild(closeBtn);
    return div;
  };

  const reset = () => {
    document.querySelectorAll(".tag").forEach((tag) => {
      tag.parentElement?.removeChild(tag);
    });
  };

  const addTags = (): void => {
    reset();
    data.forEach((tag: string) => {
      const htmlTag = createTag(tag);
      box?.insertBefore(htmlTag,input);
    });
  };

  input?.addEventListener("keyup", (event) => {
    const inputTag = input as HTMLInputElement;
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === "Shift") {
      data.push(inputTag.value)
      addTags();
      setData([...data])
      inputTag.value = "";
    }
  });

  document.addEventListener("click", (e) => {
    const clicked = e.target as HTMLElement;
    if (clicked.tagName === "I") {
      const value = clicked.getAttribute("data-item");
      const index = data.indexOf(value as string);
      // tags = tags.splice(index,1);
      data.splice(index,1);
      setData(data)
      addTags();
    }
  });
}

//       const box = document.querySelector('.tagContainer')
//       const input = document.querySelector('.tagContainer input')
//       let tags: string[] = []
  
//       const createTag = (label:string): HTMLElement => {
//         const div = document.createElement('div')
//         div.setAttribute('class', 'tag flex items-center text-xs text-white bg-[#212121] border-solid border-black border-2 rounded-md p-1 m-1')
//         const span = document.createElement('span')
//         span.textContent = label
//         const closeBtn = document.createElement(`i`)
//         closeBtn.textContent = 'x'
//         closeBtn.setAttribute('class', 'close text-sm text-white ml-2 cursor-pointer hover:text-red-500 focus:text-red-600')
//         closeBtn.setAttribute('data-item', label)
  
//         div.appendChild(span)
//         div.appendChild(closeBtn)
//         return div
//       }
  
//       const reset = () => {
//         document.querySelectorAll('.tag').forEach( tag => {
//           tag.parentElement?.removeChild(tag)
//         })
//       }
  
//       const addTags = ():void => {
//         reset()
//         tags.slice().reverse().forEach( (tag:string) => {
//           const htmlTag = createTag(tag)
//           box?.prepend(htmlTag)
//         })
//       }
  
//       input?.addEventListener('keyup', event => {
//         const inputTag = input as HTMLInputElement
//         const keyboardEvent = event as KeyboardEvent
//         if (keyboardEvent.key === 'Shift') {
//           tags.push(inputTag.value)
//           addTags()
//           inputTag.value = ''
//         }
//       })
  
//       document.addEventListener('click', (e) => {
//         const clicked = e.target as HTMLElement
//         if (clicked.tagName === 'I') {
//           const value = clicked.getAttribute('data-item')
//           const index = tags.indexOf(value as string)
//           tags = [...tags.slice(0,index), ...tags.slice(index+1)]
//           console.log('tags', tags)
//           addTags()
//         }
//       })