import {
  addDoc,
  CollectionReference,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore'
import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'
import Button from '../Button'
import { datesToDuration } from './duration'

type NewRecordProps = {
  classDoc: DocumentReference<DocumentData>
  recordsRef: CollectionReference<DocumentData>
}

export default function NewRecord({ classDoc, recordsRef }: NewRecordProps) {
  const [start, setStart] = useState(new Date())
  const [finish, setFinish] = useState(new Date())

  async function addRecord() {
    await addDoc(recordsRef, {
      class: classDoc,
      class_name: classDoc.id,
      start,
      finish,
      duration: Math.round((finish.getTime() - start.getTime()) / 1000),
    })
  }

  return (
    <div className="rounded-lg border-2 border-black p-2 grid grid-cols-8 grid-rows-1 items-center text-center">
      <p className="font-bold col-span-1 text-left">{classDoc.id}</p>
      <div className="flex items-center justify-center col-span-2">
        <p className="font-bold flex mr-2">Start</p>
        <DateTimePicker onChange={setStart} value={start} />
      </div>
      <div className="flex items-center justify-center col-span-2">
        <p className="font-bold flex mr-2">Finish:</p>
        <DateTimePicker onChange={setFinish} value={finish} />
      </div>
      <div className="col-span-2 flex justify-center">
        <p>
          <span className="font-bold">Duration: </span>
          {datesToDuration(start, finish)}
        </p>
      </div>
      <div className="col-span-1 flex justify-end">
        <Button onClick={addRecord}>New</Button>
      </div>
    </div>
  )
}
