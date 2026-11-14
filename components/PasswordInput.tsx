'use client';

import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ label, ...input }: Omit<ComponentProps<'input'>, 'type' | 'ref'> & { label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = ref.current?.form;
    const hide = () => setVisible(false);
    form?.addEventListener('reset', hide);
    return () => form?.removeEventListener('reset', hide);
  }, []);

  const Icon = visible ? EyeOff : Eye;
  return <div className="password-input">
    <input {...input} ref={ref} type={visible ? 'text' : 'password'} spellCheck={false} autoCapitalize="none" />
    <button type="button" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-controls={input.id}
      disabled={input.disabled} onClick={() => setVisible((value) => !value)}>
      <Icon size={18} aria-hidden="true" />
    </button>
  </div>;
}
