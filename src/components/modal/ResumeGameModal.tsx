export function ResumeGameModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-6 rounded-xl shadow-lg border-2 border-neutral-800 dark:border-yellow-400">
        <h2 className="text-lg font-bold mb-4">Retomar partida?</h2>
        <p className="mb-4">Você possui uma partida em andamento. Deseja retomar?</p>
        <div className="flex gap-4 justify-end">
          <button className="px-4 py-2 bg-green-700 text-white rounded" onClick={onConfirm}>Sim</button>
          <button className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded" onClick={onCancel}>Não</button>
        </div>
      </div>
    </div>
  );
}