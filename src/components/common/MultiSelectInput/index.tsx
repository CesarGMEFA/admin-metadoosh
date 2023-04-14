import { useRef, useEffect, Dispatch, SetStateAction } from 'react'
import multiSelectOutput from '@lib/multiSelectOutput'

type Props = {
  selectType: string,
  setData: Dispatch<SetStateAction<string[]>>
}
export default function MultiSelectInput({selectType, setData}:Props) {
  const render = useRef(0)

  useEffect(() => {
    if (render.current === 1) {
      multiSelectOutput(`.tagContainer-${selectType}`, setData)
    }

    render.current += 1
  }, [selectType, setData])

  return (
    <div className={`tagContainer-${selectType} h-11 flex flex-row flex-wrap items-center border-gray-800 border-solid border-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
    >

      <input className='flex-1 p-1 text-xs outline-none focus:ring-transparent focus:outline-none border-0' type="text" />
    </div>
  )
}