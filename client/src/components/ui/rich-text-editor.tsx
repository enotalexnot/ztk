import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Link, Heading2, Heading3, Underline } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import TextAlign from '@tiptap/extension-text-align'
import LinkExtension from '@tiptap/extension-link'
import UnderlineExtension from '@tiptap/extension-underline'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Введите текст..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      UnderlineExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('underline')}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Button
          variant="outline"
          size="sm"
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}