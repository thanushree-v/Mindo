import NoteCard from './NoteCard'

export default function NoteList({ notes, onDelete, onEdit }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">{'📝'}</p>
        <p className="text-gray-500 font-medium">No notes yet</p>
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
