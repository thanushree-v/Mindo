import IdeaCard from './IdeaCard'

export default function IdeaList({ ideas, onDelete, onEdit, onConvert }) {
  if (!ideas || ideas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">{'💡'}</p>
        <p className="text-gray-500 font-medium">No ideas yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Capture a thought to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onDelete={onDelete}
          onEdit={onEdit}
          onConvert={onConvert}
        />
      ))}
    </div>
  )
}
