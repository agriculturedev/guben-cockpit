import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import {Level} from "@tiptap/extension-heading"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Heading1, Heading2, Eraser,
  Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Palette, Type, Undo, Redo, LucideIcon,
  Heading as HeadingIcon
} from 'lucide-react'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useDebouncedCallback} from "@/hooks/useDebouncedCallback";

interface MenuButtonProps {
  icon: LucideIcon;
  isActive?: boolean;
  onClick: () => void;
  label: string;
}

const MenuButton = ({ icon: Icon, isActive = false, onClick, label }: MenuButtonProps) => (
  <button
    onClick={onClick}
    type="button"
    className={`p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-300' : ''}`}
    title={label}
    aria-label={label}
  >
    <Icon size={18} />
  </button>
)

interface MenuProps {
  editor: Editor | null;
}

const HeadingDropdown = ({ editor }: MenuProps) => {
  if (!editor) return null;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const options: Level[] = [1, 2, 3];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className={`p-2 rounded hover:bg-gray-200 flex items-center ${
          editor.isActive('heading') ? 'bg-gray-300' : ''
        }`}
        type="button"
        title="Heading"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HeadingIcon size={18} />
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg p-1 z-10 top-full left-0 mt-1 min-w-24">
          {options.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level }).run();
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-1 hover:bg-gray-100 ${
                editor.isActive('heading', { level }) ? 'bg-gray-200' : ''
              }`}
            >
              H{level}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().setParagraph().run();
              setIsOpen(false);
            }}
            className={`block w-full text-left px-3 py-1 hover:bg-gray-100 ${
              editor.isActive('paragraph') ? 'bg-gray-200' : ''
            }`}
          >
            Normal text
          </button>
        </div>
      )}
    </div>
  );
};

const ColorPicker = ({ editor }: MenuProps) => {
  const [color, setColor] = useState<string>("#000000");
  if (!editor) return null;


  // Preset common colors
  const presetColors = [
    '#cd1421', // Guben Red
    '#000000', // Black
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
  ];

  const setColorOverride = useDebouncedCallback((color: string) => {
    setColor(color)
    editor.chain().focus().setColor(color).run()
  }, 100);

  return (
    <div className="relative inline-block group">
      <button className={"p-2 rounded hover:bg-gray-200"} type="button" title="Text Color">
        <Palette size={18} className={`stroke-[${color}]`} />
      </button>
      <div className="absolute hidden group-hover:block bg-white border rounded shadow-lg p-3 z-10 w-52 left-0">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom Color</label>
          <input
            type="color"
            className="w-full h-8 cursor-pointer"
            onChange={(e) => setColorOverride(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Hex Value</label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-1">#</span>
            <input
              type="text"
              maxLength={6}
              placeholder="RRGGBB"
              className="border rounded px-2 py-1 text-sm flex-1"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9A-Fa-f]{6}$/.test(value)) {
                  setColorOverride(`#${value}`);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preset Colors</label>
          <div className="flex flex-wrap gap-1">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColorOverride(color)}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setColorOverride("#000000")}
            className="w-full text-center text-sm text-gray-700 hover:text-blue-500"
          >
            Remove Color
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: MenuProps) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-gray-100 mb-2">
      <div className="flex gap-1 mr-2">
        <MenuButton icon={Undo} label="Undo" onClick={() => editor.chain().focus().undo().run()} />
        <MenuButton icon={Redo} label="Redo" onClick={() => editor.chain().focus().redo().run()} />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <div className="flex gap-1 mr-2">
        <MenuButton
          icon={Bold}
          label="Bold"
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <MenuButton
          icon={Italic}
          label="Italic"
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <MenuButton
          icon={UnderlineIcon}
          label="Underline"
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <MenuButton
          icon={Strikethrough}
          label="Strike"
          isActive={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ColorPicker editor={editor} />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <div className="flex gap-1 mr-2">
        <HeadingDropdown
          editor={editor}
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      {/* TODO: auto adding of new list items doesn't seem to work properly */}
      {/*<div className="flex gap-1 mr-2">*/}
      {/*  <MenuButton*/}
      {/*    icon={List}*/}
      {/*    label="Bullet List"*/}
      {/*    isActive={editor.isActive('bulletList')}*/}
      {/*    onClick={() => editor.chain().focus().toggleBulletList().run()}*/}
      {/*  />*/}
      {/*  <MenuButton*/}
      {/*    icon={ListOrdered}*/}
      {/*    label="Ordered List"*/}
      {/*    isActive={editor.isActive('orderedList')}*/}
      {/*    onClick={() => editor.chain().focus().toggleOrderedList().run()}*/}
      {/*  />*/}
      {/*</div>*/}

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <div className="flex gap-1 mr-2">
        <MenuButton
          icon={AlignLeft}
          label="Align Left"
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />
        <MenuButton
          icon={AlignCenter}
          label="Align Center"
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />
        <MenuButton
          icon={AlignRight}
          label="Align Right"
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />
        <MenuButton
          icon={AlignJustify}
          label="Justify"
          isActive={editor.isActive({ textAlign: 'justify' })}
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      {/* TODO@JOREN: not sure if we want these options*/}
      {/*<div className="flex gap-1">*/}
      {/*  <MenuButton*/}
      {/*    icon={Quote}*/}
      {/*    label="Blockquote"*/}
      {/*    isActive={editor.isActive('blockquote')}*/}
      {/*    onClick={() => editor.chain().focus().toggleBlockquote().run()}*/}
      {/*  />*/}
      {/*  <MenuButton*/}
      {/*    icon={Code}*/}
      {/*    label="Code Block"*/}
      {/*    isActive={editor.isActive('codeBlock')}*/}
      {/*    onClick={() => editor.chain().focus().toggleCodeBlock().run()}*/}
      {/*  />*/}

      {/*  <MenuButton*/}
      {/*    icon={LinkIcon}*/}
      {/*    label="Link"*/}
      {/*    isActive={editor.isActive('link')}*/}
      {/*    onClick={() => {*/}
      {/*      const previousUrl = editor.isActive('link') ? editor.getAttributes('link').href : '';*/}
      {/*      const url = window.prompt('Enter URL', previousUrl);*/}

      {/*      if (url === null) {*/}
      {/*        return; // User canceled the prompt*/}
      {/*      }*/}

      {/*      if (url === '') {*/}
      {/*        editor.chain().focus().extendMarkRange('link').unsetLink().run();*/}
      {/*        return;*/}
      {/*      }*/}

      {/*      // Ensure URL has protocol*/}
      {/*      const finalUrl = url.startsWith('http') ? url : `https://${url}`;*/}
      {/*      editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();*/}
      {/*    }}*/}
      {/*  />*/}

      {/*  <MenuButton*/}
      {/*    icon={ImageIcon}*/}
      {/*    label="Image"*/}
      {/*    onClick={() => {*/}
      {/*      const url = window.prompt('Enter image URL');*/}
      {/*      if (url) {*/}
      {/*        editor.chain().focus().setImage({ src: url, alt: 'Image' }).run();*/}
      {/*      }*/}
      {/*    }}*/}
      {/*  />*/}

      {/*  <MenuButton*/}
      {/*    icon={Eraser}*/}
      {/*    label="Clear Formatting"*/}
      {/*    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}*/}
      {/*  />*/}
      {/*</div>*/}
    </div>
  );
};

interface EditorProps {
  content: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

const HtmlEditor = ({ content, onChange, placeholder = 'Start writing...' }: EditorProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Fix the list issue by configuring the bullet and ordered list
        bulletList: {
          keepMarks: true,
          keepAttributes: true, // Keep attributes when toggling lists
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true, // Keep attributes when toggling lists
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Typography,
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose p-3 min-h-[200px] border rounded-lg bg-white focus:outline-none ${
          isFocused ? 'ring-2 ring-blue-400' : ''
        }`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="overflow-hidden"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <div>
          {editor && (
            <span>
              {editor.storage.characterCount?.characters?.() ?? 0} characters
            </span>
          )}
        </div>
        <div>
          <button
            onClick={() => {
              if (editor) {
                const html = editor.getHTML();
                navigator.clipboard.writeText(html);
              }
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            Copy HTML
          </button>
        </div>
      </div>
    </div>
  );
};

export default HtmlEditor;
