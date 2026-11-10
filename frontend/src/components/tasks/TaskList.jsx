import TaskCard from './TaskCard'
import { HiOutlineClipboardDocumentCheck } from 'react-icons/hi2'

export default function TaskList({ tasks, onComplete, onPostpone, onDelete, onEdit }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <HiOutlineClipboardDocumentCheck className="mx-auto text-gray-300" size={48} />
        <p className="text-gray-500 font-medium mt-3">No tasks yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Speak or type a thought to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
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
