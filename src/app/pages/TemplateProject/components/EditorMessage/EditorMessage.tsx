import React, { useState, useRef, memo, useMemo } from 'react';
import JoditEditor from 'jodit-react';

interface EditorInputProps {
  onChangeEdit: (text: string) => void;
  placeholder?: string;
  value?: string;
}

export const EditorMessage = memo(
  (props: EditorInputProps) => {
    const editor = useRef(null);
    const [content] = useState({
      text: '',
    });

    const config = useMemo(() => {
      return {
        readonly: false,
        placeholder: props?.placeholder || 'Start typings...',
        toolbar: true,
        toolbarAdaptive: false,
        buttons: [
          'bold',
          'italic',
          'strikethrough',
          'underline',
          '|',
          'ul',
          'ol',
          'outdent',
          'indent',
          'align',
          '|',
          'brush',
          'fontsize',
          'paragraph',
        ],
      };
    }, [props?.placeholder]);

    const updateData = (text: string) => {
      props.onChangeEdit(text);
    };

    return (
      <JoditEditor
        ref={editor}
        value={content.text || props?.value || ''}
        config={config}
        onChange={(newContent: string) => updateData(newContent)}
      />
    );
  },
  () => true,
);
