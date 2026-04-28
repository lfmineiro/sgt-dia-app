import type { ChangeEvent } from 'react';
import { SpedAccordion } from './SpedAccordion';
import { SpedTextAreaField } from './SpedTextAreaField';
import { SPED_SECTIONS } from '../../../constants/sped';
import type { SpedFormState } from '../../../types/sped.types';

interface SpedSectionsProps {
  formData: SpedFormState;
  openSection: string | null;
  onToggleSection: (section: string) => void;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const SpedSections = ({ formData, openSection, onToggleSection, onChange }: SpedSectionsProps) => {
  return (
    <div className="mt-2 flex flex-col gap-4">
      {SPED_SECTIONS.map((section) => (
        <SpedAccordion
          key={section.id}
          title={section.title}
          isOpen={openSection === section.id}
          onToggle={() => onToggleSection(section.id)}
        >
          {section.fields.map((field) => (
            <SpedTextAreaField
              key={field.id}
              id={field.id}
              label={field.label}
              value={formData[field.id]}
              onChange={onChange}
            />
          ))}
        </SpedAccordion>
      ))}
    </div>
  );
};
