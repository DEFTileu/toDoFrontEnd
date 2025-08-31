import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { ImagePlus, Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo, Link as LinkIcon, Link2Off, CheckSquare } from 'lucide-react'
import { useRef, useState, useCallback } from 'react'
import { uploadFile } from '../../services/fileService'
import { Modal } from './Modal'
import './RichTextEditor.css'

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  readOnly?: boolean;
  onCheckboxChange?: (content: string) => void;
}

interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}

// Функция для правильного сохранения изображений в HTML (только классы)
const processImageSizes = (html: string): string => {
  if (!html || html.trim() === '') return '';

  // Обрабатываем изображения, добавляя только нужные классы (убираем лишние атрибуты)
  let processed = html.replace(/<img([^>]*?)>/g, (match) => {
    // Убираем data-image-size и style атрибуты из сохраняемого HTML
    let cleanMatch = match
      .replace(/\s*data-image-size="[^"]*"/g, '')
      .replace(/\s*style="[^"]*"/g, '');

    // Если изображение уже имеет правильные классы, возвращаем очищенную версию
    if (cleanMatch.includes('rich-image-small') ||
        cleanMatch.includes('rich-image-medium') ||
        cleanMatch.includes('rich-image-large')) {
      return cleanMatch;
    }

    // Если только базовый класс rich-image, добавляем средний размер по умолчанию
    if (cleanMatch.includes('rich-image')) {
      return cleanMatch.replace('class="rich-image"', 'class="rich-image rich-image-medium"');
    }

    return cleanMatch;
  });

  return processed;
};

// Функция для проверки, является ли контент пустым (только для реально пустого контента)
const isContentEmpty = (html: string): boolean => {
  if (!html || html.trim() === '') return true;

  // Удаляем HTML теги и проверяем, есть ли текстовый контент
  const textContent = html.replace(/<[^>]*>/g, '').trim();
  return textContent === '';
};

