import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, MapPin } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  prefix?: string;
  isCustom?: boolean;
}

interface SmartLocationSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onCustomValue?: (customValue: string) => void;
  placeholder?: string;
  label?: string;
  allowCustom?: boolean;
  customInputPlaceholder?: string;
  emptyStateMessage?: string;
  className?: string;
}

export const SmartLocationSelect: React.FC<SmartLocationSelectProps> = ({
  options,
  value,
  onChange,
  onCustomValue,
  placeholder = 'Sélectionner...',
  label,
  allowCustom = false,
  customInputPlaceholder = 'Entrer une valeur personnalisée',
  emptyStateMessage = 'Aucun résultat',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Trouver l'option sélectionnée (peut être custom)
  const selectedOption = options.find(opt => opt.value === value);
  const isCustomSelected = value && !selectedOption;
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasResults = filteredOptions.length > 0;

  // Fermer le dropdown si clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setShowCustomInput(false);
        setCustomValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus sur l'input de recherche quand on ouvre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Focus sur l'input custom quand on l'affiche
  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    setShowCustomInput(false);
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      const trimmedValue = customValue.trim();
      onCustomValue?.(trimmedValue);
      onChange(trimmedValue);
      setIsOpen(false);
      setSearchTerm('');
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const handleCustomInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Bouton principal */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 border-2 rounded-lg text-left transition-all flex items-center justify-between ${
            isOpen
              ? 'border-[#1F4B3F] ring-2 ring-[#1F4B3F]/20'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {selectedOption ? (
              <>
                {selectedOption.prefix && (
                  <span className="text-lg flex-shrink-0">{selectedOption.prefix}</span>
                )}
                <span className="text-gray-900 font-medium truncate">
                  {selectedOption.label}
                </span>
              </>
            ) : isCustomSelected ? (
              <>
                <MapPin className="w-4 h-4 text-[#1F4B3F] flex-shrink-0" />
                <span className="text-gray-900 font-medium truncate">
                  {value}
                </span>
                <span className="text-xs text-[#1F4B3F] bg-[#1F4B3F]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  Personnalisé
                </span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl overflow-hidden">
            {/* Barre de recherche */}
            <div className="p-2 border-b border-gray-100 bg-gray-50">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#1F4B3F] focus:ring-1 focus:ring-[#1F4B3F]/20"
              />
            </div>

            {/* Liste des options */}
            <div className="overflow-y-auto max-h-64">
              {hasResults ? (
                <>
                  {filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        option.value === value ? 'bg-[#1F4B3F]/5' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2 flex-1 min-w-0">
                        {option.prefix && (
                          <span className="text-lg flex-shrink-0">{option.prefix}</span>
                        )}
                        <span className={`font-medium truncate ${
                          option.value === value ? 'text-[#1F4B3F]' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </span>
                      </span>
                      {option.value === value && (
                        <Check className="w-5 h-5 text-[#1F4B3F] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  {emptyStateMessage}
                </div>
              )}
            </div>

            {/* Option personnalisée */}
            {allowCustom && (
              <div className="border-t border-gray-200 bg-gray-50">
                {!showCustomInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(true)}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-100 transition-colors text-[#1F4B3F] font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">
                      {searchTerm ? `Ajouter "${searchTerm}"` : 'Ajouter une option personnalisée'}
                    </span>
                  </button>
                ) : (
                  <div className="p-3 space-y-2">
                    <input
                      ref={customInputRef}
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyDown={handleCustomInputKeyPress}
                      placeholder={customInputPlaceholder}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1F4B3F] focus:ring-1 focus:ring-[#1F4B3F]/20"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCustomSubmit}
                        disabled={!customValue.trim()}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-[#1F4B3F] rounded-md hover:bg-[#1F4B3F]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomInput(false);
                          setCustomValue('');
                        }}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};