import React from 'react';
import { LegalModal } from './LegalModal';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}) => {
  return <LegalModal isOpen={isOpen} onClose={onClose} defaultTab={defaultTab} />;
};
