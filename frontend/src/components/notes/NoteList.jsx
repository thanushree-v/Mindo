import NoteCard from './NoteCard'
import { HiOutlineDocumentText } from 'react-icons/hi2'

export default function NoteList({ notes, onDelete, onEdit }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-12">
        <HiOutlineDocumentText className="mx-auto text-gray-300" size={48} />
        <p className="text-gray-500 font-medium mt-3">No notes yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Capture a thought to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
