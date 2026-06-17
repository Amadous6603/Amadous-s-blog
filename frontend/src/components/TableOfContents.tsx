import { useState, useEffect, type RefObject } from 'react';
import type { TocItem } from '../types';

interface Props {
  items: TocItem[];
  contentRef: RefObject<HTMLDivElement | null>;
}

export default function TableOfContents({ items, contentRef }: Props) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    items.forEach(({ id }) => {
      const el = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items, contentRef]);

  if (items.length === 0) return null;

  return (
    <nav className="toc-container glass-strong hidden xl:block">
      <h4 className="font-display text-sm font-bold mb-3 pb-2 border-b border-white/20">目录</h4>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`toc-h${item.level} ${activeId === item.id ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
