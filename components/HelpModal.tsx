import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col text-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-green-400">タスクマトリクスへようこそ！</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </header>

        <main className="p-6 overflow-y-auto space-y-6">
          <p>
            このアプリは「アイゼンハワー・マトリクス」を元に、あなたのタスクを「重要度」と「緊急度」で整理し、生産性を向上させるためのツールです。
          </p>

          <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-green-500 mb-2">主な機能</h3>
                <ul className="list-disc list-inside space-y-2 pl-2 text-gray-400">
                    <li>
                        <strong className="text-gray-200">タブ機能:</strong> 「マイプロジェクト」「プライベート」のように、複数のタスクリストを管理できます。
                        <p className="text-sm pl-6"><strong>タブ名の変更:</strong> タブ名をダブルクリックすると編集できます。</p>
                    </li>
                    <li>
                        <strong className="text-gray-200">タスクの追加:</strong> 画面右下の<span className="inline-block bg-green-600 text-white rounded-full h-5 w-5 text-center mx-1">+</span>ボタンから新しいタスクを追加できます。「重要度」と「緊急度」を選択すると、自動的に適切な領域に配置されます。
                    </li>
                    <li>
                        <strong className="text-gray-200">タスクの移動と並び替え:</strong>
                        <p className="text-sm pl-6"><strong>移動:</strong> タスクをドラッグ＆ドロップして、別の領域（A, B, C, D）へ移動できます。</p>
                        <p className="text-sm pl-6"><strong>並び替え:</strong> 同じ領域内でタスクをドラッグし、別のタスクの上にドロップすると、順番を入れ替えることができます。</p>
                    </li>
                    <li>
                        <strong className="text-gray-200">タスクの編集と削除:</strong>
                        <p className="text-sm pl-6"><strong>編集:</strong> 各タスクカードの鉛筆アイコンをクリックすると、内容を編集できます。</p>
                        <p className="text-sm pl-6"><strong>削除:</strong> ゴミ箱アイコンをクリックすると、タスクを削除できます。（確認ダイアログが表示されます）</p>
                    </li>
                    <li>
                        <strong className="text-gray-200">タスク一覧表示:</strong> 画面右下のリストアイコンをクリックすると、すべてのタスクを一覧で表示できます。一覧画面では、タスクの完了チェック、編集、削除が可能です。
                    </li>
                    <li>
                        <strong className="text-gray-200">データについて:</strong> 入力されたすべてのデータは、お使いのブラウザ内に安全に保存されます。他の誰かにデータを見られることはありません。
                    </li>
                </ul>
            </div>
          </div>
        </main>

        <footer className="p-4 border-t border-gray-700 flex-shrink-0 text-right">
            <button 
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
                閉じる
            </button>
        </footer>
      </div>
    </div>
  );
};

export default HelpModal;