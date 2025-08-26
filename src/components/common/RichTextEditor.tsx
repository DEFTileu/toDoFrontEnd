import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link';
import { ImagePlus, Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo, Link as LinkIcon, Link2Off } from 'lucide-react'
import { useRef, useState } from 'react'
import { uploadFile } from '../../services/fileService';
import {Modal} from './Modal';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  readOnly?: boolean; // добавлено
}

const RichTextEditor = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '250px',
  className = '',
  readOnly = false,
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none before:h-0',
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline hover:text-blue-700',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste: (_, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const image = items.find(item => item.type.indexOf('image') === 0);

        if (image) {
          event.preventDefault();
          const blob = image.getAsFile();
          if (blob) {
            uploadFile(blob)
                .then((url) => {
                  editor?.chain().focus().setImage({ src: url }).run();
                })
                .catch((error) => {
                  console.error('Image upload failed:', error);
                });
          }
          return true;
        }
        return false;
      },
      handleDrop: (_, event) => {
        if (event.dataTransfer?.files.length) {
          const file = event.dataTransfer.files[0];
          if (file && file.type.startsWith('image/')) {
            event.preventDefault();
            uploadFile(file)
                .then((url) => {
                  editor?.chain().focus().setImage({ src: url }).run();
                })
                .catch((error) => {
                  console.error('Image upload failed:', error);
                });
            return true;
          }
        }
        return false;
      },
    },
  })

  // Синхронизируем режим редактирования при изменении readOnly
  if (editor && editor.isEditable === readOnly) {
    editor.setEditable(!readOnly);
  }

  if (!editor) {
    return null
  }

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const addImage = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Add Image</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input type="text" id="imageUrl" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://example.com/image.jpg">
          </div>
          <div class="text-center relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>
          <div>
            <button id="uploadBtn" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <svg class="w-5 h-5 mr-2" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Choose Image File
            </button>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" id="cancelBtn">Cancel</button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" id="insertBtn">Insert Image</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const imageUrlInput = modal.querySelector('#imageUrl') as HTMLInputElement;
    const uploadBtn = modal.querySelector('#uploadBtn') as HTMLButtonElement;
    const cancelBtn = modal.querySelector('#cancelBtn') as HTMLButtonElement;
    const insertBtn = modal.querySelector('#insertBtn') as HTMLButtonElement;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    uploadBtn.onclick = () => fileInput.click();
    cancelBtn.onclick = () => document.body.removeChild(modal);

    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleImageUpload(file);
        document.body.removeChild(modal);
      }
    };

    insertBtn.onclick = () => {
      const url = imageUrlInput.value.trim();
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      document.body.removeChild(modal);
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  };

  const openLinkModal = () => {
    setLinkUrl('');
    setIsLinkModalOpen(true);
  };

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.trim() }).run();
    }
    setIsLinkModalOpen(false);
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const MenuButton = ({ onClick, isActive = false, title, children, disabled = false }: any) => (
      <button
          onClick={onClick}
          disabled={disabled}
          className={[
            'p-2 rounded-md transition-colors',
            disabled
                ? 'text-gray-300 cursor-not-allowed'
                : isActive
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
          ].join(' ')}
          title={title}
          type="button"
      >
        {children}
      </button>
  );

  return (
    <div className={[ 'rich-text-editor border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm', className].join(' ')}>
      {!readOnly && (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
          {/* Heading / basic formatting */}
          <div className="flex gap-1 items-center">
            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading"
            >
              <Heading2 className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </MenuButton>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          {/* Lists */}
          <div className="flex gap-1 items-center">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </MenuButton>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          {/* Links */}
            <div className="flex gap-1 items-center">
              <MenuButton
                onClick={openLinkModal}
                isActive={editor.isActive('link')}
                title="Add Link"
              >
                <LinkIcon className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={handleRemoveLink}
                title="Remove Link"
                disabled={!editor.isActive('link')}
              >
                <Link2Off className="w-4 h-4" />
              </MenuButton>
            </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          {/* Image */}
          <div className="flex gap-1 items-center">
            <MenuButton
              onClick={addImage}
              title="Add Image (Ctrl+V to paste)"
            >
              <ImagePlus className="w-4 h-4" />
            </MenuButton>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          {/* History */}
          <div className="flex gap-1 items-center">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </MenuButton>
          </div>
        </div>
      )}
      {/* Editor content */}
      <div
          className="prose prose-sm sm:prose lg:prose-lg max-w-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-6 [&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
          style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input for image upload */}
      <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageUpload(file);
            }
          }}
      />

      <Modal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)}>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Add Link</h3>
          <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddLink();
                }
              }}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
                onClick={handleAddLink}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Add Link
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RichTextEditor
