import TaskCard from './TaskCard'

export default function TaskList({ tasks, onComplete, onPostpone, onDelete, onEdit }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">{'📝'}</p>
        <p className="text-gray-500 font-medium">No tasks yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Speak or type a thought to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onComplete}
          onPostpone={onPostpone}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
