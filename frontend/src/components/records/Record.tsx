import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  Timestamp,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore'
import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'
import Button from '../Button'
import { datesToDuration, secondsToDuration } from './duration'

type RecordProps = {
  doc: QueryDocumentSnapshot<DocumentData>
}

type RecordData = {
  class: DocumentReference
  class_name: string
  duration: number
  start: Timestamp
  finish: Timestamp
}

export default function Record({ doc }: RecordProps) {
  const recordData = doc.data() as RecordData
  const [editing, setEditing] = useState(false)

  const [start, setStart] = useState(recordData.start.toDate())
  const [finish, setFinish] = useState(recordData.finish.toDate())

  async function deleteRecord() {
    await deleteDoc(doc.ref)
  }

  async function saveEdits() {
    await updateDoc(doc.ref, {
      start,
      finish,
      duration: (finish.getTime() - start.getTime()) / 1000,
    })

    setEditing(false)
    return
  }

  return (
    <div className="rounded-lg border-2 border-black p-2 grid grid-cols-8 grid-rows-1 items-center text-center">
      <p className="font-bold col-span-1 text-left">{recordData.class_name}</p>
      <div className="col-span-2">
        {!editing && (
          <p>
            <span className="font-bold">Start: </span>
            {recordData.start.toDate().toLocaleString()}
          </p>
        )}
        {editing && (
          <div className="flex items-center justify-center">
            <p className="font-bold flex mr-2">Start</p>
            <DateTimePicker onChange={setStart} value={start} />
          </div>
        )}
      </div>
      <div className="col-span-2">
        {!editing && (
          <p>
            <span className="font-bold">Finish: </span>
            {recordData.finish.toDate().toLocaleString()}
          </p>
        )}
        {editing && (
          <div className="flex items-center justify-center col-span-2">
            <p className="font-bold flex mr-2">Finish:</p>
            <DateTimePicker onChange={setFinish} value={finish} />
          </div>
        )}
      </div>
      <div className="col-span-2">
        <p>
          <span className="font-bold">Duration: </span>
          {editing
            ? datesToDuration(start, finish)
            : secondsToDuration(recordData.duration)}
        </p>
      </div>
      <div className="flex gap-1 justify-end col-span-1">
        {editing && <Button onClick={saveEdits}>Save</Button>}
        {!editing && (
          <>
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <Button onClick={deleteRecord}>Delete</Button>
          </>
        )}
      </div>
    </div>
  )
}