const RichTextEditor = ({
  content,
  onChange,
  placeholder = 'Start typing...',
  minHeight = '250px',
  className = '',
  readOnly = false,
  onCheckboxChange,
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const handleCheckboxChange = useCallback((newContent: string) => {
    if (onCheckboxChange) {
      onCheckboxChange(newContent);
    }
  }, [onCheckboxChange]);

  const showImageSizeModal = useCallback((imgElement: HTMLImageElement) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium mb-4">Выберите размер изображения</h3>
        <div class="space-y-3">
          <button id="smallSize" class="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-300 transition-colors">
            <span>Маленький (200px)</span>
            <div class="w-16 h-12 bg-gray-200 rounded border"></div>
          </button>
          <button id="mediumSize" class="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-300 transition-colors">
            <span>Средний (400px)</span>
            <div class="w-16 h-12 bg-gray-300 rounded border"></div>
          </button>
          <button id="largeSize" class="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-300 transition-colors">
            <span>Большой (100%)</span>
            <div class="w-16 h-12 bg-gray-400 rounded border"></div>
          </button>
        </div>
        <div class="mt-6 flex justify-end">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" id="cancelSizeBtn">Отмена</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const smallBtn = modal.querySelector('#smallSize') as HTMLButtonElement;
    const mediumBtn = modal.querySelector('#mediumSize') as HTMLButtonElement;
    const largeBtn = modal.querySelector('#largeSize') as HTMLButtonElement;
    const cancelBtn = modal.querySelector('#cancelSizeBtn') as HTMLButtonElement;

    const applySize = (width: string, sizeClass: string) => {
      // Удаляем все существующие классы размеров
      imgElement.className = imgElement.className.replace(/\brich-image-(small|medium|large)\b/g, '');

      // Устанавливаем inline стили И класс для надежности
      imgElement.style.width = width;
      imgElement.style.height = 'auto';
      imgElement.classList.add(sizeClass);

      // Устанавливаем data-атрибут для сохранения размера
      imgElement.setAttribute('data-image-size', sizeClass);

      // Принудительно обновляем HTML в редакторе
      if (editor) {
        const html = editor.getHTML();
        onChange(processImageSizes(html));
      }

      document.body.removeChild(modal);
    };

    smallBtn.onclick = () => applySize('200px', 'rich-image-small');
    mediumBtn.onclick = () => applySize('400px', 'rich-image-medium');
    largeBtn.onclick = () => applySize('100%', 'rich-image-large');
    cancelBtn.onclick = () => document.body.removeChild(modal);

    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };
  }, [onChange]);

  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      StarterKit.configure({
        link: false,
        bulletList: {
          HTMLAttributes: {
            class: 'rich-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'rich-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'rich-list-item',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'rich-blockquote',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rich-image',
        },
        allowBase64: true,
        inline: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none before:h-0',
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-indigo-600 underline hover:text-indigo-800 transition-colors',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'space-y-2 ml-0',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start gap-3 group',
        },
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      const processedContent = processImageSizes(newContent);

      // Восстанавливаем размеры изображений после обновления
      setTimeout(() => {
        if (editor.isDestroyed || !editor.view.dom) {
          return;
        }
        const images = editor.view.dom.querySelectorAll('img[data-image-size]') as NodeListOf<HTMLImageElement>;
        images.forEach(img => {
          const sizeClass = img.getAttribute('data-image-size');
          if (sizeClass) {
            img.classList.add(sizeClass);
            if (sizeClass === 'rich-image-small') {
              img.style.width = '200px';
            } else if (sizeClass === 'rich-image-medium') {
              img.style.width = '400px';
            } else if (sizeClass === 'rich-image-large') {
              img.style.width = '100%';
            }
            img.style.height = 'auto';
          }
        });
      }, 0);

      onChange(processedContent);
    },
    onCreate: ({ editor }) => {
      // Восстанавливаем размеры изображений при создании редактора
      setTimeout(() => {
        // Проверяем, что редактор не уничтожен и view доступен
        if (editor.isDestroyed || !editor.view.dom) {
          return;
        }

        const images = editor.view.dom.querySelectorAll('img.rich-image') as NodeListOf<HTMLImageElement>;
        images.forEach(img => {
          // Определяем размер по CSS классу и применяем соответствующие стили
          if (img.classList.contains('rich-image-small')) {
            img.style.width = '200px';
            img.style.height = 'auto';
            img.setAttribute('data-image-size', 'rich-image-small');
          } else if (img.classList.contains('rich-image-medium')) {
            img.style.width = '400px';
            img.style.height = 'auto';
            img.setAttribute('data-image-size', 'rich-image-medium');
          } else if (img.classList.contains('rich-image-large')) {
            img.style.width = '100%';
            img.style.height = 'auto';
            img.setAttribute('data-image-size', 'rich-image-large');
          } else if (img.classList.contains('rich-image')) {
            // Если только базовый класс, добавляем средний размер
            img.classList.add('rich-image-medium');
            img.style.width = '400px';
            img.style.height = 'auto';
            img.setAttribute('data-image-size', 'rich-image-medium');
          }
        });
      }, 100);
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
                // Добавляем изображение с размером по умолчанию
                editor?.chain().focus().setImage({
                  src: url,
                  class: 'rich-image rich-image-medium',
                  'data-image-size': 'rich-image-medium',
                  style: 'width: 400px; height: auto;'
                }).run();
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
                // Добавляем изображение с размером по умолчанию
                editor?.chain().focus().setImage({
                  src: url,
                  class: 'rich-image rich-image-medium',
                  'data-image-size': 'rich-image-medium',
                  style: 'width: 400px; height: auto;'
                }).run();
              })
              .catch((error) => {
                console.error('Image upload failed:', error);
              });
            return true;
          }
        }
        return false;
      },
      handleClick: (_, __, event) => {
        const target = event.target as HTMLElement;

        // Обработка чекбоксов ТОЛЬКО при клике - автосохранение
        if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
          setTimeout(() => {
            const newContent = editor?.getHTML() || '';
            // Вызываем автосохранение ТОЛЬКО для чекбоксов
            handleCheckboxChange(newContent);
            // Обновляем состояние
            onChange(newContent);
          }, 100);
          return true;
        }

        // Обработка изображений только в режиме редактирования
        if (target.tagName === 'IMG' && !readOnly) {
          event.preventDefault();
          showImageSizeModal(target as HTMLImageElement);
          return true;
        }

        return false;
      },
    },
  });

  if (editor && editor.isEditable === readOnly) {
    editor.setEditable(!readOnly);
  }

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      // Добавляем изображение с размером по умолчанию (средний)
      editor.chain().focus().setImage({
        src: url,
        class: 'rich-image rich-image-medium',
        'data-image-size': 'rich-image-medium',
        style: 'width: 400px; height: auto;'
      }).run();
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
        <h3 class="text-lg font-medium mb-4">Добавить изображение</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">URL изображения</label>
            <input type="text" id="imageUrl" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://example.com/image.jpg">
          </div>
          <div class="text-center relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">ИЛИ</span>
            </div>
          </div>
          <div>
            <button id="uploadBtn" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              📁 Выбрать файл
            </button>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50" id="cancelBtn">Отмена</button>
          <button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" id="insertBtn">Вставить</button>
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

  const MenuButton = ({
                        onClick,
                        isActive = false,
                        title,
                        children,
                        disabled = false,
                      }: MenuButtonProps) => (
      <button
          onClick={onClick}
          disabled={disabled}
          className={[
            'flex justify-center items-center p-2.5 rounded-lg transition-all duration-200 border border-transparent',
            disabled
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                : isActive
                    ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200',
          ].join(' ')}
          title={title}
          type="button"
      >
        {children}
      </button>
  );


  return (
    <div className={['rich-text-editor border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg', className].join(' ')}>
      {!readOnly && (
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-3 flex flex-wrap gap-2 items-center">
          <div className="flex gap-1 items-center bg-white rounded-lg p-1 shadow-sm">
            <MenuButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Заголовок"
            >
              <Heading2 className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Жирный (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Курсив (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex gap-1 items-center bg-white rounded-lg p-1 shadow-sm">
            <MenuButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Маркированный список • • •"
            >
              <List className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Нумерованный список 1. 2. 3."
            >
              <ListOrdered className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive('taskList')}
              title="Списо�� задач ☑ ☐"
            >
              <CheckSquare className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Цитата"
            >
              <Quote className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex gap-1 items-center bg-white rounded-lg p-1 shadow-sm">
            <MenuButton
              onClick={openLinkModal}
              isActive={editor.isActive('link')}
              title="Добавить ссылку"
            >
              <LinkIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={handleRemoveLink}
              title="Удалить ссылку"
              disabled={!editor.isActive('link')}
            >
              <Link2Off className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex gap-1 items-center bg-white rounded-lg p-1 shadow-sm">
            <MenuButton
              onClick={addImage}
              title="Добавить изображение (Ctrl+V для вставки)"
            >
              <ImagePlus className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex gap-1 items-center bg-white rounded-lg p-1 shadow-sm">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Отменить (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Повторить (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </MenuButton>
          </div>
        </div>
      )}

      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none focus-within:bg-blue-50/20 transition-colors duration-200 rich-text-content"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

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
          <h3 className="text-lg font-medium mb-4">Добавить ссылку</h3>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Введите URL"
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
              Отмена
            </button>
            <button
              onClick={handleAddLink}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Добавить ссылку
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RichTextEditor;
